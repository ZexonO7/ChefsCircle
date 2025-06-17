
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  has_accepted_answer: boolean;
  user_id: string;
  author?: {
    full_name: string;
    username: string;
  };
}

export interface Answer {
  id: string;
  question_id: string;
  content: string;
  is_accepted: boolean;
  likes: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  author?: {
    full_name: string;
    username: string;
  };
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const questionsWithAuthors = data?.map(q => ({
        ...q,
        author: q.profiles ? {
          full_name: q.profiles.full_name || 'Anonymous',
          username: q.profiles.username || 'user'
        } : {
          full_name: 'Anonymous',
          username: 'user'
        }
      })) || [];

      setQuestions(questionsWithAuthors);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async (title: string, content: string, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to ask a question.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('questions')
        .insert({
          title,
          content,
          category,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your question has been posted!",
      });

      fetchQuestions(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    submitQuestion,
    refetch: fetchQuestions
  };
};

export const useQuestionDetail = (questionId: string) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuestionDetail = async () => {
    try {
      // Fetch question with author info
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      const questionWithAuthor = {
        ...questionData,
        author: questionData.profiles ? {
          full_name: questionData.profiles.full_name || 'Anonymous',
          username: questionData.profiles.username || 'user'
        } : {
          full_name: 'Anonymous',
          username: 'user'
        }
      };

      setQuestion(questionWithAuthor);

      // Fetch answers with author info
      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select(`
          *,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .eq('question_id', questionId)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;

      const answersWithAuthors = answersData?.map(a => ({
        ...a,
        author: a.profiles ? {
          full_name: a.profiles.full_name || 'Anonymous',
          username: a.profiles.username || 'user'
        } : {
          full_name: 'Anonymous',
          username: 'user'
        }
      })) || [];

      setAnswers(answersWithAuthors);
    } catch (error) {
      console.error('Error fetching question detail:', error);
      toast({
        title: "Error",
        description: "Failed to load question details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit an answer.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('answers')
        .insert({
          question_id: questionId,
          content,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your answer has been posted!",
      });

      fetchQuestionDetail(); // Refresh the data
      return true;
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetail();
    }
  }, [questionId]);

  return {
    question,
    answers,
    loading,
    submitAnswer,
    refetch: fetchQuestionDetail
  };
};
