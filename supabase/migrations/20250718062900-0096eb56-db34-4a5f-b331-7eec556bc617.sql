-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Update the check_and_update_daily_recipe_usage function to support subscription tiers
CREATE OR REPLACE FUNCTION public.check_and_update_daily_recipe_usage(
  user_id_param uuid, 
  max_daily_limit integer DEFAULT 5
)
RETURNS TABLE(can_generate boolean, current_count integer, remaining_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER := 0;
  user_subscription_tier TEXT;
  tier_limit INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_subscription_tier
  FROM public.subscribers
  WHERE user_id = user_id_param AND subscribed = true;
  
  -- Set limits based on subscription tier
  IF user_subscription_tier = 'enterprise' THEN
    tier_limit := 999999; -- Unlimited (very high number)
  ELSIF user_subscription_tier = 'premium' THEN
    tier_limit := 25;
  ELSIF user_subscription_tier = 'basic' THEN
    tier_limit := 10;
  ELSE
    tier_limit := 5; -- Free tier (no subscription)
  END IF;
  
  -- Get or create today's usage record
  INSERT INTO public.ai_recipe_daily_usage (user_id, generation_date, generation_count)
  VALUES (user_id_param, CURRENT_DATE, 0)
  ON CONFLICT (user_id, generation_date) 
  DO NOTHING;
  
  -- Get current usage count
  SELECT generation_count INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- Check if user can generate more recipes
  IF current_usage_count < tier_limit THEN
    -- Increment the count
    UPDATE public.ai_recipe_daily_usage
    SET generation_count = generation_count + 1,
        updated_at = now()
    WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
    
    -- Return success
    RETURN QUERY SELECT 
      TRUE as can_generate, 
      (current_usage_count + 1) as current_count,
      (tier_limit - current_usage_count - 1) as remaining_count;
  ELSE
    -- Return failure - limit reached
    RETURN QUERY SELECT 
      FALSE as can_generate, 
      current_usage_count as current_count,
      0 as remaining_count;
  END IF;
END;
$$;

-- Update get_daily_recipe_usage function to support subscription tiers
CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(
  user_id_param uuid, 
  max_daily_limit integer DEFAULT 5
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER;
  user_subscription_tier TEXT;
  tier_limit INTEGER;
  result JSON;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_subscription_tier
  FROM public.subscribers
  WHERE user_id = user_id_param AND subscribed = true;
  
  -- Set limits based on subscription tier
  IF user_subscription_tier = 'enterprise' THEN
    tier_limit := 999999; -- Unlimited
  ELSIF user_subscription_tier = 'premium' THEN
    tier_limit := 25;
  ELSIF user_subscription_tier = 'basic' THEN
    tier_limit := 10;
  ELSE
    tier_limit := 5; -- Free tier
  END IF;
  
  -- Get current usage count for today, defaulting to 0 if no record exists
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- If no record found, set to 0
  IF current_usage_count IS NULL THEN
    current_usage_count := 0;
  END IF;
  
  -- Build JSON result with subscription-aware limits
  SELECT json_build_object(
    'current_count', current_usage_count,
    'remaining_count', GREATEST(0, tier_limit - current_usage_count),
    'can_generate', (current_usage_count < tier_limit),
    'subscription_tier', COALESCE(user_subscription_tier, 'free'),
    'daily_limit', tier_limit
  ) INTO result;
  
  RETURN result;
END;
$$;