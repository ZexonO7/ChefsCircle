
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, CheckCircle, MessageCircle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useQuestionDetail } from '@/hooks/useQuestions';
import { Textarea } from '@/components/ui/textarea';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newAnswer, setNewAnswer] = useState('');
  
  const { question, answers, loading, submitAnswer } = useQuestionDetail(id || '');

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an answer.",
        variant: "destructive",
      });
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please write your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const success = await submitAnswer(newAnswer.trim());
    if (success) {
      setNewAnswer('');
    }
  };

  const handleLike = (answerId: string) => {
    toast({
      title: "Coming Soon",
      description: "Answer voting feature is under development.",
    });
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-chef-warm-ivory pt-20">
          <div className="chef-container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="chef-card p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!question) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-chef-warm-ivory pt-20">
          <div className="chef-container py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="chef-heading-lg text-chef-charcoal mb-4">Question Not Found</h1>
              <p className="chef-body text-chef-charcoal/60 mb-6">
                The question you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/library')}
                className="chef-button-primary"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title={`${question.title} - ChefsCircle Community`}
        description={question.content}
        keywords={['cooking question', 'culinary help', 'chef advice', question.category.toLowerCase()]}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        <div className="chef-container py-8">
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-chef-royal-blue hover:text-chef-charcoal transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>

          <div className="max-w-4xl mx-auto">
            {/* Question */}
            <motion.div
              className="chef-card p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="chef-badge-blue text-sm">{question.category}</span>
                    {question.has_accepted_answer && (
                      <span className="chef-badge-green text-sm">
                        ✓ Answered
                      </span>
                    )}
                  </div>
                  <h1 className="chef-heading-lg text-chef-charcoal mb-4">
                    {question.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-chef-charcoal/60 mb-6">
                    <span>Asked by {question.author?.full_name || 'Anonymous'}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(question.created_at)}</span>
                    </div>
                  </div>
                  <p className="chef-body text-chef-charcoal whitespace-pre-line">
                    {question.content}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="chef-heading-md text-chef-charcoal mb-6">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
              
              <div className="space-y-6">
                {answers.map((answer, index) => (
                  <motion.div
                    key={answer.id}
                    className={`chef-card p-6 ${answer.is_accepted ? 'border-l-4 border-chef-royal-green' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-medium text-chef-charcoal">
                            {answer.author?.full_name || 'Anonymous'}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-chef-charcoal/60">
                            <Clock className="w-4 h-4" />
                            <span>{formatTimeAgo(answer.created_at)}</span>
                          </div>
                          {answer.is_accepted && (
                            <span className="chef-badge-green text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted Answer
                            </span>
                          )}
                        </div>
                        <p className="chef-body text-chef-charcoal whitespace-pre-line mb-4">
                          {answer.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(answer.id)}
                            className="flex items-center gap-1 text-sm text-chef-charcoal/60 hover:text-chef-royal-blue transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{answer.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {answers.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-chef-charcoal/30 mx-auto mb-4" />
                  <p className="chef-body text-chef-charcoal/60">
                    No answers yet. Be the first to help!
                  </p>
                </div>
              )}
            </div>

            {/* Answer Form */}
            <motion.div
              className="chef-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="chef-heading-sm text-chef-charcoal mb-4">Your Answer</h3>
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Share your knowledge and help the community..."
                className="w-full h-32 p-4 border border-chef-royal-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chef-gold resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitAnswer}
                  className="chef-button-primary"
                  disabled={!newAnswer.trim()}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Submit Answer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default QuestionDetail;
