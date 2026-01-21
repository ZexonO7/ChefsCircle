
-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create payment_submissions table to track crypto payments
CREATE TABLE public.payment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  tier_name TEXT NOT NULL,
  crypto_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own payment submissions
CREATE POLICY "Users can insert their own payment submissions"
ON public.payment_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own payment submissions
CREATE POLICY "Users can view their own payment submissions"
ON public.payment_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all payment submissions
CREATE POLICY "Admins can view all payment submissions"
ON public.payment_submissions
FOR SELECT
USING (is_admin());

-- Admins can update payment submissions
CREATE POLICY "Admins can update payment submissions"
ON public.payment_submissions
FOR UPDATE
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_payment_submissions_updated_at
BEFORE UPDATE ON public.payment_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
