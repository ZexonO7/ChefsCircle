
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Users, MessageCircle, Crown, Star, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningClub, setJoiningClub] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const clubs = [
    {
      id: 1,
      name: "Michelin Masters",
      description: "For aspiring chefs who dream of earning Michelin stars. Share techniques, critique dishes, and learn from the best.",
      members: 2847,
      category: "Professional",
      difficulty: "Expert",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
      isPopular: true,
      isPremium: true
    },
    {
      id: 2,
      name: "Plant-Based Pioneers",
      description: "Innovative vegetarian and vegan cooking community. Discover new ingredients and sustainable cooking practices.",
      members: 1923,
      category: "Dietary",
      difficulty: "Intermediate",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      isPopular: true,
      isPremium: false
    },
    {
      id: 3,
      name: "Baking Brotherhood",
      description: "From sourdough starters to wedding cakes. Perfect your baking skills with fellow bread and pastry enthusiasts.",
      members: 3291,
      category: "Baking",
      difficulty: "All Levels",
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      isPopular: true,
      isPremium: false
    },
    {
      id: 4,
      name: "Street Food Society",
      description: "Authentic street food recipes from around the world. Learn to recreate market favorites at home.",
      members: 1576,
      category: "International",
      difficulty: "Beginner",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      isPopular: false,
      isPremium: false
    },
    {
      id: 5,
      name: "Molecular Gastronomy Lab",
      description: "Experimental cooking techniques and molecular gastronomy. Push the boundaries of culinary science.",
      members: 892,
      category: "Innovation",
      difficulty: "Expert",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1081&q=80",
      isPopular: false,
      isPremium: true
    },
    {
      id: 6,
      name: "Weekend Warriors",
      description: "For busy professionals who love to cook on weekends. Quick tips, meal prep, and stress-free cooking.",
      members: 2156,
      category: "Lifestyle",
      difficulty: "All Levels",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      isPopular: false,
      isPremium: false
    }
  ];

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinClub = async (clubName: string) => {
    if (!user) return;
    
    setJoiningClub(clubName);
    
    try {
      const { error } = await supabase
        .from('club_memberships')
        .insert({
          user_id: user.id,
          club_name: clubName
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already a member!",
            description: `You're already a member of ${clubName}.`,
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the club!",
          description: `You've successfully joined ${clubName}.`,
        });
      }
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast({
        title: "Error joining club",
        description: error.message || "There was an error joining the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningClub(null);
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Culinary Clubs - ChefCircle Community" 
        description="Join exclusive culinary clubs and connect with passionate chefs from around the world. Share techniques, recipes, and culinary experiences."
        keywords={['culinary clubs', 'cooking community', 'chef forums', 'culinary discussion', 'cooking groups']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Hero Section */}
        <section className="chef-section bg-gradient-to-br from-chef-royal-blue to-chef-navy">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
                Join Culinary <span className="text-chef-gold">Clubs</span>
              </h1>
              <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
                Connect with passionate chefs, share techniques, and grow your culinary skills in specialized communities
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-chef-royal-blue/20 focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="chef-section">
          <div className="chef-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  className="chef-card-luxury group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img 
                      src={club.image} 
                      alt={club.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {club.isPopular && (
                        <span className="chef-badge-green">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </span>
                      )}
                      {club.isPremium && (
                        <span className="chef-badge bg-chef-gold/20 text-chef-gold border-chef-gold/30">
                          <Crown className="w-3 h-3 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="chef-heading-sm text-chef-charcoal">{club.name}</h3>
                      <span className="text-sm text-chef-charcoal/60 font-inter">{club.difficulty}</span>
                    </div>
                    
                    <p className="chef-body-sm text-chef-charcoal/80 mb-4 line-clamp-3">
                      {club.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-chef-charcoal/60">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{club.members.toLocaleString()}</span>
                        </div>
                        <span className="chef-badge-blue">{club.category}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleJoinClub(club.name)}
                        disabled={joiningClub === club.name}
                        className="chef-button-primary text-sm py-2 px-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joiningClub === club.name ? 'Joining...' : 'Join Club'}
                        {joiningClub !== club.name && (
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredClubs.length === 0 && (
              <div className="text-center py-12">
                <p className="chef-body text-chef-charcoal/60">No clubs found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* Create Club CTA */}
        <section className="chef-section bg-chef-royal-green/5">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="chef-heading-lg text-chef-charcoal mb-6">
                Want to Start Your Own Club?
              </h2>
              <p className="chef-body text-chef-charcoal/80 mb-8">
                Have a unique culinary perspective or specialty? Create your own club and lead a community of passionate chefs.
              </p>
              <button className="chef-button-primary">
                <MessageCircle className="w-5 h-5 mr-2" />
                Create New Club
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Clubs;
