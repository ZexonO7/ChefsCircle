-- Create a secure RPC to fetch leaderboard with display names
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count integer DEFAULT 5)
RETURNS TABLE (
  user_id uuid,
  total_xp integer,
  level integer,
  display_name text,
  avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ug.user_id,
    ug.total_xp,
    ug.level,
    COALESCE(p.full_name, p.username, split_part(COALESCE(p.email, ''), '@', 1)) AS display_name,
    p.avatar_url
  FROM public.user_gamification ug
  LEFT JOIN public.profiles p ON p.id = ug.user_id
  ORDER BY ug.total_xp DESC
  LIMIT limit_count;
END;
$$;