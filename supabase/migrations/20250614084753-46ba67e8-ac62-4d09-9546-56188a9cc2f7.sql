
-- Create user_gamification table to track individual user progress
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_xp integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_achievements table to track earned badges/achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  earned_at timestamp with time zone DEFAULT now(),
  xp_awarded integer DEFAULT 0,
  UNIQUE(user_id, achievement_type, achievement_name)
);

-- Create gamification_actions table to track point-earning activities
CREATE TABLE IF NOT EXISTS public.gamification_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL, -- 'recipe_upload', 'club_creation', 'challenge_completion', etc.
  action_description text,
  xp_earned integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_gamification
CREATE POLICY "Users can view their own gamification data" ON public.user_gamification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own gamification data" ON public.user_gamification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gamification data" ON public.user_gamification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for gamification_actions
CREATE POLICY "Users can view their own actions" ON public.gamification_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions" ON public.gamification_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to calculate level based on XP
CREATE OR REPLACE FUNCTION public.calculate_level(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level formula: every 1000 XP = 1 level, starting at level 1
  RETURN GREATEST(1, FLOOR(total_xp / 1000) + 1);
END;
$$;

-- Function to calculate XP needed for next level
CREATE OR REPLACE FUNCTION public.xp_for_next_level(current_level integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN current_level * 1000;
END;
$$;

-- Function to award XP and handle achievements
CREATE OR REPLACE FUNCTION public.award_xp(
  user_id_param uuid,
  xp_amount integer,
  action_type_param text,
  action_description_param text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_data RECORD;
  new_total_xp integer;
  new_level integer;
  achievement_earned boolean := false;
BEGIN
  -- Get current user gamification data or create if doesn't exist
  SELECT * INTO current_data FROM public.user_gamification WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_gamification (user_id, current_xp, total_xp, level)
    VALUES (user_id_param, xp_amount, xp_amount, calculate_level(xp_amount));
    new_total_xp := xp_amount;
    new_level := calculate_level(xp_amount);
  ELSE
    new_total_xp := current_data.total_xp + xp_amount;
    new_level := calculate_level(new_total_xp);
    
    UPDATE public.user_gamification 
    SET 
      current_xp = current_xp + xp_amount,
      total_xp = new_total_xp,
      level = new_level,
      updated_at = now()
    WHERE user_id = user_id_param;
  END IF;
  
  -- Log the action
  INSERT INTO public.gamification_actions (user_id, action_type, action_description, xp_earned)
  VALUES (user_id_param, action_type_param, action_description_param, xp_amount);
  
  -- Check for achievements
  IF action_type_param = 'recipe_upload' THEN
    -- Recipe Creator Badge (first recipe)
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Recipe Creator', 100)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    
    -- Check for Master Chef badge (10 recipes)
    IF (SELECT COUNT(*) FROM public.gamification_actions WHERE user_id = user_id_param AND action_type = 'recipe_upload') >= 10 THEN
      INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
      VALUES (user_id_param, 'badge', 'Master Chef', 500)
      ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    END IF;
  END IF;
  
  IF action_type_param = 'club_creation' THEN
    -- Community Leader Badge
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Community Leader', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Level up achievement
  IF new_level > COALESCE(current_data.level, 1) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'level', 'Level ' || new_level, 50)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$$;

-- Insert initial gamification data for existing users (optional)
INSERT INTO public.user_gamification (user_id, current_xp, total_xp, level)
SELECT id, 0, 0, 1 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
