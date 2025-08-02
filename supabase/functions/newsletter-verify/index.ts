import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Invalid Verification Link</h1>
            <p>The verification link is invalid or missing the required token.</p>
          </body>
        </html>
        `,
        {
          status: 400,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find subscriber by verification token
    const { data: subscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (findError || !subscriber) {
      console.error("Error finding subscriber:", findError);
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Invalid Verification Token</h1>
            <p>The verification token is invalid or has expired.</p>
          </body>
        </html>
        `,
        {
          status: 404,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    if (subscriber.verified) {
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #4CAF50;">Already Verified</h1>
            <p>Your email address has already been verified. You're all set to receive our newsletter!</p>
            <a href="${Deno.env.get("SITE_URL") || "/"}" style="color: #4CAF50; text-decoration: none;">Return to ChefsCircle</a>
          </body>
        </html>
        `,
        {
          status: 200,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    // Update subscriber as verified
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
        verification_token: null, // Clear the token after verification
      })
      .eq("verification_token", token);

    if (updateError) {
      console.error("Error updating subscriber:", updateError);
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Verification Failed</h1>
            <p>There was an error verifying your email address. Please try again later.</p>
          </body>
        </html>
        `,
        {
          status: 500,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    console.log("Email verified successfully for subscriber:", subscriber.email);

    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4CAF50; margin-bottom: 20px;">Email Verified Successfully!</h1>
            <p style="color: #666; font-size: 18px; margin-bottom: 30px;">
              Thank you for verifying your email address. You're now subscribed to the ChefsCircle newsletter and will receive our latest culinary content, recipes, and community updates.
            </p>
            <a href="${Deno.env.get("SITE_URL") || "/"}" 
               style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Return to ChefsCircle
            </a>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in newsletter-verify function:", error);
    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #f44336;">Verification Error</h1>
          <p>An unexpected error occurred during verification. Please try again later.</p>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: { "Content-Type": "text/html", ...corsHeaders },
      }
    );
  }
};

serve(handler);