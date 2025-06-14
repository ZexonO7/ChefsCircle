
-- Update the award_xp function to handle login and profile customization achievements
CREATE OR REPLACE FUNCTION public.award_xp(user_id_param uuid, xp_amount integer, action_type_param text, action_description_param text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
  
  -- Check for achievements based on action type
  IF action_type_param = 'first_login' THEN
    -- First achievement: Welcome Badge for first login
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Welcome Chef', 50)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'profile_customization' THEN
    -- Second achievement: Profile Master Badge for customizing profile
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Profile Master', 75)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
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
$function$;

-- Create a function to track first login
CREATE OR REPLACE FUNCTION public.track_first_login(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  login_count integer;
BEGIN
  -- Check if this is the user's first recorded login
  SELECT COUNT(*) INTO login_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'first_login';
  
  -- If no previous login recorded, award the welcome achievement
  IF login_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 50, 'first_login', 'Welcome to ChefCircle!');
  END IF;
END;
$function$;

-- Create a function to track profile customization
CREATE OR REPLACE FUNCTION public.track_profile_customization(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  customization_count integer;
BEGIN
  -- Check if this is the user's first profile customization
  SELECT COUNT(*) INTO customization_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'profile_customization';
  
  -- If no previous customization recorded, award the profile achievement
  IF customization_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 75, 'profile_customization', 'Customized your profile');
  END IF;
END;
$function$;
