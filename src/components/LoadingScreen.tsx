import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-chef-warm-ivory flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-16 h-16 mx-auto bg-chef-royal-green rounded-full flex items-center justify-center shadow-lg mb-4">
          <ChefHat className="w-8 h-8 text-chef-warm-ivory" />
        </div>
        <div className="flex justify-center items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-chef-royal-green"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;