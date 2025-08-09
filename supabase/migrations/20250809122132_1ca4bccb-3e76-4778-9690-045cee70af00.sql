-- Fix RLS policy for notifications table to allow automatic notifications when answers are submitted

-- First, let's check if there are any existing policies on notifications table
-- Drop any overly restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

-- Create proper RLS policies for notifications table
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow system to create notifications (more permissive for INSERT)
CREATE POLICY "Allow notifications to be created" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own notifications (for marking as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Also ensure the answers table has proper policies
-- Create policy for users to insert their own answers
CREATE POLICY "Users can insert their own answers" 
ON public.answers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create policy for anyone to view answers 
CREATE POLICY "Anyone can view answers" 
ON public.answers 
FOR SELECT 
USING (true);