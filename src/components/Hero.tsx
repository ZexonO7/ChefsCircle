
import { ArrowRight, ChefHat, Users, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  const isMobile = useIsMobile();

  const containerVariants = {
    hidden: { opacity: 0 },
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="relative mt-16 md:mt-0 w-full max-w-[100vw]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="banner-container chef-gradient-blue relative overflow-hidden h-[700px] md:h-[750px] w-full">
        <div className="absolute inset-0 w-full">
          <img 
            src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
            alt="ChefCircle - Luxury Culinary Experience" 
            className={`w-full h-full object-cover opacity-40 ${isMobile ? 'object-right' : 'object-center'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-chef-charcoal/70 via-chef-royal-blue/60 to-chef-warm-ivory"></div>
        </div>
        
        <div className="banner-overlay bg-transparent pt-21 md:pt-24 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
            <motion.div className="w-full max-w-4xl text-center" variants={itemVariants}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-chef-gold/20 text-chef-gold px-4 py-2 rounded-full mb-6"
                variants={itemVariants}
              >
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Culinary Community</span>
              </motion.div>
              
              <motion.h1 
                className="banner-title text-chef-warm-ivory text-4xl md:text-6xl lg:text-7xl font-bold font-playfair"
                variants={itemVariants}
              >
                Join the Ultimate 
                <span className="block text-chef-gold">Culinary Community</span>
              </motion.h1>
              
              <motion.p 
                className="banner-subtitle text-chef-warm-ivory/90 mt-6 text-lg md:text-xl max-w-3xl mx-auto font-inter"
                variants={itemVariants}
              >
                Connect with passionate chefs, share recipes, learn from experts, and grow your culinary skills in our vibrant community of food enthusiasts.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
                variants={itemVariants}
              >
                <Link to="/clubs">
                  <button className="chef-button-primary flex items-center justify-center group text-lg">
                    Join Clubs
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button 
                  onClick={scrollToContact}
                  className="chef-button-secondary flex items-center justify-center group text-lg"
                >
                  Get Started
                  <ChefHat className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-chef-warm-ivory/80"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">15,000+ Active Members</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-chef-warm-ivory/40 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  <span className="text-sm">500+ Expert Chefs</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-chef-warm-ivory/40 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm">4.9/5 Rating</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
