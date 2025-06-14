
-- Add status and admin fields to user_recipes table
ALTER TABLE public.user_recipes 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Create admin_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create website_analytics table for basic stats
CREATE TABLE IF NOT EXISTS public.website_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  date date DEFAULT CURRENT_DATE,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;

-- Create admin-only policies
CREATE POLICY "Only admins can access logs" ON public.admin_logs
  FOR ALL USING (auth.email() = 'Advithya07@gmail.com');

CREATE POLICY "Only admins can access analytics" ON public.website_analytics
  FOR ALL USING (auth.email() = 'Advithya07@gmail.com');

-- Update user_recipes policies to handle status filtering
DROP POLICY IF EXISTS "Users can view their own recipes" ON public.user_recipes;
CREATE POLICY "Users can view approved recipes and their own" ON public.user_recipes
  FOR SELECT USING (
    status = 'approved' OR 
    user_id = auth.uid() OR 
    auth.email() = 'Advithya07@gmail.com'
  );

-- Admin can update any recipe
CREATE POLICY "Admin can update any recipe" ON public.user_recipes
  FOR UPDATE USING (auth.email() = 'Advithya07@gmail.com');

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_text text,
  target_type_text text,
  target_id_param uuid DEFAULT NULL,
  details_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), action_text, target_type_text, target_id_param, details_param);
END;
$$;

-- Insert some initial analytics data
INSERT INTO public.website_analytics (metric_name, metric_value, metadata) VALUES
('total_users', 0, '{"description": "Total registered users"}'),
('total_recipes', 0, '{"description": "Total recipes submitted"}'),
('pending_recipes', 0, '{"description": "Recipes awaiting approval"}'),
('approved_recipes', 0, '{"description": "Approved recipes"}'),
('rejected_recipes', 0, '{"description": "Rejected recipes"}')
ON CONFLICT DO NOTHING;
