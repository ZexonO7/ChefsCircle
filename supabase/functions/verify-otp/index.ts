
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
  password: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, password, fullName }: VerifyOTPRequest = await req.json();
    
    if (!email || !otp || !password) {
      throw new Error("Email, OTP, and password are required");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, check if there's any OTP for this email
    const { data: emailOtps, error: emailError } = await supabase
      .from('email_verification_otps')
      .select('*')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false });

    if (emailError) {
      throw new Error("Failed to verify OTP");
    }

    if (!emailOtps || emailOtps.length === 0) {
      throw new Error("No verification code found for this email. Please request a new code.");
    }

    // Check if the OTP matches
    const matchingOtp = emailOtps.find(record => record.otp_code === otp);
    
    if (!matchingOtp) {
      throw new Error("The verification code you entered is incorrect. Please try again.");
    }

    // Check if the OTP is expired
    if (new Date(matchingOtp.expires_at) <= new Date()) {
      throw new Error("This verification code has expired. Please request a new one.");
    }

    const otpRecord = matchingOtp;

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('email_verification_otps')
      .update({ used: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      throw new Error("Failed to mark OTP as used");
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation since we verified via OTP
      user_metadata: {
        full_name: fullName
      }
    });

    if (authError) {
      throw new Error(`Failed to create account: ${authError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account created successfully",
        user: authData.user
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
    console.error("Error in verify-otp function:", error);
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
