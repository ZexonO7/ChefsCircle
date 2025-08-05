
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOTPRequest = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('email_verification_otps')
      .insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt
      });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Send OTP via email using Resend
    try {
      const emailResponse = await resend.emails.send({
        from: "ChefsCircle <onboarding@resend.dev>",
        to: [email],
        subject: "Your ChefsCircle Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to ChefsCircle!</h1>
            <p>Hi there,</p>
            <p>Thank you for signing up for ChefsCircle. To complete your account setup, please use the verification code below:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h2 style="color: #1f2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${otpCode}</h2>
            </div>
            <p>This code will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this verification code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The ChefsCircle Team
            </p>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      throw new Error(`Failed to send verification email: ${emailError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent to your email"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
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
