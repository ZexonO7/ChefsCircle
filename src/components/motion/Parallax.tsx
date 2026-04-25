import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  /** Pixel distance for parallax travel. Negative = moves up. */
  offset?: number;
  className?: string;
  /** Scale on scroll (e.g. 1.0 -> 1.1). */
  scaleTo?: number;
}

/**
 * Lightweight scroll-driven parallax wrapper using framer-motion's useScroll.
 * Falls back to no-op when prefers-reduced-motion is set.
 */
const Parallax = ({ children, offset = 80, className, scaleTo }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [offset, -offset]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce || !scaleTo ? [1, 1] : [1, scaleTo]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale }} className="will-change-transform h-full w-full">
        {children}
      </motion.div>
    </div>
  );
};

export default Parallax;
