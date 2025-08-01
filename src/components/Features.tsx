import { motion } from 'framer-motion';
import { Users, BookOpen, Trophy, Star, Play, Crown, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Features = () => {
  const navigate = useNavigate();
  
  const handleCulinaryJourneyClick = () => {
    navigate('/culinary-journey');
  };
  const features = [{
    icon: <Play className="w-8 h-8" />,
    title: "Live news",
    description: "Join world-class chefs in real-time cooking sessions. Learn techniques, ask questions, and cook alongside culinary masters from your own kitchen.",
    stats: "3x weekly sessions"
  }, {
    icon: <Crown className="w-8 h-8" />,
    title: "Master Classes",
    description: "Access exclusive video masterclasses covering advanced techniques, cuisines from around the world, and professional secrets from Michelin-starred chefs.",
    stats: "50+ premium courses"
  }, {
    icon: <Users className="w-8 h-8" />,
    title: "Elite Community",
    description: "Connect with passionate home cooks and culinary enthusiasts. Share your creations, get feedback, and participate in monthly challenges.",
    stats: "1000+ active members"
  }, {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Premium Content",
    description: "Get access to exclusive recipes, technique guides, ingredient spotlights, and behind-the-scenes content from top culinary destinations.",
    stats: "New content weekly"
  }];
  return <section id="features" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-chef-cream">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-xs sm:text-sm font-medium">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
            Premium Features
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-chef-charcoal font-playfair">
            The Future of Culinary Education
          </h2>
          <p className="text-chef-charcoal/70 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-inter mb-3 sm:mb-4 px-2">
            Experience a revolutionary approach to learning cooking through our interactive platform designed for the modern home chef.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-chef-charcoal/60">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>50+ Active members</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-chef-charcoal/20 rounded-full"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>5+ courses</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }}>
              <Card className="chef-card h-full group hover:shadow-xl transition-all duration-300 bg-chef-cream">
                <CardContent className="p-4 sm:p-6 md:p-8 text-center bg-chef-cream">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 bg-chef-royal-green/10 rounded-full flex items-center justify-center text-chef-royal-green group-hover:bg-chef-royal-green group-hover:text-white transition-all duration-300">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4 text-chef-charcoal font-playfair">
                    {feature.title}
                  </h3>
                  <p className="text-chef-charcoal/70 mb-3 sm:mb-4 font-inter leading-relaxed text-xs sm:text-sm md:text-base">
                    {feature.description}
                  </p>
                  <div className="text-xs sm:text-sm font-medium text-chef-royal-green">
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>

        <div className="text-center">
          <Button onClick={handleCulinaryJourneyClick} className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-chef-royal-green text-chef-warm-ivory hover:bg-chef-forest font-medium rounded-xl transition-all duration-300 text-sm sm:text-base">
            Start Your Culinary Journey
          </Button>
        </div>
      </div>
    </section>;
};
export default Features;