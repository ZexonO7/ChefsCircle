
import { useEffect, useRef } from 'react';
import { ChefHat, Users, BookOpen, Crown } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import FeatureCard from './features/FeatureCard';
import ProgramsCarousel from './features/ProgramsCarousel';

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const culinaryFeatures = [
    {
      icon: <ChefHat className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Live Cook-Alongs",
      description: "Interactive sessions with renowned chefs, where you cook together in real-time, learning professional techniques and insider secrets.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
    },
    {
      icon: <BookOpen className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Master Classes",
      description: "Deep-dive courses covering advanced culinary techniques, from knife skills to molecular gastronomy and artisanal bread making.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
    },
    {
      icon: <Users className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Elite Community",
      description: "Connect with passionate food lovers, share your culinary creations, and get feedback from fellow members and professional chefs.",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&h=400&fit=crop"
    },
    {
      icon: <Crown className="w-10 h-10 text-white transition-transform duration-300 transform" />,
      title: "Premium Content",
      description: "Exclusive recipes, seasonal menus, wine pairings, and access to chef-curated ingredient boxes delivered to your door.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
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
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              index={index}
            />
          ))}
        </div>

        <ProgramsCarousel />
      </div>
    </section>
  );
};

export default Features;
