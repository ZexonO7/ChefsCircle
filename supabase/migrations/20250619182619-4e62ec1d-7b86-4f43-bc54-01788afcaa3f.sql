
-- Add new achievement tracking functions for the additional badges

-- Function to track course attendance
CREATE OR REPLACE FUNCTION public.track_course_attendance(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  attendance_count integer;
BEGIN
  -- Check if this is the user's first course attendance
  SELECT COUNT(*) INTO attendance_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'course_attendance';
  
  -- If no previous attendance recorded, award the achievement
  IF attendance_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 200, 'course_attendance', 'Attended your first course');
  END IF;
END;
$function$;

-- Function to track AI recipe generation
CREATE OR REPLACE FUNCTION public.track_ai_recipe_generation(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  generation_count integer;
BEGIN
  -- Count AI recipe generations
  SELECT COUNT(*) INTO generation_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'ai_recipe_generation';
  
  -- Award XP for each generation
  PERFORM public.award_xp(user_id_param, 25, 'ai_recipe_generation', 'Generated recipes using AI');
  
  -- Check for AI Recipe Master badge (2 generations)
  IF generation_count + 1 >= 2 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'AI Recipe Master', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

-- Function to track club joining
CREATE OR REPLACE FUNCTION public.track_club_joining(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  club_count integer;
BEGIN
  -- Check if this is the user's first club join
  SELECT COUNT(*) INTO club_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'club_join';
  
  -- If no previous club join recorded, award the achievement
  IF club_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 200, 'club_join', 'Joined your first club');
  END IF;
END;
$function$;

-- Function to track news article views
CREATE OR REPLACE FUNCTION public.track_news_article_view(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  article_view_count integer;
BEGIN
  -- Count news article views
  SELECT COUNT(*) INTO article_view_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'news_article_view';
  
  -- Award small XP for each view
  PERFORM public.award_xp(user_id_param, 10, 'news_article_view', 'Viewed a news article');
  
  -- Check for News Reader badge (3 articles)
  IF article_view_count + 1 >= 3 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'News Reader', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

-- Update the award_xp function to handle the new achievement types
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
    -- Recipe Creator Badge (first recipe) - Updated to 200 XP
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Recipe Creator', 200)
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
  
  IF action_type_param = 'course_attendance' THEN
    -- Course Attendee Badge
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Course Attendee', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'club_join' THEN
    -- Club Member Badge
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Club Member', 200)
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
