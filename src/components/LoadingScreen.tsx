import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut", delay: 0.5 } }}
    >
      {/* Background Panels - Curtain Sweep Effect */}
      <motion.div
        className="absolute inset-0 bg-chef-warm-ivory"
        initial={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-chef-gold"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
      <motion.div
        className="absolute inset-0 bg-chef-royal-green"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      />
      
      {/* Logo & Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: [-10, 0] }}
        exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
        transition={{ 
          duration: 0.8, 
          ease: "backOut",
          delay: 0.8 // Wait for panels to arrive
        }}
        className="relative z-10 text-center flex flex-col items-center"
      >
        <div className="w-28 h-28 mx-auto bg-chef-warm-ivory rounded-full flex items-center justify-center shadow-2xl mb-6">
          <ChefHat className="w-14 h-14 text-chef-royal-green" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-5xl md:text-7xl font-serif text-chef-warm-ivory tracking-widest uppercase drop-shadow-lg"
        >
          Chef's Circle
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;