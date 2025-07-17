-- Fix the get_daily_recipe_usage function
CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  current_count INTEGER,
  remaining_count INTEGER,
  can_generate BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER := 0;
BEGIN
  -- Get current usage count for today
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- If no record found, current_usage_count remains 0
  
  -- Return usage info
  RETURN QUERY SELECT 
    current_usage_count as current_count,
    GREATEST(0, max_daily_limit - current_usage_count) as remaining_count,
    (current_usage_count < max_daily_limit) as can_generate;
END;
$$;