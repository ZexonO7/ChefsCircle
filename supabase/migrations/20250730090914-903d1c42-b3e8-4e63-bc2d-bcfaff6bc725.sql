-- Insert sample challenges for different durations
INSERT INTO public.weekly_challenges (
  title, 
  description, 
  challenge_type, 
  target_count, 
  xp_reward, 
  start_date, 
  end_date, 
  is_active
) VALUES
-- 24-hour challenges
('Quick Recipe Upload', 'Upload 1 savory recipe within 24 hours', 'recipe_upload', 1, 100, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', true),
('Daily Curious Chef', 'Ask 3 cooking questions within 24 hours', 'question_ask', 3, 75, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', true),

-- 3-day challenges  
('Recipe Explorer', 'Upload 3 different recipes in 3 days', 'recipe_upload', 3, 300, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', true),
('Knowledge Seeker', 'Ask 10 questions about cooking in 3 days', 'question_ask', 10, 250, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', true),
('Course Starter', 'Complete 1 cooking course lesson in 3 days', 'course_attendance', 1, 200, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', true),

-- Weekly challenges
('Master Chef Challenge', 'Upload 7 unique recipes this week', 'recipe_upload', 7, 750, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true),
('Question Master', 'Ask 20 cooking questions this week', 'question_ask', 20, 600, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true),
('Learning Enthusiast', 'Attend 3 course lessons this week', 'course_attendance', 3, 500, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true),
('AI Recipe Explorer', 'Generate 5 AI recipes this week', 'ai_recipe_generation', 5, 400, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', true);

-- Create function to track question asking
CREATE OR REPLACE FUNCTION public.track_question_ask(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  question_count integer;
BEGIN
  -- Count questions asked
  SELECT COUNT(*) INTO question_count
  FROM public.gamification_actions 
  WHERE user_id = user_id_param AND action_type = 'question_ask';
  
  -- Award XP for each question
  PERFORM public.award_xp(user_id_param, 15, 'question_ask', 'Asked a cooking question');
  
  -- Check for Curious Chef badge (5 questions)
  IF question_count + 1 >= 5 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Curious Chef', 150)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
  
  -- Check for Question Master badge (20 questions)
  IF question_count + 1 >= 20 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_name, xp_awarded)
    VALUES (user_id_param, 'badge', 'Question Master', 400)
    ON CONFLICT (user_id, achievement_type, achievement_name) DO NOTHING;
  END IF;
END;
$function$;