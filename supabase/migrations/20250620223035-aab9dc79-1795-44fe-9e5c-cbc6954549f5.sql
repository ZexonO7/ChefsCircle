
-- Create a table to store user course progress
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Add Row Level Security (RLS) to ensure users can only see their own progress
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own progress
CREATE POLICY "Users can view their own course progress" 
  ON public.user_course_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own progress
CREATE POLICY "Users can create their own course progress" 
  ON public.user_course_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own progress
CREATE POLICY "Users can update their own course progress" 
  ON public.user_course_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own progress
CREATE POLICY "Users can delete their own course progress" 
  ON public.user_course_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);
