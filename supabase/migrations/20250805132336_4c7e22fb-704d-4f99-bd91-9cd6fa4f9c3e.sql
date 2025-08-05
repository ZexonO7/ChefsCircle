-- Fix the RLS policies for email_verification_otps table
DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.email_verification_otps;
DROP POLICY IF EXISTS "Anyone can create OTP records" ON public.email_verification_otps;
DROP POLICY IF EXISTS "Anyone can read OTP records by email" ON public.email_verification_otps;
DROP POLICY IF EXISTS "Anyone can update OTP records" ON public.email_verification_otps;

-- Create proper RLS policies for the OTP table
CREATE POLICY "Service role can manage all OTP operations" 
ON public.email_verification_otps 
FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- Create index for efficient lookups if not exists
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email_code 
ON public.email_verification_otps (email, otp_code);

CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expires_at 
ON public.email_verification_otps (expires_at);