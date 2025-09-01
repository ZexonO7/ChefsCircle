-- Fix security issue: Restrict access to questions, answers, and answer_votes to authenticated users only

-- Drop existing overly permissive SELECT policies
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can view answers" ON public.answers;  
DROP POLICY IF EXISTS "Users can view all votes" ON public.answer_votes;

-- Create new secure SELECT policies that require authentication
CREATE POLICY "Authenticated users can view questions" 
ON public.questions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view answers" 
ON public.answers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view votes" 
ON public.answer_votes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);