import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate verification token
    const { data: tokenData, error: tokenError } = await supabase
      .rpc("generate_verification_token");

    if (tokenError) {
      console.error("Error generating verification token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Failed to generate verification token" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const verificationToken = tokenData;

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.verified) {
        return new Response(
          JSON.stringify({ message: "You are already subscribed to our newsletter!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } else {
        // Update existing unverified subscriber with new token
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            verification_token: verificationToken,
            subscribed_at: new Date().toISOString(),
          })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating subscriber:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update subscription" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }
    } else {
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email,
          verification_token: verificationToken,
          verified: false,
          subscribed_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting subscriber:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save subscription" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Send verification email
    const verificationUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/newsletter-verify?token=${verificationToken}`;
    
    const emailResponse = await resend.emails.send({
      from: "ChefsCircle <advithya@chefscircle.in>", // Use your verified domain
      to: [email],
      subject: "Please verify your ChefsCircle newsletter subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to ChefsCircle!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for subscribing to our newsletter. To complete your subscription, please click the button below to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            If you didn't subscribe to our newsletter, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            ChefsCircle - Where Passion Meets Flavor
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Error sending verification email:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        message: "Subscription successful! Please check your email to verify your subscription." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in newsletter-subscribe function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);