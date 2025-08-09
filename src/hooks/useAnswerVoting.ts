import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface VoteCounts {
  upvotes: number;
  downvotes: number;
  net_votes: number;
}

export function useAnswerVoting(answerId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({ upvotes: 0, downvotes: 0, net_votes: 0 });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch vote counts and user's vote
  const fetchVoteData = async () => {
    try {
      // Get vote counts
      const { data: voteCountsData, error: voteCountsError } = await supabase
        .rpc('get_answer_vote_counts', { answer_id_param: answerId });

      if (voteCountsError) throw voteCountsError;

      if (voteCountsData && voteCountsData.length > 0) {
        setVoteCounts(voteCountsData[0]);
      }

      // Get user's vote if authenticated
      if (user) {
        const { data: userVoteData, error: userVoteError } = await supabase
          .rpc('get_user_answer_vote', { 
            answer_id_param: answerId, 
            user_id_param: user.id 
          });

        if (userVoteError) throw userVoteError;
        setUserVote(userVoteData);
      }
    } catch (error) {
      console.error('Error fetching vote data:', error);
    }
  };

  useEffect(() => {
    fetchVoteData();
  }, [answerId, user]);

  // Set up real-time subscription for vote changes
  useEffect(() => {
    const channel = supabase
      .channel('answer-votes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'answer_votes',
          filter: `answer_id=eq.${answerId}`
        },
        () => {
          fetchVoteData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [answerId]);

  const vote = async (voteType: 'upvote' | 'downvote') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on answers.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // If user already voted the same way, remove the vote
      if (userVote === voteType) {
        const { error } = await supabase
          .from('answer_votes')
          .delete()
          .eq('answer_id', answerId)
          .eq('user_id', user.id);

        if (error) throw error;

        setUserVote(null);
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
        });
      } else {
        // Insert or update vote
        const { error } = await supabase
          .from('answer_votes')
          .upsert({
            answer_id: answerId,
            user_id: user.id,
            vote_type: voteType,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        setUserVote(voteType);
        toast({
          title: "Vote recorded",
          description: `You ${voteType}d this answer.`,
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    voteCounts,
    userVote,
    loading,
    vote
  };
}