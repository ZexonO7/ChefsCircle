-- Fix critical privacy issue: Remove policy that allows all users to view all profiles
-- This prevents unauthorized access to email addresses and personal data

-- Drop the overly permissive policy that allows any authenticated user to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- The existing "Users can view their own profile" policy remains and is sufficient
-- Users can still view/edit their own profiles but cannot access others' personal data

-- If specific features need access to other users' data, implement separate policies
-- with explicit permission checks rather than blanket access