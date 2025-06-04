import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Users, Award, Clock, ArrowRight, Star, Crown, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
const Projects = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const membershipTiers = [{
    name: "Apprentice Chef",
    price: "$29",
    period: "/month",
    description: "Perfect for culinary beginners ready to start their journey",
    features: ["2 live cook-alongs per month", "Access to basic technique library", "Community forum access", "Monthly recipe collection", "Email support"],
    icon: <ChefHat className="w-8 h-8" />,
    color: "chef-royal-green",
    image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
  }, {
    name: "Sous Chef",
    price: "$59",
    period: "/month",
    description: "For passionate home cooks ready to elevate their skills",
    features: ["4 live cook-alongs per month", "Advanced masterclass access", "1-on-1 chef consultations", "Premium recipe collections", "Ingredient box discounts", "Priority support"],
    icon: <Award className="w-8 h-8" />,
    color: "chef-royal-blue",
    popular: true,
    image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
  }, {
    name: "Executive Chef",
    price: "$99",
    period: "/month",
    description: "Ultimate culinary experience for serious food enthusiasts",
    features: ["Unlimited live cook-alongs", "Exclusive chef-led workshops", "Personal culinary coaching", "VIP event invitations", "Custom meal planning", "Premium ingredient boxes", "24/7 chef hotline"],
    icon: <Crown className="w-8 h-8" />,
    color: "chef-gold",
    image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
  }];
  const upcomingEvents = [{
    title: "Italian Pasta Mastery",
    chef: "Chef Marco Rossi",
    date: "Dec 15, 2024",
    time: "7:00 PM EST",
    spots: "12 spots left",
    image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png",
    level: "Intermediate"
  }, {
    title: "French Pastry Fundamentals",
    chef: "Chef Sophie Laurent",
    date: "Dec 18, 2024",
    time: "6:30 PM EST",
    spots: "8 spots left",
    image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
    level: "Beginner"
  }, {
    title: "Modern Plating Techniques",
    chef: "Chef Alexandra Chen",
    date: "Dec 22, 2024",
    time: "8:00 PM EST",
    spots: "5 spots left",
    image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png",
    level: "Advanced"
  }];
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="projects" className="py-16 md:py-24 bg-chef-warm-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Membership Tiers Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-gold/20 text-chef-gold rounded-full text-sm font-medium">
            <Crown className="w-4 h-4" />
            Membership Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-charcoal font-playfair">
            Choose Your Culinary Path
          </h2>
          <p className="text-chef-charcoal/70 text-lg max-w-3xl mx-auto font-inter">
            Whether you're just starting your culinary journey or looking to master advanced techniques, we have the perfect membership tier to match your ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {membershipTiers.map((tier, index) => <motion.div key={index} className={`relative ${tier.popular ? 'md:-translate-y-4' : ''}`} onHoverStart={() => setHoveredCard(index)} onHoverEnd={() => setHoveredCard(null)} whileHover={{
          scale: 1.02
        }} transition={{
          duration: 0.3
        }}>
              {tier.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-chef-gold text-chef-charcoal px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>}
              
              <Card className={`chef-card-luxury h-full overflow-hidden ${tier.popular ? 'border-chef-gold border-2' : ''}`}>
                <div className="relative h-48 overflow-hidden">
                  <img src={tier.image} alt={tier.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-chef-charcoal/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className={`p-2 rounded-lg bg-${tier.color}/20 backdrop-blur-sm mb-2 inline-block`}>
                      {tier.icon}
                    </div>
                    <h3 className="text-xl font-bold font-playfair">{tier.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-chef-charcoal font-playfair">{tier.price}</span>
                      <span className="text-chef-charcoal/70 ml-1">{tier.period}</span>
                    </div>
                    <p className="text-chef-charcoal/70 font-inter">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center text-chef-charcoal/80 font-inter">
                        <Star className="w-4 h-4 text-chef-gold mr-3 flex-shrink-0 fill-current" />
                        {feature}
                      </li>)}
                  </ul>

                  <Button onClick={scrollToContact} className={`w-full chef-button-${tier.color === 'chef-gold' ? 'gold' : tier.color === 'chef-royal-blue' ? 'secondary' : 'primary'}`}>
                    Start Cooking
                  </Button>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>

        {/* Upcoming Events Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Upcoming Cook-Alongs
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-chef-charcoal font-playfair">
            Join Our Next Culinary Adventures
          </h3>
          <p className="text-chef-charcoal/70 max-w-2xl mx-auto font-inter">
            Reserve your spot in our upcoming live cooking sessions and learn from world-class chefs in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event, index) => <Card key={index} className="chef-card chef-hover-lift overflow-hidden">
              <div className="relative h-48">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${event.level === 'Beginner' ? 'bg-chef-royal-green text-white' : event.level === 'Intermediate' ? 'bg-chef-royal-blue text-white' : 'bg-chef-gold text-chef-charcoal'}`}>
                    {event.level}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6 bg-[chef-warm-ivory] bg-chef-cream rounded-none">
                <h4 className="text-xl font-bold mb-2 text-chef-charcoal font-playfair">{event.title}</h4>
                <p className="text-chef-gold font-medium mb-3">{event.chef}</p>
                <div className="space-y-2 text-sm text-chef-charcoal/70 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-chef-royal-green font-medium">{event.spots}</span>
                  </div>
                </div>
                <Button onClick={scrollToContact} className="w-full chef-button-outline bg-[#141c70] text-chef-cream">
                  Reserve Spot
                </Button>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center">
          <Button onClick={scrollToContact} className="chef-button-gold inline-flex items-center group text-lg">
            Join ChefCircle Today
            <Utensils className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </section>;
};
export default Projects;