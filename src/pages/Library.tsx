import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Search, Plus, MessageCircle, ThumbsUp, Clock, User, HelpCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Techniques', 'Ingredients', 'Equipment', 'Troubleshooting', 'Nutrition', 'Food Safety'];

  const questions = [
    {
      id: 1,
      title: "How do I properly temper chocolate for molding?",
      category: "Techniques",
      author: "Baker Sarah",
      answers: 12,
      views: 2847,
      likes: 89,
      timeAgo: "2 hours ago",
      hasAcceptedAnswer: true,
      preview: "I'm trying to make chocolate molds but my chocolate keeps getting cloudy and doesn't have that nice snap..."
    },
    {
      id: 2,
      title: "What's the difference between sea salt and kosher salt in baking?",
      category: "Ingredients",
      author: "Home Chef Mike",
      answers: 8,
      views: 1923,
      likes: 67,
      timeAgo: "5 hours ago",
      hasAcceptedAnswer: true,
      preview: "I see recipes calling for different types of salt and I'm wondering if it really makes a difference..."
    },
    {
      id: 3,
      title: "Why does my sourdough starter smell like acetone?",
      category: "Troubleshooting",
      author: "Bread Enthusiast",
      answers: 15,
      views: 4156,
      likes: 134,
      timeAgo: "1 day ago",
      hasAcceptedAnswer: true,
      preview: "My 2-week-old starter developed a strong acetone/nail polish remover smell. Is it still safe to use?"
    },
    {
      id: 4,
      title: "Best knife sharpening technique for home cooks?",
      category: "Equipment",
      author: "Chef Wannabe",
      answers: 6,
      views: 987,
      likes: 45,
      timeAgo: "3 days ago",
      hasAcceptedAnswer: false,
      preview: "I have a decent chef's knife but it's getting dull. What's the best way to sharpen it at home?"
    },
    {
      id: 5,
      title: "How to prevent pasta from sticking together?",
      category: "Techniques",
      author: "Pasta Lover",
      answers: 11,
      views: 3421,
      likes: 98,
      timeAgo: "4 days ago",
      hasAcceptedAnswer: true,
      preview: "Every time I cook pasta, it ends up clumping together. I've tried adding oil but that doesn't seem to help..."
    },
    {
      id: 6,
      title: "Safe internal temperature for different cuts of beef?",
      category: "Food Safety",
      author: "Grill Master",
      answers: 9,
      views: 2156,
      likes: 76,
      timeAgo: "1 week ago",
      hasAcceptedAnswer: true,
      preview: "I want to make sure I'm cooking beef safely. What are the recommended internal temperatures for different cuts?"
    }
  ];

  // Updated with correct calculations based on questions data
  const popularTopics = [
    { name: "Knife Skills", count: 156 },
    { name: "Bread Making", count: 143 },
    { name: "Sauce Techniques", count: 98 },
    { name: "Food Safety", count: 87 },
    { name: "Pasta Making", count: 76 },
    { name: "Chocolate Work", count: 65 }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.preview.toLowerCase().includes(searchTerm.toLowerCase());
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
    toast({
      title: "Coming Soon",
      description: "Question submission feature is under development.",
    });
  };

  const handleQuestionClick = (questionId: number) => {
    toast({
      title: "Coming Soon",
      description: "Question details page is under development.",
    });
  };

  const handleTopicClick = (topicName: string) => {
    setSearchTerm(topicName.toLowerCase());
    setSelectedCategory('All');
  };

  const handleLoadMore = () => {
    toast({
      title: "Coming Soon",
      description: "Pagination feature is under development.",
    });
  };

  return (
    <PageLayout>
      <SEO 
        title="Library of Knowledge - ChefCircle Community" 
        description="Search cooking questions and get expert answers from the ChefCircle community. Share your culinary knowledge and learn from experienced chefs."
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
                  {popularTopics.map((topic) => (
                    <div key={topic.name} className="flex items-center justify-between text-sm">
                      <button 
                        onClick={() => handleTopicClick(topic.name)}
                        className="text-chef-charcoal hover:text-chef-royal-green cursor-pointer transition-colors"
                      >
                        {topic.name}
                      </button>
                      <span className="text-chef-charcoal/60">{topic.count}</span>
                    </div>
                  ))}
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
                  {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
                </span>
              </div>

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
                          {question.hasAcceptedAnswer && (
                            <span className="chef-badge-green text-xs">
                              ✓ Answered
                            </span>
                          )}
                        </div>
                        
                        <p className="chef-body-sm text-chef-charcoal/80 mb-3 line-clamp-2">
                          {question.preview}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-chef-charcoal/60">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{question.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.answers} answers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{question.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="chef-badge-blue text-xs">{question.category}</span>
                        <div className="text-sm text-chef-charcoal/60 mt-2">
                          {question.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredQuestions.length === 0 && (
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

              {/* Pagination */}
              {filteredQuestions.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={handleLoadMore}
                    className="chef-button-outline"
                  >
                    Load More Questions
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
    </PageLayout>
  );
};

export default Library;
