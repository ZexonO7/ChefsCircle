
-- Create weekly_challenges table to store different challenges
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL, -- 'recipe_upload', 'club_creation', etc.
  target_count integer NOT NULL DEFAULT 1,
  xp_reward integer NOT NULL DEFAULT 0,
  badge_reward text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_challenge_progress table to track individual user progress
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES public.weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  current_progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS on the new tables
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for weekly_challenges (everyone can read active challenges)
CREATE POLICY "Everyone can view active challenges" ON public.weekly_challenges
  FOR SELECT USING (is_active = true);

-- RLS policies for user_challenge_progress
CREATE POLICY "Users can view their own challenge progress" ON public.user_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge progress" ON public.user_challenge_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress" ON public.user_challenge_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert the current recipe upload challenge
INSERT INTO public.weekly_challenges (
  title, 
  description, 
  challenge_type, 
  target_count, 
  xp_reward, 
  badge_reward,
  start_date, 
  end_date
) VALUES (
  'Recipe Upload Challenge',
  'Upload 3 recipes this week to earn bonus XP',
  'recipe_upload',
  3,
  500,
  'Challenge Winner',
  CURRENT_DATE - INTERVAL '1 day',  -- Started yesterday to ensure it's active
  CURRENT_DATE + INTERVAL '6 days'  -- Ends in 6 days (7 day challenge)
);

-- Function to update challenge progress
CREATE OR REPLACE FUNCTION public.update_challenge_progress(
  user_id_param uuid,
  challenge_type_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  active_challenge RECORD;
  user_progress RECORD;
  action_count integer;
BEGIN
  -- Get active challenge of this type
  SELECT * INTO active_challenge 
  FROM public.weekly_challenges 
  WHERE challenge_type = challenge_type_param 
    AND is_active = true 
    AND CURRENT_DATE BETWEEN start_date AND end_date
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN; -- No active challenge
  END IF;
  
  -- Count user's actions for this challenge period
  SELECT COUNT(*) INTO action_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param 
    AND action_type = challenge_type_param
    AND DATE(created_at) BETWEEN active_challenge.start_date AND active_challenge.end_date;
  
  -- Get or create user progress record
  SELECT * INTO user_progress 
  FROM public.user_challenge_progress 
  WHERE user_id = user_id_param AND challenge_id = active_challenge.id;
  
  IF NOT FOUND THEN
    -- Create new progress record
    INSERT INTO public.user_challenge_progress (
      user_id, 
      challenge_id, 
      current_progress,
      completed,
      completed_at
    ) VALUES (
      user_id_param, 
      active_challenge.id, 
      action_count,
      action_count >= active_challenge.target_count,
      CASE WHEN action_count >= active_challenge.target_count THEN now() ELSE NULL END
    );
  ELSE
    -- Update existing progress
    UPDATE public.user_challenge_progress 
    SET 
      current_progress = action_count,
      completed = action_count >= active_challenge.target_count,
      completed_at = CASE 
        WHEN action_count >= active_challenge.target_count AND NOT user_progress.completed 
        THEN now() 
        ELSE user_progress.completed_at 
      END,
      updated_at = now()
    WHERE user_id = user_id_param AND challenge_id = active_challenge.id;
  END IF;
  
  -- Award challenge completion bonus if just completed
  IF action_count >= active_challenge.target_count AND 
     (user_progress IS NULL OR NOT user_progress.completed) THEN
    
    -- Award XP bonus
    PERFORM public.award_xp(
      user_id_param, 
      active_challenge.xp_reward, 
      'challenge_completion',
      'Completed: ' || active_challenge.title
    );
    
    -- Award badge if specified
    IF active_challenge.badge_reward IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
      VALUES (user_id_param, 'badge', active_challenge.badge_reward, 0)
      ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- Update the award_xp function to also update challenge progress
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
  
  -- Update challenge progress for relevant actions
  PERFORM public.update_challenge_progress(user_id_param, action_type_param);
  
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
