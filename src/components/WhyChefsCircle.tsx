import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChefHat, Users, BookOpen, Star, Clock4, Trophy, Sparkles, ArrowRight, Award, Target, Shield, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, {
    once: true,
    margin: "-100px"
  });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;

    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * end;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(startAnimation);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);

  return (
    <span ref={countRef} className="font-bold tabular-nums">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

const WhyChefCircle = () => {
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

  return (
    <section id="why-chefscircle" className="relative py-8 sm:py-12 md:py-16 lg:py-24 bg-chef-warm-ivory overflow-hidden">
      <div className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-xs sm:text-sm font-medium">
            <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />
            Why Choose ChefsCircle
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-chef-charcoal mb-4 sm:mb-6 font-playfair">
            The Future of Culinary Education
          </motion.h2>
          <motion.p variants={itemVariants} className="text-chef-charcoal/70 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-inter px-2">
            In a world where cooking shows inspire but don't truly teach, ChefsCircle bridges the gap between passion and mastery through personalized, interactive culinary education.
          </motion.p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 text-center chef-hover-lift">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-chef-royal-blue/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-blue" />
            </div>
            <h3 className="text-chef-charcoal text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-playfair">
              Growing
            </h3>
            <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">Community of passionate cooks learning and growing together</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 text-center chef-hover-lift">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-chef-royal-green/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-green" />
            </div>
            <h3 className="text-chef-charcoal text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-playfair">
              Expert-Led
            </h3>
            <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">
              Master classes and cook-alongs designed by culinary professionals
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 text-center chef-hover-lift sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-chef-royal-blue/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-blue" />
            </div>
            <h3 className="text-chef-charcoal text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-playfair">
              Quality First
            </h3>
            <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">
              Committed to delivering high-quality culinary education programs
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="mb-8 sm:mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-chef-royal-blue/20 text-chef-royal-blue rounded-full text-xs sm:text-sm font-medium">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              What ChefsCircle Offers You
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-chef-charcoal mb-3 sm:mb-4 font-playfair">
              Transform Your Passion Into Mastery
            </h3>
            <p className="text-chef-charcoal/70 max-w-3xl mx-auto font-inter text-sm sm:text-base px-2">
              We provide the structured learning, expert guidance, and supportive community that home cooks need to become confident chefs.
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 chef-hover-lift">
              <div className="flex items-start flex-col sm:flex-row">
                <div className="bg-chef-royal-green/20 rounded-full p-3 sm:p-4 mb-3 sm:mb-0 sm:mr-4 md:mr-6 mx-auto sm:mx-0">
                  <ChefHat className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-green" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-chef-charcoal mb-2 sm:mb-3 font-playfair">Expert-Led Instruction</h4>
                  <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">Learn from renowned chefs and culinary experts who share their secrets, techniques, and professional insights in every session.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 chef-hover-lift">
              <div className="flex items-start flex-col sm:flex-row">
                <div className="bg-chef-royal-blue/20 rounded-full p-3 sm:p-4 mb-3 sm:mb-0 sm:mr-4 md:mr-6 mx-auto sm:mx-0">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-blue" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-chef-charcoal mb-2 sm:mb-3 font-playfair">Vibrant Community</h4>
                  <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">Connect with like-minded food enthusiasts, share your creations, and get inspired by others' culinary journeys.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 chef-hover-lift">
              <div className="flex items-start flex-col sm:flex-row">
                <div className="bg-chef-royal-blue/20 rounded-full p-3 sm:p-4 mb-3 sm:mb-0 sm:mr-4 md:mr-6 mx-auto sm:mx-0">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-blue" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-chef-charcoal mb-2 sm:mb-3 font-playfair">Structured Learning Path</h4>
                  <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">Progress through carefully designed courses that build upon each other, ensuring comprehensive skill development.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-4 sm:p-6 md:p-8 chef-hover-lift">
              <div className="flex items-start flex-col sm:flex-row">
                <div className="bg-chef-royal-blue/20 rounded-full p-3 sm:p-4 mb-3 sm:mb-0 sm:mr-4 md:mr-6 mx-auto sm:mx-0">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-chef-royal-blue" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-chef-charcoal mb-2 sm:mb-3 font-playfair">Recognition & Growth</h4>
                  <p className="text-chef-charcoal/70 font-inter text-xs sm:text-sm md:text-base">Earn certificates, build your culinary portfolio, and track your progress as you master new skills and techniques.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-8 sm:mt-12">
            <Link 
              to="/about" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-chef-royal-green text-chef-royal-green hover:bg-chef-royal-green hover:text-chef-warm-ivory font-medium rounded-xl transition-all duration-300 group text-sm sm:text-base"
            >
              Read More About Our Approach
              <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChefCircle;