
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
          profiles!inner (
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
          profiles!inner (
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
          profiles!inner (
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

// Hook to get popular topics with real counts
export const usePopularTopics = () => {
  const [popularTopics, setPopularTopics] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularTopics = async () => {
      try {
        // Get count of questions by category
        const { data: categoryData, error: categoryError } = await supabase
          .from('questions')
          .select('category')
          .not('category', 'is', null);

        if (categoryError) throw categoryError;

        // Count questions per category
        const categoryCounts = categoryData.reduce((acc: Record<string, number>, question) => {
          acc[question.category] = (acc[question.category] || 0) + 1;
          return acc;
        }, {});

        // Also get counts by searching content for popular cooking terms
        const { data: allQuestions, error: questionsError } = await supabase
          .from('questions')
          .select('title, content');

        if (questionsError) throw questionsError;

        const topicCounts = {
          "Knife Skills": 0,
          "Bread Making": 0,
          "Sauce Techniques": 0,
          "Food Safety": 0,
          "Pasta Making": 0,
          "Chocolate Work": 0
        };

        allQuestions.forEach(question => {
          const text = `${question.title} ${question.content}`.toLowerCase();
          
          if (text.includes('knife') || text.includes('cutting') || text.includes('chopping')) {
            topicCounts["Knife Skills"]++;
          }
          if (text.includes('bread') || text.includes('baking') || text.includes('yeast') || text.includes('dough')) {
            topicCounts["Bread Making"]++;
          }
          if (text.includes('sauce') || text.includes('hollandaise') || text.includes('reduction') || text.includes('roux')) {
            topicCounts["Sauce Techniques"]++;
          }
          if (text.includes('food safety') || text.includes('temperature') || text.includes('bacteria') || text.includes('hygiene')) {
            topicCounts["Food Safety"]++;
          }
          if (text.includes('pasta') || text.includes('noodle') || text.includes('spaghetti') || text.includes('ravioli')) {
            topicCounts["Pasta Making"]++;
          }
          if (text.includes('chocolate') || text.includes('cocoa') || text.includes('ganache') || text.includes('tempering')) {
            topicCounts["Chocolate Work"]++;
          }
        });

        const topics = Object.entries(topicCounts).map(([name, count]) => ({
          name,
          count
        })).sort((a, b) => b.count - a.count);

        setPopularTopics(topics);
      } catch (error) {
        console.error('Error fetching popular topics:', error);
        // Fallback to empty array if there's an error
        setPopularTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTopics();
  }, []);

  return { popularTopics, loading };
};
