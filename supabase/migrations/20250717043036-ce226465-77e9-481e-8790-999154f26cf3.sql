-- Fix the get_daily_recipe_usage function to handle null values properly
CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 10
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER;
  result JSON;
BEGIN
  -- Get current usage count for today, defaulting to 0 if no record exists
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- If no record found, set to 0
  IF current_usage_count IS NULL THEN
    current_usage_count := 0;
  END IF;
  
  -- Build JSON result with guaranteed non-null values
  SELECT json_build_object(
    'current_count', current_usage_count,
    'remaining_count', GREATEST(0, max_daily_limit - current_usage_count),
    'can_generate', (current_usage_count < max_daily_limit)
  ) INTO result;
  
  RETURN result;
END;
$$;