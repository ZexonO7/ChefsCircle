-- Fix remaining database functions that need search_path

CREATE OR REPLACE FUNCTION public.notify_on_recipe_rejection()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  notification_text TEXT;
BEGIN
  IF NEW.status = 'rejected' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    notification_text := 
      'Your recipe "' || NEW.title || '" was rejected. Reason: ' || COALESCE(NEW.admin_notes, 'No reason provided.');

    INSERT INTO public.notifications (user_id, type, content)
    VALUES (NEW.user_id, 'recipe_rejected', notification_text);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_question_answered()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  question_owner_id UUID;
  question_title TEXT;
BEGIN
  SELECT user_id, title INTO question_owner_id, question_title
  FROM public.questions 
  WHERE id = NEW.question_id;
  
  IF question_owner_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, content)
    VALUES (
      question_owner_id, 
      'answer_received', 
      'Your question "' || question_title || '" received a new answer!'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_update_daily_recipe_usage(user_id_param uuid, max_daily_limit integer DEFAULT 5)
RETURNS TABLE(can_generate boolean, current_count integer, remaining_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_usage_count INTEGER := 0;
  user_subscription_tier TEXT;
  tier_limit INTEGER;
BEGIN
  SELECT subscription_tier INTO user_subscription_tier
  FROM public.subscribers
  WHERE user_id = user_id_param AND subscribed = true;
  
  IF user_subscription_tier = 'enterprise' THEN
    tier_limit := 999999;
  ELSIF user_subscription_tier = 'premium' THEN
    tier_limit := 25;
  ELSIF user_subscription_tier = 'basic' THEN
    tier_limit := 10;
  ELSE
    tier_limit := 5;
  END IF;
  
  INSERT INTO public.ai_recipe_daily_usage (user_id, generation_date, generation_count)
  VALUES (user_id_param, CURRENT_DATE, 0)
  ON CONFLICT (user_id, generation_date) 
  DO NOTHING;
  
  SELECT generation_count INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  IF current_usage_count < tier_limit THEN
    UPDATE public.ai_recipe_daily_usage
    SET generation_count = generation_count + 1,
        updated_at = now()
    WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
    
    RETURN QUERY SELECT 
      TRUE as can_generate, 
      (current_usage_count + 1) as current_count,
      (tier_limit - current_usage_count - 1) as remaining_count;
  ELSE
    RETURN QUERY SELECT 
      FALSE as can_generate, 
      current_usage_count as current_count,
      0 as remaining_count;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_question_ask(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  question_count integer;
BEGIN
  SELECT COUNT(*) INTO question_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'question_ask';
  
  PERFORM public.award_xp(user_id_param, 15, 'question_ask', 'Asked a cooking question');
  
  IF question_count + 1 >= 5 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Curious Chef', 150)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF question_count + 1 >= 20 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Question Master', 400)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_answer_vote_counts(answer_id_param uuid)
RETURNS TABLE(upvotes integer, downvotes integer, net_votes integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END)::INTEGER as upvotes,
    COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)::INTEGER as downvotes,
    (COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END))::INTEGER as net_votes
  FROM public.answer_votes 
  WHERE answer_id = answer_id_param;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_challenge_progress(user_id_param uuid, challenge_type_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  active_challenge RECORD;
  user_progress RECORD;
  action_count integer;
BEGIN
  SELECT * INTO active_challenge 
  FROM public.weekly_challenges 
  WHERE challenge_type = challenge_type_param 
    AND is_active = true 
    AND CURRENT_DATE BETWEEN start_date AND end_date
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  SELECT COUNT(*) INTO action_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param 
    AND action_type = challenge_type_param
    AND DATE(created_at) BETWEEN active_challenge.start_date AND active_challenge.end_date;
  
  SELECT * INTO user_progress 
  FROM public.user_challenge_progress 
  WHERE user_id = user_id_param AND challenge_id = active_challenge.id;
  
  IF NOT FOUND THEN
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
  
  IF action_count >= active_challenge.target_count AND 
     (user_progress IS NULL OR NOT user_progress.completed) THEN
    
    PERFORM public.award_xp(
      user_id_param, 
      active_challenge.xp_reward, 
      'challenge_completion',
      'Completed: ' || active_challenge.title
    );
    
    IF active_challenge.badge_reward IS NOT NULL THEN
      INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
      VALUES (user_id_param, 'badge', active_challenge.badge_reward, 0)
      ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    END IF;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_course_attendance(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  attendance_count integer;
BEGIN
  SELECT COUNT(*) INTO attendance_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'course_attendance';
  
  IF attendance_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 200, 'course_attendance', 'Attended your first course');
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_ai_recipe_generation(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  generation_count integer;
BEGIN
  SELECT COUNT(*) INTO generation_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'ai_recipe_generation';
  
  PERFORM public.award_xp(user_id_param, 25, 'ai_recipe_generation', 'Generated recipes using AI');
  
  IF generation_count + 1 >= 2 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'AI Recipe Master', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_club_joining(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  club_count integer;
BEGIN
  SELECT COUNT(*) INTO club_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'club_join';
  
  IF club_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 200, 'club_join', 'Joined your first club');
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_news_article_view(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  article_view_count integer;
BEGIN
  SELECT COUNT(*) INTO article_view_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'news_article_view';
  
  PERFORM public.award_xp(user_id_param, 10, 'news_article_view', 'Viewed a news article');
  
  IF article_view_count + 1 >= 3 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'News Reader', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_first_login(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  login_count integer;
BEGIN
  SELECT COUNT(*) INTO login_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'first_login';
  
  IF login_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 50, 'first_login', 'Welcome to ChefCircle!');
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_profile_customization(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  customization_count integer;
BEGIN
  SELECT COUNT(*) INTO customization_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'profile_customization';
  
  IF customization_count = 0 THEN
    PERFORM public.award_xp(user_id_param, 75, 'profile_customization', 'Customized your profile');
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_xp(user_id_param uuid, xp_amount integer, action_type_param text, action_description_param text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_data RECORD;
  new_total_xp integer;
  new_level integer;
  achievement_earned boolean := false;
BEGIN
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
  
  INSERT INTO public.gamification_actions (user_id, action_type, action_description, xp_earned)
  VALUES (user_id_param, action_type_param, action_description_param, xp_amount);
  
  PERFORM public.update_challenge_progress(user_id_param, action_type_param);
  
  IF action_type_param = 'first_login' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Welcome Chef', 50)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'profile_customization' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Profile Master', 75)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'recipe_upload' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Recipe Creator', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    
    IF (SELECT COUNT(*) FROM public.gamification_actions WHERE user_id = user_id_param AND action_type = 'recipe_upload') >= 10 THEN
      INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
      VALUES (user_id_param, 'badge', 'Master Chef', 500)
      ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
    END IF;
  END IF;
  
  IF action_type_param = 'club_creation' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Community Leader', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'course_attendance' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Course Attendee', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF action_type_param = 'club_join' THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Club Member', 200)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  IF new_level > COALESCE(current_data.level, 1) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'level', 'Level ' || new_level, 50)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_answer_vote(answer_id_param uuid, user_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_vote TEXT;
BEGIN
  SELECT vote_type INTO user_vote
  FROM public.answer_votes 
  WHERE answer_id = answer_id_param AND user_id = user_id_param;
  
  RETURN user_vote;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_answer_likes_from_votes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  net_votes INTEGER;
BEGIN
  SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
  INTO net_votes
  FROM public.answer_votes 
  WHERE answer_id = COALESCE(NEW.answer_id, OLD.answer_id);
  
  UPDATE public.answers 
  SET likes = GREATEST(0, net_votes)
  WHERE id = COALESCE(NEW.answer_id, OLD.answer_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_daily_recipe_usage(user_id_param uuid, max_daily_limit integer DEFAULT 5)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_usage_count INTEGER;
  user_subscription_tier TEXT;
  tier_limit INTEGER;
  result JSON;
BEGIN
  SELECT subscription_tier INTO user_subscription_tier
  FROM public.subscribers
  WHERE user_id = user_id_param AND subscribed = true;
  
  IF user_subscription_tier = 'enterprise' THEN
    tier_limit := 999999;
  ELSIF user_subscription_tier = 'premium' THEN
    tier_limit := 25;
  ELSIF user_subscription_tier = 'basic' THEN
    tier_limit := 10;
  ELSE
    tier_limit := 5;
  END IF;
  
  SELECT COALESCE(generation_count, 0) INTO current_usage_count
  FROM public.ai_recipe_daily_usage
  WHERE user_id = user_id_param AND generation_date = CURRENT_DATE;
  
  IF current_usage_count IS NULL THEN
    current_usage_count := 0;
  END IF;
  
  SELECT json_build_object(
    'current_count', current_usage_count,
    'remaining_count', GREATEST(0, tier_limit - current_usage_count),
    'can_generate', (current_usage_count < tier_limit),
    'subscription_tier', COALESCE(user_subscription_tier, 'free'),
    'daily_limit', tier_limit
  ) INTO result;
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$;