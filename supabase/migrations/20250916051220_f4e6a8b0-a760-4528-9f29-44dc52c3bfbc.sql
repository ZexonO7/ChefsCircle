-- Allow users to view other users' public profile data
CREATE POLICY "Users can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow users to view other users' achievements for public viewing
CREATE POLICY "Users can view public achievements" 
ON public.user_achievements 
FOR SELECT 
USING (true);

-- Create a function to search users by name/username/email
CREATE OR REPLACE FUNCTION public.search_users(search_term text, limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  full_name text,
  username text,
  email text,
  avatar_url text,
  profile_image_url text,
  bio text,
  total_xp integer,
  level integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.username,
    p.email,
    p.avatar_url,
    p.profile_image_url,
    p.bio,
    COALESCE(ug.total_xp, 0) as total_xp,
    COALESCE(ug.level, 1) as level
  FROM public.profiles p
  LEFT JOIN public.user_gamification ug ON ug.user_id = p.id
  WHERE 
    LOWER(COALESCE(p.full_name, '')) ILIKE LOWER('%' || search_term || '%') OR
    LOWER(COALESCE(p.username, '')) ILIKE LOWER('%' || search_term || '%') OR
    LOWER(COALESCE(p.email, '')) ILIKE LOWER('%' || search_term || '%')
  ORDER BY 
    CASE 
      WHEN LOWER(COALESCE(p.full_name, '')) = LOWER(search_term) THEN 1
      WHEN LOWER(COALESCE(p.username, '')) = LOWER(search_term) THEN 2
      WHEN LOWER(COALESCE(p.full_name, '')) ILIKE LOWER(search_term || '%') THEN 3
      WHEN LOWER(COALESCE(p.username, '')) ILIKE LOWER(search_term || '%') THEN 4
      ELSE 5
    END,
    COALESCE(ug.total_xp, 0) DESC
  LIMIT limit_count;
END;
$$;