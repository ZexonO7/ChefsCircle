-- Create table to track daily AI recipe generation usage
CREATE TABLE public.ai_recipe_daily_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, generation_date)
);

-- Enable RLS
ALTER TABLE public.ai_recipe_daily_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage" 
ON public.ai_recipe_daily_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.ai_recipe_daily_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.ai_recipe_daily_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to check and update daily usage
CREATE OR REPLACE FUNCTION public.check_and_update_daily_recipe_usage(
  user_id_param UUID,
  max_daily_limit INTEGER DEFAULT 10
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

-- Create function to get current daily usage without incrementing
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
  -- Get current usage count
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  -- Return usage info
  RETURN QUERY SELECT 
    current_usage_count as current_count,
    GREATEST(0, max_daily_limit - current_usage_count) as remaining_count,
    (current_usage_count < max_daily_limit) as can_generate;
END;
$$;