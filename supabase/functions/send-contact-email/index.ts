import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  timestamp: number;
}

// Input validation
const validateInput = (data: ContactEmailRequest): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email address is required");
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }
  
  // Security checks
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.push("Bot detected");
  }
  
  // Time-based validation (form should take at least 3 seconds)
  const timeDiff = Date.now() - data.timestamp;
  if (timeDiff < 3000) {
    errors.push("Form submitted too quickly");
  }
  
  return errors;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data: ContactEmailRequest = await req.json();
    
    // Validate input
    const validationErrors = validateInput(data);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validationErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ChefCircle Contact <contact@chefscircle.com>",
      to: ["advithya07@gmail.com"],
      subject: `New Contact Form Message from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D5016;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from the ChefCircle contact form.
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "ChefCircle <contact@chefscircle.com>",
      to: [data.email],
      subject: "Thank you for contacting ChefCircle!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D5016;">Thank you for reaching out!</h2>
          <p>Hello ${data.name},</p>
          <p>We've received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <div style="font-style: italic;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>In the meantime, feel free to explore our platform and discover amazing recipes from our community of chefs!</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            The ChefCircle Team
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `,
    });

    console.log("Contact emails sent successfully:", { 
      admin: adminEmailResponse.data?.id, 
      user: userEmailResponse.data?.id 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Your message has been sent successfully!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send message", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);