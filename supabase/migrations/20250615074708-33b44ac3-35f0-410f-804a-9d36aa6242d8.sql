
-- Create a table to store recipe analytics (views, likes, etc.)
CREATE TABLE public.recipe_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id TEXT NOT NULL,
  recipe_type TEXT NOT NULL CHECK (recipe_type IN ('static', 'user')),
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, recipe_type)
);

-- Create an index for faster lookups
CREATE INDEX idx_recipe_analytics_recipe_id_type ON public.recipe_analytics(recipe_id, recipe_type);

-- Enable Row Level Security (RLS) - analytics should be readable by all but only updatable by the system
ALTER TABLE public.recipe_analytics ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to read analytics
CREATE POLICY "Analytics are publicly readable" 
  ON public.recipe_analytics 
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to insert new analytics records
CREATE POLICY "Authenticated users can create analytics" 
  ON public.recipe_analytics 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to update analytics
CREATE POLICY "Authenticated users can update analytics" 
  ON public.recipe_analytics 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Function to increment view count for a recipe
CREATE OR REPLACE FUNCTION public.increment_recipe_views(
  p_recipe_id TEXT,
  p_recipe_type TEXT
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_view_count INTEGER;
BEGIN
  -- Insert or update the analytics record
  INSERT INTO public.recipe_analytics (recipe_id, recipe_type, view_count)
  VALUES (p_recipe_id, p_recipe_type, 1)
  ON CONFLICT (recipe_id, recipe_type)
  DO UPDATE SET 
    view_count = recipe_analytics.view_count + 1,
    updated_at = now()
  RETURNING view_count INTO new_view_count;
  
  RETURN new_view_count;
END;
$$;

-- Function to get analytics for a recipe
CREATE OR REPLACE FUNCTION public.get_recipe_analytics(
  p_recipe_id TEXT,
  p_recipe_type TEXT
) RETURNS TABLE(view_count INTEGER, like_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ra.view_count, 0)::INTEGER,
    COALESCE(ra.like_count, 0)::INTEGER
  FROM public.recipe_analytics ra
  WHERE ra.recipe_id = p_recipe_id AND ra.recipe_type = p_recipe_type;
  
  -- If no record exists, return zeros
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0::INTEGER, 0::INTEGER;
  END IF;
END;
$$;
