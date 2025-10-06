-- Create certificates table for storing charters and certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('certificate', 'charter')),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  issued_date DATE NOT NULL,
  issuer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_url TEXT,
  metadata JSONB,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can verify certificates (public read access)
CREATE POLICY "Anyone can view active certificates"
  ON public.certificates
  FOR SELECT
  USING (status = 'active');

-- Only admins can insert/update/delete certificates
CREATE POLICY "Admins can manage certificates"
  ON public.certificates
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create index for faster lookups
CREATE INDEX idx_certificates_certificate_id ON public.certificates(certificate_id);
CREATE INDEX idx_certificates_status ON public.certificates(status);

-- Insert the founding charter
INSERT INTO public.certificates (
  certificate_id,
  type,
  recipient_name,
  recipient_email,
  issued_date,
  issuer_name,
  title,
  description,
  document_url,
  status
) VALUES (
  'CC-2025-CH01',
  'charter',
  'Advithya Bhardwaj',
  'advithya07@gmail.com',
  '2025-05-04',
  'ChefsCircle',
  'Founding Charter',
  'This document serves as the official recognition of the founding of ChefsCircle, established in 2025. ChefsCircle is envisioned as a gamified, AI-powered cooking platform designed to bring people together through food. This Charter formally acknowledges that Advithya Bhardwaj is the Founder and Chief Executive Officer (CEO) of ChefsCircle.',
  '/documents/CC-2025-CH01.pdf',
  'active'
);