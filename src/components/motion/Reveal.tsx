import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /** "up" (default) | "fade" | "scale" | "left" | "right" */
  variant?: 'up' | 'fade' | 'scale' | 'left' | 'right';
}

/**
 * Apple-style scroll reveal. Honors prefers-reduced-motion.
 */
const Reveal = ({
  children,
  delay = 0,
  duration = 0.8,
  y = 28,
  className,
  once = true,
  variant = 'up',
}: RevealProps) => {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 1 }
      : variant === 'fade'
      ? { opacity: 0 }
      : variant === 'scale'
      ? { opacity: 0, scale: 0.96 }
      : variant === 'left'
      ? { opacity: 0, x: -y }
      : variant === 'right'
      ? { opacity: 0, x: y }
      : { opacity: 0, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
