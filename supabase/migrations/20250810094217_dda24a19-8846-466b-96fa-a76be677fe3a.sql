-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Service role can manage all OTP operations" ON public.email_verification_otps;

-- Create more restrictive policies that only allow service role access
-- This prevents any regular user from accessing OTP data

-- Policy for service role to insert OTP codes (for send-otp function)
CREATE POLICY "Service role can insert OTP codes" 
ON public.email_verification_otps 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Policy for service role to read OTP codes (for verify-otp function)
CREATE POLICY "Service role can read OTP codes" 
ON public.email_verification_otps 
FOR SELECT 
USING (auth.role() = 'service_role');

-- Policy for service role to update OTP codes (for marking as used)
CREATE POLICY "Service role can update OTP codes" 
ON public.email_verification_otps 
FOR UPDATE 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- Policy for service role to delete expired OTP codes (for cleanup)
CREATE POLICY "Service role can delete OTP codes" 
ON public.email_verification_otps 
FOR DELETE 
USING (auth.role() = 'service_role');