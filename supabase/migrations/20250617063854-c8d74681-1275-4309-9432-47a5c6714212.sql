
-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  has_accepted_answer BOOLEAN DEFAULT false
);

-- Create answers table
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- RLS policies for questions (allow public read, authenticated users can create)
CREATE POLICY "Anyone can view questions" 
  ON public.questions FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create questions" 
  ON public.questions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" 
  ON public.questions FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for answers (allow public read, authenticated users can create)
CREATE POLICY "Anyone can view answers" 
  ON public.answers FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create answers" 
  ON public.answers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" 
  ON public.answers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to create notifications when answers are posted
CREATE OR REPLACE FUNCTION notify_question_answered()
RETURNS TRIGGER AS $$
DECLARE
  question_owner_id UUID;
  question_title TEXT;
BEGIN
  -- Get the question owner and title
  SELECT user_id, title INTO question_owner_id, question_title
  FROM public.questions 
  WHERE id = NEW.question_id;
  
  -- Only notify if the answer author is different from question author
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
$$ LANGUAGE plpgsql;

-- Trigger to call notification function when answer is created
CREATE TRIGGER on_answer_created
  AFTER INSERT ON public.answers
  FOR EACH ROW EXECUTE FUNCTION notify_question_answered();
