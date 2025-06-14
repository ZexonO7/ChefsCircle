
import { ArrowRight, ChefHat, Users, Star, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Custom animated gradient BG - Updated for warmer, more sophisticated feel
const AnimatedGradient = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, delay: 0.2 }}
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 2,
      // Softer, warmer radial gradients with muted terracotta tones
      background: "radial-gradient(ellipse at 60% 33%, hsl(var(--chef-warm-beige) / 0.25), transparent 70%), radial-gradient(circle at 40% 60%, hsl(var(--chef-blue-light) / 0.30), transparent 75%), radial-gradient(ellipse at 70% 70%, hsl(var(--chef-terracotta) / 0.12), transparent 60%)"
    }}
  />
);

const shimmerVariants = {
  animate: {
    backgroundPosition: ["-200% 0", "200% 0"],
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "linear"
    }
  },
};

const Hero = () => {
  const isMobile = useIsMobile();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.3,
        duration: 0.9
      }
    }
  };
  const itemVariants = {
    hidden: { y: 28, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, type: "spring", stiffness: 80 } }
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
      className="relative mt-12 md:mt-0 w-full max-w-[100vw] z-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="banner-container min-h-[680px] md:min-h-[790px] w-full relative overflow-hidden flex items-center justify-center bg-chef-royal-blue">
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/4d70a018-96e2-480a-9492-ccdb9dba7ce2.png"
            alt="ChefCircle - Luxury Culinary Experience"
            className={`w-full h-full object-cover mix-blend-soft-light blur-sm ${isMobile ? 'object-left' : 'object-center'} select-none`}
            draggable={false}
            style={{ opacity: 0.45 }}
          />
          <motion.div
            initial={{ opacity: 0, filter: "blur(30px)" }}
            animate={{ opacity: 0.80, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1.6, type: "spring" }}
            className="absolute inset-0 bg-gradient-to-br from-chef-warm-sand/40 via-chef-warm-beige/30 to-chef-warm-sand/20"
            style={{ zIndex: 1 }}
          />
          <AnimatedGradient />
        </div>

        <div className="relative z-10 w-full px-3 sm:px-7 flex items-center justify-center h-[680px] md:h-[720px]">
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-8">
            <motion.div
              className="inline-flex items-center gap-2.5 font-space font-semibold tracking-normal px-6 py-2.5 rounded-2xl mb-4 border border-chef-terracotta/40 shadow-chef-warm"
              style={{
                background: "linear-gradient(95deg, hsl(var(--chef-warm-beige) / 0.15) 0%, hsl(var(--chef-terracotta) / 0.15) 100%)",
                backdropFilter: "blur(8px)",
              }}
              variants={itemVariants}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
            >
              <Sparkles className="w-4 h-4 text-chef-terracotta" />
              <motion.span
                className="text-[1rem]"
                variants={shimmerVariants}
                animate="animate"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--chef-warm-sand)) 0%, hsl(var(--chef-terracotta)) 40%, hsl(var(--chef-warm-sand)) 80%)",
                  backgroundSize: "260% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600
                }}
              >
                Exclusive Culinary Hub
              </motion.span>
            </motion.div>

            <motion.h1
              className="banner-title text-chef-warm-ivory text-4xl md:text-6xl lg:text-7xl font-bold font-playfair leading-tight relative"
              style={{
                textShadow: "0 4px 20px rgba(0,0,0, 0.35), 0 2px 8px hsl(var(--chef-warm-beige) / 0.2)"
              }}
              variants={itemVariants}
            >
              Ignite Your Passion: <span className="whitespace-nowrap bg-clip-text text-transparent bg-hero-text-gradient pr-1">The Ultimate Foodie Club</span>
            </motion.h1>

            <motion.p
              className="banner-subtitle text-chef-charcoal font-inter font-medium mt-1 mb-0 text-lg"
              style={{
                background: "hsl(var(--chef-warm-sand) / 0.92)",
                borderRadius: "1.25rem",
                padding: '1.2rem 2.6rem',
                boxShadow: "0 8px 35px rgba(11, 31, 102, 0.12), 0 0 15px hsl(var(--chef-terracotta)/0.1) inset"
              }}
              variants={itemVariants}
            >
              Connect with vibrant Gen Z & Millennial food lovers, showcase your culinary art, and learn from global chefs—all in one <span className="font-bold text-chef-royal-blue drop-shadow-[0_1px_1px_hsl(var(--chef-terracotta)/0.3)]">inspiring</span> community.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 mt-4 mb-1 justify-center items-center w-full"
              variants={itemVariants}
            >
              <Link to="/clubs" style={{ textDecoration: "none" }}>
                <button className="chef-button-primary flex items-center justify-center gap-2.5 text-lg rounded-xl px-9 py-4 font-semibold font-inter transition-all duration-300 shadow-chef-blue-lg hover:scale-105 focus-visible:outline-chef-royal-blue border-[1.5px] border-chef-terracotta/30 hover:border-chef-terracotta/50">
                  Explore Clubs
                  <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center group text-lg font-semibold font-inter bg-chef-warm-sand/95 backdrop-blur-sm px-9 py-4 rounded-xl text-chef-royal-blue border border-chef-royal-blue/30 hover:border-chef-terracotta/50 shadow-chef-blue-md hover:shadow-chef-warm duration-300 hover:scale-105 active:scale-95"
              >
                Get Started
                <ChefHat className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform text-chef-royal-blue group-hover:text-chef-terracotta" />
              </button>
            </motion.div>

            <motion.div
              className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 mt-3 text-chef-warm-ivory/95 z-30"
              variants={itemVariants}
            >
              {[
                { icon: Users, text: "100+ Active Members" },
                { icon: ChefHat, text: "15+ Pro Chefs" },
                { icon: Star, text: "4.9/5 Stellar Reviews", starColor: "text-chef-terracotta" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 px-5 py-2 bg-chef-warm-sand/15 hover:bg-chef-warm-beige/20 rounded-full shadow-chef-blue-md font-medium backdrop-blur-sm transition-colors duration-200 cursor-default">
                  <item.icon className={`w-5 h-5 ${item.starColor || ''}`} />
                  <span className="text-base font-space tracking-tight">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;

