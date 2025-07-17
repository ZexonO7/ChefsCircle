-- Drop and recreate the function with proper return type handling
DROP FUNCTION public.get_daily_recipe_usage(UUID, INTEGER);

CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 10
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER := 0;
  result JSON;
BEGIN
  -- Get current usage count for today
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- Build JSON result
  SELECT json_build_object(
    'current_count', current_usage_count,
    'remaining_count', GREATEST(0, max_daily_limit - current_usage_count),
    'can_generate', (current_usage_count < max_daily_limit)
  ) INTO result;
  
  RETURN result;
END;
$$;