-- Update RLS policy for user_gamification to allow all authenticated users to view leaderboard data
DROP POLICY IF EXISTS "Users can view their own gamification data" ON public.user_gamification;

-- Create new policies: users can view their own data, but also view leaderboard data for all users
CREATE POLICY "Users can view their own gamification data" 
ON public.user_gamification 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view leaderboard gamification data" 
ON public.user_gamification 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Update RLS policy for profiles to allow all authenticated users to view basic profile info for leaderboard
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);