
-- Remove the existing view policy that allows seeing own recipes or admin
DROP POLICY IF EXISTS "Users can view approved recipes and their own" ON public.user_recipes;

-- Create stricter policy: only approved, not rejected recipes are visible, regardless of who requested
CREATE POLICY "Users can view only approved (not rejected) recipes" ON public.user_recipes
  FOR SELECT
  USING (
    status = 'approved'
    AND status != 'rejected'
  );

-- (Existing notification trigger remains unchanged and is correct)
