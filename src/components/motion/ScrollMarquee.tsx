import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ScrollMarqueeProps {
  words?: string[];
  /** Base speed multiplier — how far the text travels per scroll unit. */
  speed?: number;
  className?: string;
}

/**
 * Oversized editorial marquee that slides horizontally as the user scrolls.
 * Gives the page a magazine / editorial feel.
 */
const ScrollMarquee = ({
  words = ['COOK', 'LEARN', 'SHARE', 'CREATE', 'TASTE', 'GROW'],
  speed = 300,
  className,
}: ScrollMarqueeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -speed]);

  // Duplicate the list to fill the horizontal space
  const doubled = [...words, ...words];

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden select-none py-10 sm:py-14 ${className ?? ''}`}
      aria-hidden
    >
      <motion.div
        style={{ x }}
        className="flex items-center gap-6 sm:gap-10 whitespace-nowrap will-change-transform"
      >
        {doubled.map((word, i) => (
          <span key={`${word}-${i}`} className="marquee-text flex items-center gap-6 sm:gap-10">
            <span>{word}</span>
            <span className="h-2 w-2 rounded-full bg-accent/40 shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollMarquee;
