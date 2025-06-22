
import { motion } from 'framer-motion';
import { Users, BookOpen, Trophy, Star, Play, Crown, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Features = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Live Cook-Alongs",
      description: "Join world-class chefs in real-time cooking sessions. Learn techniques, ask questions, and cook alongside culinary masters from your own kitchen.",
      stats: "3x weekly sessions"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Master Classes",
      description: "Access exclusive video masterclasses covering advanced techniques, cuisines from around the world, and professional secrets from Michelin-starred chefs.",
      stats: "50+ premium courses"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Elite Community",
      description: "Connect with passionate home cooks and culinary enthusiasts. Share your creations, get feedback, and participate in monthly challenges.",
      stats: "1000+ active members"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium Content",
      description: "Get access to exclusive recipes, technique guides, ingredient spotlights, and behind-the-scenes content from top culinary destinations.",
      stats: "New content weekly"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-chef-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-sm font-medium">
            <Trophy className="w-4 h-4" />
            Premium Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-charcoal font-playfair">
            The Future of Culinary Education
          </h2>
          <p className="text-chef-charcoal/70 text-lg max-w-3xl mx-auto font-inter mb-4">
            Experience a revolutionary approach to learning cooking through our interactive platform designed for the modern home chef.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-chef-charcoal/60">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1000+ Active members</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>50+ courses</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="chef-card h-full group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-chef-royal-green/10 rounded-full flex items-center justify-center text-chef-royal-green group-hover:bg-chef-royal-green group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-chef-charcoal font-playfair">
                    {feature.title}
                  </h3>
                  <p className="text-chef-charcoal/70 mb-4 font-inter leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-chef-royal-green">
                    {feature.stats}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={scrollToContact}
            className="chef-button-primary text-lg px-8 py-4"
          >
            Start Your Culinary Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
