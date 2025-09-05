-- Comprehensive Security Fixes

-- 1. Fix RLS Policies for Better Security

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Subscribers can verify themselves" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow system to create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Analytics are publicly readable" ON public.recipe_analytics;
DROP POLICY IF EXISTS "Authenticated users can create analytics" ON public.recipe_analytics;
DROP POLICY IF EXISTS "Authenticated users can update analytics" ON public.recipe_analytics;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure newsletter subscriber policies
CREATE POLICY "Service role can manage newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create secure notification policies  
CREATE POLICY "Authenticated users can create notifications for themselves"
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Create secure recipe analytics policies
CREATE POLICY "Authenticated users can view recipe analytics"
ON public.recipe_analytics 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create recipe analytics"
ON public.recipe_analytics 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update recipe analytics"
ON public.recipe_analytics 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create secure subscriber policies
CREATE POLICY "Users can manage their own subscription"
ON public.subscribers 
FOR ALL 
USING (auth.uid() = user_id OR auth.email() = email);

-- 2. Fix Database Functions Security Issues

-- Update all functions to have proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  DELETE FROM public.email_verification_otps 
  WHERE expires_at < now() OR used = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_admin_action(action_text text, target_type_text text, target_id_param uuid DEFAULT NULL::uuid, details_param jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), action_text, target_type_text, target_id_param, details_param);
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_verification_token()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_level(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN GREATEST(1, FLOOR(total_xp / 1000) + 1);
END;
$function$;

CREATE OR REPLACE FUNCTION public.xp_for_next_level(current_level integer)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN current_level * 1000;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_recipe_views(p_recipe_id text, p_recipe_type text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_view_count INTEGER;
BEGIN
  INSERT INTO public.recipe_analytics (recipe_id, recipe_type, view_count)
  VALUES (p_recipe_id, p_recipe_type, 1)
  ON CONFLICT (recipe_id, recipe_type)
  DO UPDATE SET 
    view_count = recipe_analytics.view_count + 1,
    updated_at = now()
  RETURNING view_count INTO new_view_count;
  
  RETURN new_view_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_recipe_analytics(p_recipe_id text, p_recipe_type text)
RETURNS TABLE(view_count integer, like_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ra.view_count, 0)::INTEGER,
    COALESCE(ra.like_count, 0)::INTEGER
  FROM public.recipe_analytics ra
  WHERE ra.recipe_id = p_recipe_id AND ra.recipe_type = p_recipe_type;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0::INTEGER, 0::INTEGER;
  END IF;
END;
$function$;

-- 3. Create admin role checking function
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_email TEXT;
BEGIN
  -- Get user email from auth.users (this requires service role access)
  SELECT email INTO user_email FROM auth.users WHERE id = user_id_param;
  
  -- Check if user is admin (you can modify this list as needed)
  RETURN user_email = 'Advithya07@gmail.com';
END;
$function$;

-- Update admin-related policies to use the function
DROP POLICY IF EXISTS "Only admins can access logs" ON public.admin_logs;
CREATE POLICY "Only admins can access logs"
ON public.admin_logs
FOR ALL
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage newsletter articles" ON public.newsletter_articles;
CREATE POLICY "Admins can manage newsletter articles"
ON public.newsletter_articles
FOR ALL
USING (public.is_admin());

DROP POLICY IF EXISTS "Only admins can access analytics" ON public.website_analytics;
CREATE POLICY "Only admins can access analytics"
ON public.website_analytics
FOR ALL
USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update any recipe" ON public.user_recipes;
CREATE POLICY "Admin can update any recipe"
ON public.user_recipes
FOR UPDATE
USING (public.is_admin());