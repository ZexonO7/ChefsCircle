import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Utensils, Crown } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-chef-warm-ivory flex items-center justify-center overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-chef-royal-green/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="text-center relative z-10">
            {/* Icon trio animation */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -50, rotate: -20 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                <div className="w-14 h-14 bg-chef-royal-green/10 rounded-2xl flex items-center justify-center border border-chef-royal-green/20">
                  <Utensils className="w-7 h-7 text-chef-royal-green" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                <div className="w-20 h-20 bg-chef-royal-green rounded-full flex items-center justify-center shadow-xl shadow-chef-royal-green/30">
                  <ChefHat className="w-10 h-10 text-chef-warm-ivory" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 20 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                <div className="w-14 h-14 bg-chef-royal-green/10 rounded-2xl flex items-center justify-center border border-chef-royal-green/20">
                  <Crown className="w-7 h-7 text-chef-royal-green" />
                </div>
              </motion.div>
            </div>

            {/* Brand name with elegant reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold font-playfair text-chef-charcoal tracking-tight">
                ChefsCircle
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                className="h-0.5 w-24 mx-auto mt-3 bg-gradient-to-r from-transparent via-chef-royal-green to-transparent"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-chef-charcoal/60 text-base font-inter mb-10"
            >
              Elevating Your Culinary Journey
            </motion.p>

            {/* Elegant loading indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="flex justify-center items-center gap-3"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-chef-royal-green"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chef-royal-green via-chef-royal-green/50 to-chef-royal-green origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;