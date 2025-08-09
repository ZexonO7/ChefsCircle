-- Create votes table for answer voting
CREATE TABLE public.answer_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(answer_id, user_id)
);

-- Enable RLS
ALTER TABLE public.answer_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all votes" 
ON public.answer_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own votes" 
ON public.answer_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON public.answer_votes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.answer_votes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to calculate vote counts for an answer
CREATE OR REPLACE FUNCTION public.get_answer_vote_counts(answer_id_param UUID)
RETURNS TABLE(upvotes INTEGER, downvotes INTEGER, net_votes INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END)::INTEGER as upvotes,
    COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)::INTEGER as downvotes,
    (COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END))::INTEGER as net_votes
  FROM public.answer_votes 
  WHERE answer_id = answer_id_param;
END;
$$;

-- Create function to get user's vote for an answer
CREATE OR REPLACE FUNCTION public.get_user_answer_vote(answer_id_param UUID, user_id_param UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_vote TEXT;
BEGIN
  SELECT vote_type INTO user_vote
  FROM public.answer_votes 
  WHERE answer_id = answer_id_param AND user_id = user_id_param;
  
  RETURN user_vote;
END;
$$;

-- Create trigger to update answer likes count when votes change
CREATE OR REPLACE FUNCTION public.update_answer_likes_from_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  net_votes INTEGER;
BEGIN
  -- Calculate net votes (upvotes - downvotes) for the answer
  SELECT COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) - COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END)
  INTO net_votes
  FROM public.answer_votes 
  WHERE answer_id = COALESCE(NEW.answer_id, OLD.answer_id);
  
  -- Update the answer's likes count
  UPDATE public.answers 
  SET likes = GREATEST(0, net_votes)
  WHERE id = COALESCE(NEW.answer_id, OLD.answer_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for vote changes
CREATE TRIGGER update_answer_likes_on_vote_insert
  AFTER INSERT ON public.answer_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_answer_likes_from_votes();

CREATE TRIGGER update_answer_likes_on_vote_update
  AFTER UPDATE ON public.answer_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_answer_likes_from_votes();

CREATE TRIGGER update_answer_likes_on_vote_delete
  AFTER DELETE ON public.answer_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_answer_likes_from_votes();