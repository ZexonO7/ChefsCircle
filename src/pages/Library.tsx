
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Search, Plus, Clock, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuestions, usePopularTopics } from '@/hooks/useQuestions';
import AskQuestionModal from '@/components/AskQuestionModal';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { questions, loading, submitQuestion } = useQuestions();
  const { popularTopics, loading: topicsLoading } = usePopularTopics();

  const categories = ['All', 'Techniques', 'Ingredients', 'Equipment', 'Troubleshooting', 'Nutrition', 'Food Safety'];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAskQuestion = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to ask a question.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setIsAskModalOpen(true);
  };

  const handleQuestionClick = (questionId: string) => {
    navigate(`/library/question/${questionId}`);
  };

  const handleTopicClick = (topicName: string) => {
    setSearchTerm(topicName.toLowerCase());
    setSelectedCategory('All');
  };

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

  return (
    <PageLayout>
      <SEO 
        title="Library of Knowledge - ChefsCircle Community" 
        description="Search cooking questions and get expert answers from the ChefsCircle community. Share your culinary knowledge and learn from experienced chefs."
        keywords={['cooking questions', 'culinary knowledge', 'chef advice', 'cooking help', 'food Q&A']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Hero Section */}
        <section className="chef-section bg-gradient-to-br from-chef-charcoal to-chef-royal-blue">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
                Library of <span className="text-chef-gold">Knowledge</span>
              </h1>
              <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
                Find answers to your culinary questions or ask the community for expert advice
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search cooking questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-chef-royal-blue/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
                  />
                </div>
                <button 
                  onClick={handleAskQuestion}
                  className="chef-button bg-chef-gold text-chef-charcoal hover:bg-chef-bronze"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ask Question
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="chef-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="chef-card p-6 sticky top-24">
                <h3 className="chef-heading-sm text-chef-charcoal mb-4">Categories</h3>
                <div className="space-y-2 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-chef-royal-green text-chef-warm-ivory'
                          : 'text-chef-charcoal hover:bg-chef-royal-green/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <h3 className="chef-heading-sm text-chef-charcoal mb-4">Popular Topics</h3>
                <div className="space-y-2">
                  {topicsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    popularTopics.map((topic) => (
                      <div key={topic.name} className="flex items-center justify-between text-sm">
                        <button 
                          onClick={() => handleTopicClick(topic.name)}
                          className="text-chef-charcoal hover:text-chef-royal-green cursor-pointer transition-colors"
                        >
                          {topic.name}
                        </button>
                        <span className="text-chef-charcoal/60">{topic.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="chef-heading-md text-chef-charcoal">
                  {selectedCategory === 'All' ? 'All Questions' : `${selectedCategory} Questions`}
                </h2>
                <span className="text-chef-charcoal/60">
                  {loading ? 'Loading...' : `${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`}
                </span>
              </div>

              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="chef-card p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      className="chef-card p-6 hover:shadow-chef-luxury transition-all duration-300 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => handleQuestionClick(question.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="chef-heading-sm text-chef-charcoal group-hover:text-chef-royal-green transition-colors">
                              {question.title}
                            </h3>
                            {question.has_accepted_answer && (
                              <span className="chef-badge-green text-xs">
                                ✓ Answered
                              </span>
                            )}
                          </div>
                          
                          <p className="chef-body-sm text-chef-charcoal/80 mb-3 line-clamp-2">
                            {question.content}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-chef-charcoal/60">
                            <div className="flex items-center gap-1">
                              <span>by {question.author?.full_name || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(question.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <span className="chef-badge-blue text-xs">{question.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {!loading && filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-chef-charcoal/30 mx-auto mb-4" />
                  <h3 className="chef-heading-sm text-chef-charcoal mb-2">No questions found</h3>
                  <p className="chef-body text-chef-charcoal/60 mb-6">
                    {searchTerm 
                      ? "Try adjusting your search terms or explore different categories."
                      : "Be the first to ask a question in this category!"
                    }
                  </p>
                  <button 
                    onClick={handleAskQuestion}
                    className="chef-button-primary"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ask the First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <section className="chef-section bg-chef-royal-green/5">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-3xl mx-auto chef-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BookOpen className="w-12 h-12 text-chef-royal-green mx-auto mb-4" />
              <h2 className="chef-heading-md text-chef-charcoal mb-4">
                Community Guidelines
              </h2>
              <p className="chef-body text-chef-charcoal/80 mb-6">
                Our knowledge library thrives on helpful, respectful discussions. Help us maintain a positive learning environment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-chef-charcoal mb-2">Be Specific</h4>
                  <p className="text-sm text-chef-charcoal/70">Include details about your cooking situation, ingredients, and what you've already tried.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-chef-charcoal mb-2">Stay Respectful</h4>
                  <p className="text-sm text-chef-charcoal/70">Everyone is learning. Be kind and constructive in your responses and questions.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-chef-charcoal mb-2">Share Knowledge</h4>
                  <p className="text-sm text-chef-charcoal/70">If you know the answer, share your expertise and help fellow community members grow.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmit={submitQuestion}
      />
    </PageLayout>
  );
};

export default Library;
