
import { ArrowRight, ChefHat, Users, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Custom animated gradient BG - Updated to Royal Blue and Cream White
const AnimatedGradient = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2 }}
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 2,
      background: "radial-gradient(ellipse at 60% 33%, rgba(249, 246, 241, 0.30), transparent 75%), radial-gradient(circle at 40% 60%, rgba(26, 58, 138, 0.45), transparent 80%)" // Cream and Lighter Blue
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
      <div className="banner-container min-h-[650px] md:min-h-[770px] w-full relative overflow-hidden flex items-center justify-center bg-chef-royal-blue"> {/* Main BG is Royal Blue */}
        {/* Hero Image, Blur, and Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/4d70a018-96e2-480a-9492-ccdb9dba7ce2.png"
            alt="ChefCircle - Luxury Culinary Experience"
            className={`w-full h-full object-cover mix-blend-overlay blur-sm ${isMobile ? 'object-left' : 'object-center'} select-none`}
            draggable={false}
            style={{ opacity: 0.30 }}
          />
          {/* Animated glassy white gradient blur overlay - Updated */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(36px)" }}
            animate={{ opacity: 0.70, filter: "blur(0px)" }}
            transition={{ delay: 0.6, duration: 1.4, type: "spring" }}
            className="absolute inset-0 bg-gradient-to-br from-chef-warm-ivory/50 via-chef-cream/40 to-chef-warm-ivory/10" // Cream/Ivory gradient
            style={{ zIndex: 1 }}
          />
          <AnimatedGradient />
        </div>

        {/* Main overlayed hero content */}
        <div className="relative z-10 w-full px-3 sm:px-7 flex items-center justify-center h-[650px] md:h-[700px]">
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-8">
            {/* Shimmery badge at top - Updated */}
            <motion.div
              className="inline-flex items-center gap-2 font-inter font-semibold tracking-wide px-5 py-2 rounded-2xl mb-5 border border-chef-warm-ivory/60 shadow-chef-blue-md" // Ivory border, Blue shadow
              style={{
                background: "linear-gradient(90deg, rgba(249, 246, 241, 0.15) 0%, rgba(249, 246, 241, 0.3) 100%)", // Subtle ivory gradient
                boxShadow: "0 0 16px 2px rgba(11, 31, 102, 0.2)" // Softer blue shadow
              }}
              variants={itemVariants}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            >
              <Star className="w-4 h-4 text-chef-warm-ivory" /> {/* Icon to Warm Ivory */}
              <motion.span
                className="text-[1rem]" // text-chef-gold removed, shimmer provides color
                variants={shimmerVariants}
                animate="animate"
                style={{
                  background: "linear-gradient(90deg, #FDF8F0 0%, #1A3A8A 40%, #FDF8F0 80%)", // Cream, Light Blue, Cream shimmer
                  backgroundSize: "240% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600
                }}
              >
                Culinary Community
              </motion.span>
            </motion.div>

            {/* Headline - Updated */}
            <motion.h1
              className="banner-title text-chef-warm-ivory text-4xl md:text-6xl lg:text-7xl font-bold font-playfair leading-tight relative" // Text to Warm Ivory
              style={{
                textShadow: "0 5px 22px rgba(0,0,0, 0.3), 0 2px 7px rgba(249, 246, 241, 0.15)" // Darker general shadow, Ivory highlight
              }}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Join the <span className="whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-chef-cream to-chef-warm-ivory pr-1">Ultimate Culinary Club</span> {/* Cream/Ivory gradient text */}
            </motion.h1>

            {/* Subheadline - Updated */}
            <motion.p
              className="banner-subtitle text-chef-charcoal font-inter font-medium mt-2 mb-1" // Text to Charcoal for readability on light bg
              style={{
                background: "rgba(249, 246, 241, 0.85)", // More opaque Ivory background
                borderRadius: "1.5rem",
                padding: '1.1rem 2.5rem',
                boxShadow: "0 6px 30px rgba(11, 31, 102, 0.15)" // Blue shadow
              }}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              Meet fellow Gen Z and Millennial foodies, share your best creations, and master recipes from chefs all over the world—in one <span className="rounded font-bold text-chef-royal-blue">luxurious</span>, tasty place. {/* Span text to Royal Blue */}
            </motion.p>

            {/* CTA buttons - Updated */}
            <motion.div
              className="flex flex-col sm:flex-row gap-5 mt-3 mb-2 justify-center items-center w-full"
              variants={itemVariants}
            >
              <Link to="/clubs" style={{ textDecoration: "none" }}>
                <button className="chef-button-primary flex items-center justify-center gap-2 text-lg rounded-xl px-8 py-4 font-semibold font-inter transition-all duration-300 shadow-chef-blue-lg hover:scale-105 focus-visible:outline-chef-royal-blue border-[1.2px] border-chef-warm-ivory/50"> {/* Uses updated chef-button-primary, added ivory border, blue shadow */}
                  Join Clubs
                  <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                onClick={scrollToContact}
                className="flex items-center justify-center group text-lg font-semibold font-inter bg-chef-warm-ivory/90 backdrop-sepia-0 px-8 py-4 rounded-xl text-chef-royal-blue border border-chef-royal-blue/40 shadow-chef-blue-md hover:shadow-chef-blue-lg duration-200 hover:scale-105 active:scale-95" // Ivory bg, Royal Blue text, Blue border & shadows
                style={{
                  // boxShadow values handled by tailwind classes above
                }}
              >
                Get Started
                <ChefHat className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform text-chef-royal-blue" /> {/* Icon to Royal Blue */}
              </button>
            </motion.div>

            {/* Social Proof - Updated */}
            <motion.div
              className="flex flex-row flex-wrap justify-center gap-8 mt-2 text-chef-warm-ivory/90 z-30" // Text to Warm Ivory
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 px-5 py-1 bg-chef-warm-ivory/20 rounded-full shadow-chef-blue-md font-medium backdrop-blur-sm"> {/* Light Ivory bg on blue, Blue shadow */}
                <Users className="w-5 h-5" />
                <span className="text-base">100+ Active Members</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-1 bg-chef-warm-ivory/20 rounded-full shadow-chef-blue-md font-medium backdrop-blur-sm">
                <ChefHat className="w-5 h-5" />
                <span className="text-base">10+ Pro Chefs</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-1 bg-chef-warm-ivory/20 rounded-full shadow-chef-blue-md font-medium backdrop-blur-sm">
                <Star className="w-5 h-5 text-chef-warm-ivory" /> {/* Star to Warm Ivory to stand out on its badge */}
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

