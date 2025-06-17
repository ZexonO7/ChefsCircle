
-- Add foreign key relationships between questions/answers and profiles tables
-- Since both reference auth.users, we need to create relationships through profiles

-- First, let's add foreign key constraints to link questions and answers to profiles
ALTER TABLE public.questions 
ADD CONSTRAINT questions_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.answers 
ADD CONSTRAINT answers_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
