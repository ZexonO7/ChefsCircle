import { motion, useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  /** Stagger between words (seconds). */
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Apple-style word-by-word rise reveal. Each word slides up from a clipping mask.
 */
const TextReveal = ({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = 'span',
}: TextRevealProps) => {
  const reduce = useReducedMotion();
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: '0.28em' }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduce ? { y: 0, opacity: 1 } : { y: '110%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
