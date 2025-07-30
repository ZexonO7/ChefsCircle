
import { ArrowRight, ChefHat, Users, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
const Hero = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <motion.div className="relative mt-16 md:mt-0 w-full max-w-[100vw]" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="banner-container chef-gradient-blue relative overflow-hidden h-[500px] sm:h-[600px] md:h-[700px] lg:h-[750px] w-full">
        <div className="absolute inset-0 w-full">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop" 
            alt="Culinary Community - Diverse people cooking together" 
            className={`w-full h-full object-cover opacity-40 ${isMobile ? 'object-right' : 'object-center'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-chef-charcoal/70 via-chef-royal-blue/60 to-chef-warm-ivory"></div>
        </div>
        
        <div className="banner-overlay bg-transparent pt-16 sm:pt-20 md:pt-24 w-full">
          <div className="w-full mx-auto px-3 sm:px-4 lg:px-8 flex flex-col items-center justify-center h-full">
            <motion.div className="w-full max-w-4xl text-center" variants={itemVariants}>
              <motion.div className="inline-flex items-center gap-1.5 sm:gap-2 bg-chef-gold/20 text-chef-gold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6" variants={itemVariants}>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <span className="text-xs sm:text-sm font-medium">Culinary Community</span>
              </motion.div>
              
              <motion.h1 className="banner-title text-chef-warm-ivory text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-playfair leading-tight" variants={itemVariants}>
                Join the Ultimate 
                <span className="block text-chef-gold">Culinary Community</span>
              </motion.h1>
              
              <motion.p className="banner-subtitle text-chef-warm-ivory/90 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-inter px-2" variants={itemVariants}>
                Connect with passionate chefs, share recipes, learn from experts, and grow your culinary skills in our vibrant community of food enthusiasts.
              </motion.p>
              
              <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center px-4" variants={itemVariants}>
                <Link to={user ? "/clubs" : "/culinary-journey"}>
                  <button className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-chef-royal-green text-chef-warm-ivory hover:bg-chef-forest font-medium rounded-xl transition-all duration-300 flex items-center justify-center group text-sm sm:text-base">
                    {user ? "Join Clubs" : "Start your culinary journey"}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                {!user && (
                  <button onClick={scrollToContact} className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-chef-warm-ivory text-chef-warm-ivory hover:bg-chef-warm-ivory hover:text-chef-charcoal font-medium rounded-xl transition-all duration-300 flex items-center justify-center group text-sm sm:text-base">
                    Get Started
                    <ChefHat className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </motion.div>
              
              <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-chef-warm-ivory/80 px-4" variants={itemVariants}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">100+ Active Members</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-chef-warm-ivory/40 rounded-full"></div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">10+ Expert Chefs</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-chef-warm-ivory/40 rounded-full"></div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  <span className="text-xs sm:text-sm">4.9/5 Rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>;
};
export default Hero;
