-- Check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.email_verification_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_verification_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for edge functions to insert/update OTPs
CREATE POLICY IF NOT EXISTS "Service role can manage OTPs" 
ON public.email_verification_otps 
FOR ALL 
TO service_role 
USING (true);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_otps_email_code 
ON public.email_verification_otps (email, otp_code);

CREATE INDEX IF NOT EXISTS idx_email_verification_otps_expires_at 
ON public.email_verification_otps (expires_at);