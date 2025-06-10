
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
    <section id="why-chefcircle" className="relative py-16 md:py-24 bg-chef-warm-ivory overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-sm font-medium">
            <ChefHat className="w-4 h-4" />
            Why Choose ChefCircle
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-chef-charcoal mb-6 font-playfair">
            The Future of Culinary Education
          </motion.h2>
          <motion.p variants={itemVariants} className="text-chef-charcoal/70 text-lg max-w-3xl mx-auto font-inter">
            In a world where cooking shows inspire but don't truly teach, ChefCircle bridges the gap between passion and mastery through personalized, interactive culinary education.
          </motion.p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="chef-card p-8 text-center chef-hover-lift">
            <div className="w-16 h-16 rounded-full bg-chef-royal-blue/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-chef-royal-blue" />
            </div>
            <h3 className="text-chef-charcoal text-2xl lg:text-3xl font-bold mb-4 font-playfair">
              <AnimatedCounter end={2500} suffix="+" />
            </h3>
            <p className="text-chef-charcoal/70 font-inter">Active members learning and growing together in our exclusive culinary community</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="chef-card p-8 text-center chef-hover-lift">
            <div className="w-16 h-16 rounded-full bg-chef-royal-green/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-chef-royal-green" />
            </div>
            <h3 className="text-chef-charcoal text-2xl lg:text-3xl font-bold mb-4 font-playfair">
              <AnimatedCounter end={150} suffix="+" />
            </h3>
            <p className="text-chef-charcoal/70 font-inter">
              Master classes and cook-alongs completed by our members, with 95% satisfaction rate
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="chef-card p-8 text-center chef-hover-lift">
            <div className="w-16 h-16 rounded-full bg-chef-royal-blue/20 flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-chef-royal-blue" />
            </div>
            <h3 className="text-chef-charcoal text-2xl lg:text-3xl font-bold mb-4 font-playfair">
              <AnimatedCounter end={4.9} decimals={1} suffix="/5" />
            </h3>
            <p className="text-chef-charcoal/70 font-inter">
              Average rating from our members, reflecting the quality of our culinary education programs
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-blue/20 text-chef-royal-blue rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              What ChefCircle Offers You
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-chef-charcoal mb-4 font-playfair">
              Transform Your Passion Into Mastery
            </h3>
            <p className="text-chef-charcoal/70 max-w-3xl mx-auto font-inter">
              We provide the structured learning, expert guidance, and supportive community that home cooks need to become confident chefs.
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="chef-card p-8 chef-hover-lift">
              <div className="flex items-start">
                <div className="bg-chef-royal-green/20 rounded-full p-4 mr-6">
                  <ChefHat className="w-8 h-8 text-chef-royal-green" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-chef-charcoal mb-3 font-playfair">Expert-Led Instruction</h4>
                  <p className="text-chef-charcoal/70 font-inter">Learn from renowned chefs and culinary experts who share their secrets, techniques, and professional insights in every session.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-8 chef-hover-lift">
              <div className="flex items-start">
                <div className="bg-chef-royal-blue/20 rounded-full p-4 mr-6">
                  <Users className="w-8 h-8 text-chef-royal-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-chef-charcoal mb-3 font-playfair">Vibrant Community</h4>
                  <p className="text-chef-charcoal/70 font-inter">Connect with like-minded food enthusiasts, share your creations, and get inspired by others' culinary journeys.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-8 chef-hover-lift">
              <div className="flex items-start">
                <div className="bg-chef-royal-blue/20 rounded-full p-4 mr-6">
                  <BookOpen className="w-8 h-8 text-chef-royal-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-chef-charcoal mb-3 font-playfair">Structured Learning Path</h4>
                  <p className="text-chef-charcoal/70 font-inter">Progress through carefully designed courses that build upon each other, ensuring comprehensive skill development.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="chef-card p-8 chef-hover-lift">
              <div className="flex items-start">
                <div className="bg-chef-royal-blue/20 rounded-full p-4 mr-6">
                  <Award className="w-8 h-8 text-chef-royal-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-chef-charcoal mb-3 font-playfair">Recognition & Growth</h4>
                  <p className="text-chef-charcoal/70 font-inter">Earn certificates, build your culinary portfolio, and track your progress as you master new skills and techniques.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link 
              to="/blog" 
              onClick={() => window.scrollTo(0, 0)}
              className="chef-button-outline inline-flex items-center group"
            >
              Read More About Our Approach
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChefCircle;
