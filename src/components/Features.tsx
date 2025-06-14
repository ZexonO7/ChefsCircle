
import { useEffect, useRef, useState } from 'react';
import { ChefHat, Users, BookOpen, Award, ArrowRight, Star, Clock, Trophy, MessageSquare, Utensils, Heart, Crown } from "lucide-react";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const culinaryFeatures = [
    {
      icon: <ChefHat className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Live Cook-Alongs",
      description: "Interactive sessions with renowned chefs, where you cook together in real-time, learning professional techniques and insider secrets.",
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
    },
    {
      icon: <BookOpen className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Master Classes",
      description: "Deep-dive courses covering advanced culinary techniques, from knife skills to molecular gastronomy and artisanal bread making.",
      image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
    },
    {
      icon: <Users className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Elite Community",
      description: "Connect with passionate food lovers, share your culinary creations, and get feedback from fellow members and professional chefs.",
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
    },
    {
      icon: <Crown className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Premium Content",
      description: "Exclusive recipes, seasonal menus, wine pairings, and access to chef-curated ingredient boxes delivered to your door.",
      image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-in');
            (entry.target as HTMLElement).style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      const elements = featuresRef.current.querySelectorAll('.feature-item');
      elements.forEach((el) => {
        if (!el.classList.contains('animate-slide-in')) {
          (el as HTMLElement).style.opacity = '0';
          observer.observe(el);
        }
      });
    }

    return () => observer.disconnect();
  }, []);

  const culinaryPrograms = [
    {
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
      title: "Teen Chef Mastery",
      description: "Specialized program for young culinary enthusiasts aged 16-19, covering fundamental techniques to advanced plating."
    },
    {
      image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png",
      title: "Millennial Kitchen",
      description: "Perfect for busy professionals who want to create restaurant-quality meals at home with efficient techniques."
    },
    {
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
      title: "Artisan Baking Club",
      description: "Master the art of bread making, pastries, and desserts with our specialized baking community and expert instructors."
    }
  ];

  const membershipBenefits = [
    {
      icon: <Star className="h-8 w-8 text-chef-gold" />,
      title: "VIP Access",
      description: "First access to new classes and exclusive chef events"
    },
    {
      icon: <Trophy className="h-8 w-8 text-chef-gold" />,
      title: "Skill Certification",
      description: "Earn recognized certificates for completed masterclasses"
    },
    {
      icon: <Heart className="h-8 w-8 text-chef-gold" />,
      title: "Personal Growth",
      description: "Track your culinary journey with personalized progress reports"
    },
    {
      icon: <Utensils className="h-8 w-8 text-chef-gold" />,
      title: "Premium Tools",
      description: "Access to exclusive recipe collections and meal planning tools"
    }
  ];

  return (
    <section id="features" className="relative bg-white overflow-hidden py-16 md:py-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8" ref={featuresRef}> 
        <div className="text-center mb-16 max-w-4xl mx-auto feature-item">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-gold/20 text-chef-gold rounded-full text-sm font-medium">
            <ChefHat className="w-4 h-4" />
            Culinary Excellence Programs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-charcoal font-playfair">
            Elevate Your Culinary Journey
          </h2>
          <p className="text-chef-charcoal/70 text-lg font-inter">
            Our comprehensive culinary education platform transforms passionate home cooks into confident chefs through expert instruction, community support, and hands-on learning experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {culinaryFeatures.map((feature, index) => (
            <div
              key={index}
              className="feature-item rounded-xl overflow-hidden transform transition-all duration-500 relative shadow-lg h-[320px] hover:-translate-y-1"
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-all duration-300 grayscale hover:grayscale-0"
                />
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  hoveredFeature === index ? "bg-chef-royal-green/60" : "bg-chef-charcoal/70"
                )}></div>
              </div>
              
              <div className="relative z-10 flex flex-col justify-between p-6 h-full">
                <div>
                  <div className={cn(
                    "inline-block p-3 bg-chef-gold/20 backdrop-blur-sm rounded-lg transition-all duration-300 transform mb-4",
                    hoveredFeature === index ? "hover:scale-110" : ""
                  )}>
                    <div className={`transform transition-transform duration-300 ${hoveredFeature === index ? 'rotate-12' : ''}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 font-playfair">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 font-inter">
                    {feature.description}
                  </p>
                </div>
                <div className={`h-0.5 bg-chef-gold mt-4 transition-all duration-500 ${hoveredFeature === index ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16 feature-item">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-sm font-medium">
              <Users className="w-4 h-4" />
              Specialized Programs
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-chef-charcoal font-playfair">
              Programs Tailored to Your Journey
            </h3>
            <p className="text-chef-charcoal/70 max-w-3xl mx-auto font-inter">
              Whether you're a teen culinary enthusiast or a busy professional, we have specialized programs designed to meet you where you are in your culinary journey.
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden bg-chef-warm-ivory p-6">
            <Carousel className="w-full max-w-7xl mx-auto">
              <CarouselContent className="flex">
                {culinaryPrograms.map((program, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 flex-shrink-0 bg-chef-cream">
                    <Card className="chef-card border-chef-gold/20">
                      <CardContent className="p-0">
                        <div className="w-full h-48">
                          <img
                            src={program.image}
                            alt={program.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 bg-chef-cream">
                          <h4 className="font-bold text-xl mb-3 text-chef-charcoal font-playfair">{program.title}</h4>
                          <p className="text-chef-charcoal/70 font-inter">{program.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className="chef-button-outline text-black bg-chef-cream" />
                <CarouselNext className="chef-button-outline bg-chef-cream" />
              </div>
            </Carousel>
          </div>
        </div>

        <div className="feature-item chef-gradient-blue rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-gold/20 text-chef-gold rounded-full text-sm font-medium">
              <Crown className="w-4 h-4" />
              Premium Culinary Experience
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-chef-warm-ivory font-playfair">
              Why Choose ChefCircle?
            </h3>
            <p className="text-chef-warm-ivory/90 max-w-2xl mx-auto font-inter">
              Join an exclusive community of culinary enthusiasts and gain access to world-class instruction, premium content, and invaluable networking opportunities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="bg-chef-warm-ivory rounded-xl p-6 text-center chef-hover-lift border border-chef-gold/10">
                <div className="bg-chef-gold/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-chef-charcoal font-playfair">{benefit.title}</h4>
                <p className="text-chef-charcoal/70 text-sm font-inter">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
