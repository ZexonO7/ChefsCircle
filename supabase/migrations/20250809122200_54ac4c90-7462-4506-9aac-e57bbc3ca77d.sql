-- Fix notifications table RLS policies to allow automatic notification creation

-- Drop the existing overly restrictive notification policies
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

-- Create a more permissive policy for creating notifications
-- This allows notifications to be created by the system when answers are submitted
CREATE POLICY "Allow system to create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Ensure answers table has proper INSERT policy
CREATE POLICY "Users can insert their own answers" 
ON public.answers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());