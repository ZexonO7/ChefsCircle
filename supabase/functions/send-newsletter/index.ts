import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendNewsletterRequest {
  articleId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId }: SendNewsletterRequest = await req.json();

    if (!articleId) {
      return new Response(
        JSON.stringify({ error: "Article ID is required" }),
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

    // Get the article
    const { data: article, error: articleError } = await supabase
      .from("newsletter_articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (articleError || !article) {
      console.error("Error fetching article:", articleError);
      return new Response(
        JSON.stringify({ error: "Article not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get all verified subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("verified", true)
      .is("unsubscribed_at", null);

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscribers" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No verified subscribers found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const unsubscribeUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/newsletter-unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        const emailResponse = await resend.emails.send({
          from: "ChefsCircle Newsletter <advithya@chefscircle.in>", // Use your verified domain
          to: [subscriber.email],
          subject: article.title,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">ChefsCircle</h1>
                <p style="color: #666; margin: 5px 0;">Where Passion Meets Flavor</p>
              </div>
              
              <h2 style="color: #333; margin-bottom: 20px;">${article.title}</h2>
              
              ${article.excerpt ? `<p style="color: #666; font-size: 16px; font-style: italic; margin-bottom: 20px;">${article.excerpt}</p>` : ''}
              
              <div style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${article.content}
              </div>
              
              ${article.author ? `<p style="color: #666; font-size: 14px; margin-bottom: 30px;"><strong>By:</strong> ${article.author}</p>` : ''}
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get("SITE_URL") || "/"}" 
                   style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Visit ChefsCircle
                </a>
              </div>
              
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                You're receiving this email because you subscribed to the ChefsCircle newsletter.<br>
                <a href="${unsubscribeUrl}" style="color: #999; text-decoration: underline;">Unsubscribe</a>
              </p>
            </div>
          `,
        });

        // Log the email send
        await supabase
          .from("newsletter_email_sends")
          .insert({
            article_id: articleId,
            subscriber_id: subscriber.id,
            status: emailResponse.error ? "failed" : "sent",
            error_message: emailResponse.error?.message || null,
          });

        return {
          email: subscriber.email,
          success: !emailResponse.error,
          error: emailResponse.error?.message,
        };
      } catch (error: any) {
        console.error(`Error sending email to ${subscriber.email}:`, error);
        
        // Log the failed email send
        await supabase
          .from("newsletter_email_sends")
          .insert({
            article_id: articleId,
            subscriber_id: subscriber.id,
            status: "failed",
            error_message: error.message,
          });

        return {
          email: subscriber.email,
          success: false,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(emailPromises);
    
    // Update article as sent
    await supabase
      .from("newsletter_articles")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", articleId);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Newsletter sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        message: "Newsletter sent successfully",
        results: {
          total: results.length,
          successful: successCount,
          failed: failureCount,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
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