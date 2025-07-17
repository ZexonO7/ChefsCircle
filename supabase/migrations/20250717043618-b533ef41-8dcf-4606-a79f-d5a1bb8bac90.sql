-- Update daily recipe limits to 5 per day
CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 5
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

CREATE OR REPLACE FUNCTION public.check_and_update_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 5
)
RETURNS TABLE(
  can_generate BOOLEAN,
  current_count INTEGER,
  remaining_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage_count INTEGER := 0;
BEGIN
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
  IF current_usage_count < max_daily_limit THEN
    -- Increment the count
    UPDATE public.ai_recipe_daily_usage
    SET generation_count = generation_count + 1,
        updated_at = now()
    WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
    
    -- Return success
    RETURN QUERY SELECT 
      TRUE as can_generate, 
      (current_usage_count + 1) as current_count,
      (max_daily_limit - current_usage_count - 1) as remaining_count;
  ELSE
    -- Return failure - limit reached
    RETURN QUERY SELECT 
      FALSE as can_generate, 
      current_usage_count as current_count,
      0 as remaining_count;
  END IF;
END;
$$;