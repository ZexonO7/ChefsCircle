import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Sparkles } from 'lucide-react';
const LoadingScreen = () => {
  return <div className="fixed inset-0 z-50 bg-gradient-to-br from-chef-charcoal via-chef-royal-green to-chef-royal-blue flex items-center justify-center">
      <div className="text-center">
        {/* Main logo animation */}
        <motion.div initial={{
        scale: 0,
        rotate: -180
      }} animate={{
        scale: 1,
        rotate: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-chef-warm-ivory rounded-full flex items-center justify-center shadow-2xl">
            <ChefHat className="w-12 h-12 text-chef-charcoal" />
          </div>
          
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => <motion.div key={i} className="absolute" style={{
          left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}px`,
          top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}px`
        }} animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeInOut"
        }}>
              <Sparkles className="w-4 h-4 text-chef-warm-ivory" />
            </motion.div>)}
        </motion.div>

        {/* Brand name */}
        <motion.h1 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5,
        duration: 0.6
      }} className="text-4xl md:text-5xl font-bold font-playfair text-chef-warm-ivory mb-4">ChefsCircle</motion.h1>

        {/* Loading text */}
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8,
        duration: 0.4
      }} className="text-chef-warm-ivory/80 text-lg font-inter mb-8">
          Preparing your culinary experience...
        </motion.p>

        {/* Loading bar */}
        <motion.div initial={{
        width: 0
      }} animate={{
        width: "100%"
      }} transition={{
        delay: 1,
        duration: 1.5,
        ease: "easeInOut"
      }} className="w-64 mx-auto bg-chef-warm-ivory/20 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div initial={{
          x: "-100%"
        }} animate={{
          x: "100%"
        }} transition={{
          delay: 1.2,
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="h-full w-1/3 bg-gradient-to-r from-transparent via-chef-warm-ivory to-transparent" />
        </motion.div>

        {/* Dots animation */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.2,
        duration: 0.4
      }} className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => <motion.div key={i} className="w-2 h-2 bg-chef-warm-ivory rounded-full" animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }} transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
          ease: "easeInOut"
        }} />)}
        </motion.div>
      </div>
    </div>;
};
export default LoadingScreen;