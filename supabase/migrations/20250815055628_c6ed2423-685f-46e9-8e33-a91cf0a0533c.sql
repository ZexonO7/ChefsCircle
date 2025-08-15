-- Add reset cost fields to weekly_challenges table
ALTER TABLE public.weekly_challenges 
ADD COLUMN reset_cost_xp integer DEFAULT 0,
ADD COLUMN duration_type text DEFAULT 'daily' CHECK (duration_type IN ('daily', '3_day', 'weekly')),
ADD COLUMN auto_reset boolean DEFAULT true;

-- Update existing challenges with appropriate reset costs and duration types
UPDATE public.weekly_challenges 
SET duration_type = CASE 
  WHEN EXTRACT(DAY FROM (end_date - start_date)) <= 1 THEN 'daily'
  WHEN EXTRACT(DAY FROM (end_date - start_date)) <= 3 THEN '3_day'
  ELSE 'weekly'
END,
reset_cost_xp = CASE 
  WHEN EXTRACT(DAY FROM (end_date - start_date)) <= 1 THEN 0  -- Daily challenges reset for free
  WHEN EXTRACT(DAY FROM (end_date - start_date)) <= 3 THEN 100  -- 3-day challenges cost 100 XP
  ELSE 300  -- Weekly challenges cost 300 XP
END,
auto_reset = CASE 
  WHEN EXTRACT(DAY FROM (end_date - start_date)) <= 1 THEN true  -- Daily challenges auto-reset
  ELSE false  -- 3-day and weekly challenges require manual reset
END;

-- Create function to reset expired challenges
CREATE OR REPLACE FUNCTION public.reset_expired_challenges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-reset daily challenges
  UPDATE public.weekly_challenges 
  SET 
    start_date = CURRENT_DATE,
    end_date = CURRENT_DATE + INTERVAL '1 day',
    is_active = true
  WHERE duration_type = 'daily' 
    AND auto_reset = true 
    AND end_date < CURRENT_DATE;
    
  -- Mark expired 3-day and weekly challenges as inactive
  UPDATE public.weekly_challenges 
  SET is_active = false
  WHERE duration_type IN ('3_day', 'weekly') 
    AND end_date < CURRENT_DATE
    AND is_active = true;
    
  -- Clear user progress for expired challenges that don't auto-reset
  DELETE FROM public.user_challenge_progress 
  WHERE challenge_id IN (
    SELECT id FROM public.weekly_challenges 
    WHERE duration_type IN ('3_day', 'weekly') 
      AND end_date < CURRENT_DATE
      AND auto_reset = false
  );
END;
$$;

-- Create function to manually reset challenge with XP cost
CREATE OR REPLACE FUNCTION public.reset_challenge_with_xp(
  user_id_param uuid,
  challenge_id_param uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  challenge_record RECORD;
  user_xp RECORD;
  new_start_date date;
  new_end_date date;
BEGIN
  -- Get challenge details
  SELECT * INTO challenge_record 
  FROM public.weekly_challenges 
  WHERE id = challenge_id_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Challenge not found');
  END IF;
  
  -- Check if challenge is expired
  IF challenge_record.end_date >= CURRENT_DATE THEN
    RETURN json_build_object('success', false, 'error', 'Challenge is still active');
  END IF;
  
  -- Get user's current XP
  SELECT current_xp INTO user_xp 
  FROM public.user_gamification 
  WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User gamification data not found');
  END IF;
  
  -- Check if user has enough XP
  IF user_xp.current_xp < challenge_record.reset_cost_xp THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Insufficient XP',
      'required', challenge_record.reset_cost_xp,
      'available', user_xp.current_xp
    );
  END IF;
  
  -- Deduct XP from user
  UPDATE public.user_gamification 
  SET 
    current_xp = current_xp - challenge_record.reset_cost_xp,
    updated_at = now()
  WHERE user_id = user_id_param;
  
  -- Calculate new dates based on duration type
  new_start_date := CURRENT_DATE;
  new_end_date := CASE 
    WHEN challenge_record.duration_type = 'daily' THEN CURRENT_DATE + INTERVAL '1 day'
    WHEN challenge_record.duration_type = '3_day' THEN CURRENT_DATE + INTERVAL '3 days'
    ELSE CURRENT_DATE + INTERVAL '1 week'
  END;
  
  -- Reset the challenge
  UPDATE public.weekly_challenges 
  SET 
    start_date = new_start_date,
    end_date = new_end_date,
    is_active = true
  WHERE id = challenge_id_param;
  
  -- Clear user's progress for this challenge
  DELETE FROM public.user_challenge_progress 
  WHERE user_id = user_id_param AND challenge_id = challenge_id_param;
  
  -- Log the XP spending
  INSERT INTO public.gamification_actions (user_id, action_type, action_description, xp_earned)
  VALUES (
    user_id_param, 
    'challenge_reset', 
    'Reset challenge: ' || challenge_record.title, 
    -challenge_record.reset_cost_xp
  );
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Challenge reset successfully',
    'xp_spent', challenge_record.reset_cost_xp,
    'new_end_date', new_end_date
  );
END;
$$;