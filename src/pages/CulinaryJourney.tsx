import { CheckCircle, User, ChefHat, BookOpen, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import PageLayout from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const CulinaryJourney = () => {
  const { user } = useAuth();

  const steps = [
    {
      id: 1,
      title: "Create Your Account",
      description: "Sign up and join our community of passionate food enthusiasts",
      icon: User,
      action: "Go to Sign Up",
      link: "/auth",
      completed: !!user
    },
    {
      id: 2,
      title: "Customize Your Profile",
      description: "Tell us about your cooking experience, preferences, and culinary goals",
      icon: ChefHat,
      action: "Update Profile",
      link: "/settings",
      completed: false
    },
    {
      id: 3,
      title: "Explore Courses",
      description: "Browse our comprehensive cooking courses from beginner to advanced levels",
      icon: BookOpen,
      action: "View Courses",
      link: "/courses",
      completed: false
    },
    {
      id: 4,
      title: "Join Culinary Clubs",
      description: "Connect with like-minded chefs and participate in cooking challenges",
      icon: Users,
      action: "Browse Clubs",
      link: "/clubs",
      completed: false
    },
    {
      id: 5,
      title: "Share Your First Recipe",
      description: "Upload your favorite recipe and get feedback from the community",
      icon: Star,
      action: "Share Recipe",
      link: "/recipes",
      completed: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="Start Your Culinary Journey - ChefsCircle"
        description="Begin your cooking adventure with ChefsCircle. Follow our step-by-step guide to get the most out of our culinary community."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-warm-ivory/95 to-chef-gold/10 pt-24 pb-16">
        <motion.div 
          className="chef-container max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold font-playfair text-chef-charcoal mb-6">
              Start Your <span className="text-chef-royal-green">Culinary Journey</span>
            </h1>
            <p className="text-lg text-chef-charcoal/70 max-w-2xl mx-auto">
              Welcome to ChefsCircle! Follow these steps to make the most of our culinary community and accelerate your cooking skills.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  className={`bg-chef-warm-ivory border rounded-2xl p-6 shadow-lg hover:shadow-chef-luxury transition-all duration-300 ${
                    step.completed 
                      ? 'border-chef-royal-green bg-chef-royal-green/5' 
                      : 'border-chef-charcoal/10 hover:border-chef-royal-green/30'
                  }`}
                  variants={itemVariants}
                >
                  <div className="flex items-start gap-6">
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-chef-royal-green text-chef-warm-ivory' 
                          : 'bg-chef-charcoal/5 text-chef-charcoal'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <Icon className="w-8 h-8" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-chef-royal-green">
                          Step {step.id}
                        </span>
                        {step.completed && (
                          <span className="bg-chef-royal-green/10 text-chef-royal-green text-xs px-2 py-1 rounded-full font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-chef-charcoal mb-2 font-playfair">
                        {step.title}
                      </h3>
                      <p className="text-chef-charcoal/70 mb-4">
                        {step.description}
                      </p>
                      <Link to={step.link}>
                        <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          step.completed
                            ? 'bg-chef-royal-green/10 text-chef-royal-green hover:bg-chef-royal-green hover:text-chef-warm-ivory'
                            : 'bg-chef-royal-green text-chef-warm-ivory hover:bg-chef-forest'
                        }`}>
                          {step.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-12 p-8 bg-gradient-to-r from-chef-royal-green/5 to-chef-royal-blue/5 rounded-2xl border border-chef-royal-green/20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-chef-charcoal mb-4 font-playfair">
              Ready to Cook Something Amazing?
            </h3>
            <p className="text-chef-charcoal/70 mb-6">
              Join thousands of passionate cooks in our community and take your culinary skills to the next level.
            </p>
            <Link to="/membership">
              <button className="bg-chef-royal-green text-chef-warm-ivory px-8 py-3 rounded-xl font-medium hover:bg-chef-forest transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-chef-luxury">
                Explore Membership Options
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default CulinaryJourney;