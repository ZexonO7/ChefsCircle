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
    const email = url.searchParams.get("email");

    if (!email) {
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Invalid Unsubscribe Link</h1>
            <p>The unsubscribe link is invalid or missing the required email parameter.</p>
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

    // Find subscriber by email
    const { data: subscriber, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (findError || !subscriber) {
      console.error("Error finding subscriber:", findError);
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Email Not Found</h1>
            <p>The email address was not found in our newsletter subscription list.</p>
          </body>
        </html>
        `,
        {
          status: 404,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    if (subscriber.unsubscribed_at) {
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #4CAF50;">Already Unsubscribed</h1>
            <p>You have already been unsubscribed from our newsletter.</p>
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

    // Update subscriber as unsubscribed
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email);

    if (updateError) {
      console.error("Error updating subscriber:", updateError);
      return new Response(
        `
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #f44336;">Unsubscribe Failed</h1>
            <p>There was an error processing your unsubscribe request. Please try again later.</p>
          </body>
        </html>
        `,
        {
          status: 500,
          headers: { "Content-Type": "text/html", ...corsHeaders },
        }
      );
    }

    console.log("Successfully unsubscribed:", email);

    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4CAF50; margin-bottom: 20px;">Successfully Unsubscribed</h1>
            <p style="color: #666; font-size: 18px; margin-bottom: 20px;">
              You have been successfully unsubscribed from the ChefsCircle newsletter.
            </p>
            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
              We're sorry to see you go! If you change your mind, you can always subscribe again from our website.
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
    console.error("Error in newsletter-unsubscribe function:", error);
    return new Response(
      `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #f44336;">Unsubscribe Error</h1>
          <p>An unexpected error occurred during unsubscribe. Please try again later.</p>
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