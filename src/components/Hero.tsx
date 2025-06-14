
import { ArrowRight, ChefHat, Users, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Custom animated gradient BG
const AnimatedGradient = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 2,
      background: "radial-gradient(ellipse at 60% 33%, #C2A83E55, transparent 75%), radial-gradient(circle at 40% 60%, #036B3580, transparent 80%)"
    }}
  />
);

const shimmerVariants = {
  animate: {
    backgroundPosition: ["-200% 0", "200% 0"],
    transition: {
      repeat: Infinity,
      duration: 2.1,
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
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
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
      {/* Animated BG with luxurious overlays */}
      <div className="banner-container min-h-[650px] md:min-h-[770px] w-full relative overflow-hidden flex items-center justify-center bg-chef-royal-blue">
        {/* Hero Image, Blur, and Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/4d70a018-96e2-480a-9492-ccdb9dba7ce2.png"
            alt="ChefCircle - Luxury Culinary Experience"
            className={`w-full h-full object-cover mix-blend-overlay blur-sm ${isMobile ? 'object-left' : 'object-center'} select-none`}
            draggable={false}
            style={{ opacity: 0.30 }}
          />
          {/* Animated glassy white gradient blur overlay */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(36px)" }}
            animate={{ opacity: 0.70, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1.4, type: "spring" }}
            className="absolute inset-0 bg-gradient-to-br from-chef-warm-ivory/60 via-white/60 to-chef-gold/20"
            style={{ zIndex: 1 }}
          />
          <AnimatedGradient />
        </div>

        {/* Main overlayed hero content */}
        <div className="relative z-10 w-full px-3 sm:px-7 flex items-center justify-center h-[650px] md:h-[700px]">
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-8">
            {/* Shimmery badge at top */}
            <motion.div
              className="inline-flex items-center gap-2 font-inter font-semibold tracking-wide px-5 py-2 rounded-2xl mb-5 border border-chef-gold/70 shadow-chef-gold"
              style={{
                background: "linear-gradient(90deg, #C2A83E22 0%, #FDF8F055 100%)",
                boxShadow: "0 0 16px 2px #C2A83E33"
              }}
              variants={itemVariants}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            >
              <Star className="w-4 h-4 text-chef-gold" />
              <motion.span
                className="text-chef-gold text-[1rem]"
                variants={shimmerVariants}
                animate="animate"
                style={{
                  background: "linear-gradient(90deg, #F9F6F1 0%, #C2A83E 30%, #F9F6F1 60%)",
                  backgroundSize: "240% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600
                }}
              >
                Culinary Community
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="banner-title text-chef-charcoal text-4xl md:text-6xl lg:text-7xl font-bold font-playfair leading-tight relative"
              style={{
                textShadow: "0 5px 22px #0B1F66AA, 0 2px 7px #C2A83E33"
              }}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Join the <span className="whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-chef-gold to-chef-royal-blue pr-1">Ultimate Culinary Club</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="banner-subtitle text-chef-royal-blue/90 font-inter font-medium mt-2 mb-1"
              style={{
                background: "rgba(255,255,255,0.31)",
                borderRadius: "1.5rem",
                padding: '1.1rem 2.5rem',
                boxShadow: "0 6px 60px #C2A83E22"
              }}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Meet fellow Gen Z and Millennial foodies, share your best creations, and master recipes from chefs all over the world—in one <span className="rounded font-semibold text-chef-gold">luxurious</span>, tasty place.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-5 mt-3 mb-2 justify-center items-center w-full"
              variants={itemVariants}
            >
              <Link to="/clubs" style={{ textDecoration: "none" }}>
                <button className="chef-button-primary flex items-center justify-center gap-2 text-lg rounded-xl px-8 py-4 font-semibold font-inter transition-all duration-300 shadow-chef-luxury hover:scale-105 focus-visible:outline-chef-gold border-[1.2px] border-chef-gold hover:shadow-chef-gold">
                  Join Clubs
                  <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center group text-lg font-semibold font-inter bg-white/80 backdrop-sepia-0 px-8 py-4 rounded-xl text-chef-royal-blue border border-chef-gold/50 shadow-md shadow-chef-gold/10 hover:shadow-chef-gold duration-200 hover:scale-105 active:scale-95"
                style={{
                  boxShadow: '0 4px 18px 0 #C2A83E33, 0 1.5px 4px 0 #0144211a'
                }}
              >
                Get Started
                <ChefHat className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform text-chef-gold" />
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex flex-row flex-wrap justify-center gap-8 mt-2 text-chef-charcoal/80 z-30"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 px-5 py-1 bg-white/60 rounded-full shadow shadow-chef-luxury font-medium">
                <Users className="w-5 h-5" />
                <span className="text-base">100+ Active Members</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-1 bg-white/60 rounded-full shadow shadow-chef-luxury font-medium">
                <ChefHat className="w-5 h-5" />
                <span className="text-base">10+ Pro Chefs</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-1 bg-white/60 rounded-full shadow shadow-chef-luxury font-medium">
                <Star className="w-5 h-5 text-chef-gold" />
                <span className="text-base">4.9/5 Reviews</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
