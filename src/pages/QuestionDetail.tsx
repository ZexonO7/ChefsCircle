
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, CheckCircle, MessageCircle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newAnswer, setNewAnswer] = useState('');

  // Mock question data - in a real app, this would come from an API
  const question = {
    id: parseInt(id || '1'),
    title: "How do I properly temper chocolate for molding?",
    category: "Techniques",
    author: "ChefsCircle",
    timeAgo: "2 hours ago",
    content: "I'm trying to make chocolate molds but my chocolate keeps getting cloudy and doesn't have that nice snap when it sets. I've tried different temperatures but can't seem to get it right. What's the proper technique for tempering chocolate at home without special equipment?",
    hasAcceptedAnswer: true
  };

  const answers = [
    {
      id: 1,
      author: "ChefsCircle",
      timeAgo: "1 hour ago",
      content: "Tempering chocolate is all about controlling the crystal structure. Here's the seeding method that works well at home:\n\n1. Melt 2/3 of your chocolate to 115°F (46°C) for dark chocolate, 110°F (43°C) for milk/white\n2. Remove from heat and add the remaining 1/3 unmelted chocolate\n3. Stir continuously until temperature drops to 84°F (29°C)\n4. Reheat slightly to 88-90°F (31-32°C) for dark, 86-88°F (30-31°C) for milk/white\n\nTest by dipping a knife - properly tempered chocolate will set with a glossy finish and audible snap when broken.",
      isAccepted: true,
      likes: 24
    },
    {
      id: 2,
      author: "ChefsCircle",
      timeAgo: "45 minutes ago",
      content: "Great answer above! I'd also add that marble slabs work wonderfully for the cooling phase if you have one. The key is patience - don't rush the cooling process. Also, make sure your workspace isn't too warm or humid, as this can affect the tempering process.",
      isAccepted: false,
      likes: 8
    }
  ];

  const handleSubmitAnswer = () => {
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

    toast({
      title: "Coming Soon",
      description: "Answer submission feature is under development.",
    });
  };

  const handleLike = (answerId: number) => {
    toast({
      title: "Coming Soon",
      description: "Answer voting feature is under development.",
    });
  };

  return (
    <PageLayout>
      <SEO 
        title={`${question.title} - ChefCircle Community`}
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
                    {question.hasAcceptedAnswer && (
                      <span className="chef-badge-green text-sm">
                        ✓ Answered
                      </span>
                    )}
                  </div>
                  <h1 className="chef-heading-lg text-chef-charcoal mb-4">
                    {question.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-chef-charcoal/60 mb-6">
                    <span>Asked by {question.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{question.timeAgo}</span>
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
                    className={`chef-card p-6 ${answer.isAccepted ? 'border-l-4 border-chef-royal-green' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-medium text-chef-charcoal">{answer.author}</span>
                          <div className="flex items-center gap-1 text-sm text-chef-charcoal/60">
                            <Clock className="w-4 h-4" />
                            <span>{answer.timeAgo}</span>
                          </div>
                          {answer.isAccepted && (
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
            </div>

            {/* Answer Form */}
            <motion.div
              className="chef-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="chef-heading-sm text-chef-charcoal mb-4">Your Answer</h3>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Share your knowledge and help the community..."
                className="w-full h-32 p-4 border border-chef-royal-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-chef-gold resize-none"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitAnswer}
                  className="chef-button-primary"
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
