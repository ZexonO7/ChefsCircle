
-- 1. Add notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL DEFAULT 'recipe_rejected',
  content TEXT NOT NULL,
  seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Add trigger function to send notification when a recipe is rejected
CREATE OR REPLACE FUNCTION notify_on_recipe_rejection()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- Attach trigger to user_recipes table
DROP TRIGGER IF EXISTS trg_notify_recipe_rejected ON public.user_recipes;
CREATE TRIGGER trg_notify_recipe_rejected
AFTER UPDATE ON public.user_recipes
FOR EACH ROW
EXECUTE FUNCTION notify_on_recipe_rejection();

-- 3. Make sure public/user can only see 'approved' or their own recipes by updating the RLS policy
DROP POLICY IF EXISTS "Users can view approved recipes and their own" ON public.user_recipes;
CREATE POLICY "Users can view approved recipes and their own" ON public.user_recipes
  FOR SELECT USING (
    (status = 'approved' AND status != 'rejected')
    OR user_id = auth.uid()
    OR auth.email() = 'Advithya07@gmail.com'
  );
