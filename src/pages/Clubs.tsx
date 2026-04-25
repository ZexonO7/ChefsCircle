import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Users, MessageCircle, Crown, Star, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Reveal from '@/components/motion/Reveal';
import Parallax from '@/components/motion/Parallax';
import TextReveal from '@/components/motion/TextReveal';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningClub, setJoiningClub] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Updated with realistic and consistent member counts
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join clubs.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
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

  const handleCreateClub = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a club.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: "Club creation feature is under development.",
    });
  };

  return (
    <PageLayout>
      <SEO 
        title="Culinary Clubs - ChefsCircle Community" 
        description="Join exclusive culinary clubs and connect with passionate chefs from around the world. Share techniques, recipes, and culinary experiences."
        keywords={['culinary clubs', 'cooking community', 'chef forums', 'culinary discussion', 'cooking groups']}
      />
      
      <div className="min-h-screen bg-background pt-20">
        {/* Hero Section — premium charcoal with parallax + gold accent */}
        <section className="relative overflow-hidden grain py-24 md:py-32" style={{ background: 'var(--gradient-charcoal)' }}>
          <Parallax speed={-0.3} className="absolute inset-0 opacity-[0.18]">
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=2128&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </Parallax>
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--gradient-gold)' }}
          />

          <div className="relative chef-container">
            <div className="text-center max-w-3xl mx-auto">
              <Reveal>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.25em] text-background/70 border border-background/15 mb-6">
                  <Crown className="w-3 h-3 text-accent" /> Exclusive Communities
                </span>
              </Reveal>

              <h1 className="font-playfair text-5xl md:text-7xl font-semibold leading-[1.05] text-background mb-6">
                <TextReveal text="Join culinary" />
                <span className="block text-gold-gradient">
                  <TextReveal text="circles." delay={0.2} />
                </span>
              </h1>

              <Reveal delay={0.3}>
                <p className="text-lg md:text-xl text-background/70 mb-10 leading-relaxed font-light">
                  Connect with passionate chefs, share techniques, and grow your craft inside intimate, curated communities.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-background/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background/8 border border-background/15 text-background placeholder-background/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 backdrop-blur-md transition-all"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Clubs Grid */}
        <section className="py-20 md:py-28">
          <div className="chef-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredClubs.map((club, index) => (
                <Reveal key={club.id} delay={index * 0.06}>
                  <motion.div
                    className="premium-card overflow-hidden group cursor-pointer h-full flex flex-col"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={club.image}
                        alt={club.name}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {club.isPopular && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-background/90 backdrop-blur text-foreground">
                            <Star className="w-3 h-3 fill-current text-accent" />
                            Popular
                          </span>
                        )}
                        {club.isPremium && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-accent/95 text-accent-foreground">
                            <Crown className="w-3 h-3 fill-current" />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-playfair text-xl font-semibold text-foreground">{club.name}</h3>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{club.difficulty}</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1">
                        {club.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border/60">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-medium">{club.members.toLocaleString()}</span>
                          </div>
                          <span className="text-muted-foreground/50">·</span>
                          <span>{club.category}</span>
                        </div>

                        <button
                          onClick={() => handleJoinClub(club.name)}
                          disabled={joiningClub === club.name}
                          className="btn-glow inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                          {joiningClub === club.name ? 'Joining...' : 'Join'}
                          {joiningClub !== club.name && (
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {filteredClubs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No clubs found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* Create Club CTA */}
        <section className="py-24 bg-secondary/40">
          <div className="chef-container">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
                  Want to start your own <span className="text-gold-gradient">circle?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-light">
                  Have a unique culinary perspective? Lead a community of passionate chefs and shape the conversation.
                </p>
                <button
                  onClick={handleCreateClub}
                  className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-elevated"
                >
                  <MessageCircle className="w-4 h-4" />
                  Create new club
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Clubs;
