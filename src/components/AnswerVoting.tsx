import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAnswerVoting } from '@/hooks/useAnswerVoting';

interface AnswerVotingProps {
  answerId: string;
}

export function AnswerVoting({ answerId }: AnswerVotingProps) {
  const { voteCounts, userVote, loading, vote } = useAnswerVoting(answerId);

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        onClick={() => vote('upvote')}
        disabled={loading}
        className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
          userVote === 'upvote'
            ? 'bg-chef-royal-blue text-chef-cream shadow-lg scale-110'
            : 'bg-chef-cream text-chef-charcoal hover:bg-chef-royal-blue/10 hover:text-chef-royal-blue'
        }`}
        aria-label="Upvote answer"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
      
      <span 
        className={`font-semibold text-lg min-w-[2rem] text-center ${
          voteCounts.net_votes > 0 
            ? 'text-chef-royal-blue' 
            : voteCounts.net_votes < 0 
            ? 'text-red-500' 
            : 'text-chef-charcoal'
        }`}
      >
        {voteCounts.net_votes}
      </span>
      
      <button
        onClick={() => vote('downvote')}
        disabled={loading}
        className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
          userVote === 'downvote'
            ? 'bg-red-500 text-white shadow-lg scale-110'
            : 'bg-chef-cream text-chef-charcoal hover:bg-red-50 hover:text-red-500'
        }`}
        aria-label="Downvote answer"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}