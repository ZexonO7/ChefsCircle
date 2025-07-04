
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, ChefHat, Users, Award, Clock, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import SEO from '@/components/SEO';

const TechDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <PageLayout>
        <SEO 
          title="Exclusive Culinary Clubs - ChefsCircle" 
          description="Join specialized culinary communities within ChefsCircle, from pastry enthusiasts to molecular gastronomy experts."
          imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
          keywords={['culinary clubs', 'specialized cooking', 'culinary communities', 'expert groups', 'cooking specialties']}
        />
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/" className="inline-flex items-center text-chef-charcoal/60 hover:text-chef-charcoal mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="text-4xl font-bold mb-6 text-chef-charcoal font-playfair"
              >
                Exclusive Culinary Clubs
              </motion.h1>
              
              <div className="prose prose-lg max-w-none">
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="text-xl text-chef-charcoal/70 mb-12 font-inter"
                >
                  Join specialized culinary communities within ChefsCircle, where passionate food enthusiasts 
                  dive deep into specific cuisines, techniques, and culinary specialties.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Featured Culinary Clubs</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {[
                      {
                        icon: <ChefHat className="w-8 h-8 text-chef-royal-green" />,
                        title: "Pastry Masters",
                        description: "Dedicated to the art of pastry, desserts, and baking techniques.",
                        members: "450+ members",
                        specialty: "Pastry & Desserts"
                      },
                      {
                        icon: <Star className="w-8 h-8 text-chef-royal-blue" />,
                        title: "Molecular Gastronomy",
                        description: "Exploring modern techniques and scientific approaches to cooking.",
                        members: "280+ members",
                        specialty: "Modern Techniques"
                      },
                      {
                        icon: <Users className="w-8 h-8 text-chef-royal-green" />,
                        title: "Asian Cuisine Circle",
                        description: "Authentic techniques and recipes from across Asia.",
                        members: "620+ members",
                        specialty: "Asian Cuisine"
                      },
                      {
                        icon: <Award className="w-8 h-8 text-chef-royal-blue" />,
                        title: "Wine & Food Pairing",
                        description: "Master the art of matching wines with exceptional dishes.",
                        members: "390+ members",
                        specialty: "Wine Pairing"
                      },
                      {
                        icon: <BookOpen className="w-8 h-8 text-chef-royal-green" />,
                        title: "Plant-Based Innovators",
                        description: "Creative vegetarian and vegan cooking techniques.",
                        members: "510+ members",
                        specialty: "Plant-Based"
                      },
                      {
                        icon: <Clock className="w-8 h-8 text-chef-royal-blue" />,
                        title: "Fermentation Lab",
                        description: "Traditional and modern fermentation techniques.",
                        members: "340+ members",
                        specialty: "Fermentation"
                      }
                    ].map((club, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * i }}
                        className="chef-card p-6 chef-hover-lift"
                      >
                        <div className="mb-4">{club.icon}</div>
                        <h3 className="font-bold text-lg mb-2 text-chef-charcoal font-playfair">{club.title}</h3>
                        <p className="text-chef-charcoal/70 mb-3 text-sm font-inter">{club.description}</p>
                        <div className="flex justify-between items-center text-xs text-chef-charcoal/60">
                          <span className="font-medium">{club.members}</span>
                          <span className="px-2 py-1 bg-chef-royal-green/10 text-chef-royal-green rounded-full">
                            {club.specialty}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Club Benefits</h2>
                  <div className="chef-card p-8 border border-chef-royal-green/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-chef-charcoal font-playfair">What You Get</h3>
                        <ul className="space-y-2 text-chef-charcoal/70 font-inter">
                          <li>• Specialized masterclasses and workshops</li>
                          <li>• Access to expert guest chefs in your field</li>
                          <li>• Exclusive recipes and technique libraries</li>
                          <li>• Private forums and community discussions</li>
                          <li>• Priority booking for related events</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-chef-charcoal font-playfair">Community Features</h3>
                        <ul className="space-y-2 text-chef-charcoal/70 font-inter">
                          <li>• Member-only cook-alongs and challenges</li>
                          <li>• Peer mentorship and skill sharing</li>
                          <li>• Specialized equipment recommendations</li>
                          <li>• Industry connections and networking</li>
                          <li>• Club-specific certification programs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">How to Join</h2>
                  <div className="chef-card p-8 bg-chef-cream border border-chef-royal-blue/20">
                    <p className="text-chef-charcoal/70 mb-6 font-inter">
                      Club membership is included with your ChefsCircle subscription. Simply choose the clubs 
                      that align with your culinary interests and start participating immediately.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-chef-royal-green/20 flex items-center justify-center mx-auto mb-3">
                          <span className="text-chef-royal-green font-bold">1</span>
                        </div>
                        <h4 className="font-semibold mb-2 text-chef-charcoal font-playfair">Browse Clubs</h4>
                        <p className="text-sm text-chef-charcoal/70 font-inter">Explore our specialty clubs and find your passion</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-chef-royal-blue/20 flex items-center justify-center mx-auto mb-3">
                          <span className="text-chef-royal-blue font-bold">2</span>
                        </div>
                        <h4 className="font-semibold mb-2 text-chef-charcoal font-playfair">Join Instantly</h4>
                        <p className="text-sm text-chef-charcoal/70 font-inter">One-click joining with your existing membership</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-chef-royal-green/20 flex items-center justify-center mx-auto mb-3">
                          <span className="text-chef-royal-green font-bold">3</span>
                        </div>
                        <h4 className="font-semibold mb-2 text-chef-charcoal font-playfair">Start Learning</h4>
                        <p className="text-sm text-chef-charcoal/70 font-inter">Access exclusive content and connect with experts</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-16 pt-8 border-t border-chef-royal-green/20 text-center">
                <Link 
                  to="/development-process" 
                  className="chef-button-primary inline-flex items-center group"
                >
                  View Pricing Tiers
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default TechDetails;

const ArrowRight = ({ className = "w-4 h-4" }: { className?: string; }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
