import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  /** Target number to count to. */
  to: number;
  /** Duration in ms. */
  duration?: number;
  /** Prefix string (e.g. "$"). */
  prefix?: string;
  /** Suffix string (e.g. "+", "%"). */
  suffix?: string;
  className?: string;
}

/**
 * Animated number counter that triggers when the element scrolls into view.
 */
const CountUp = ({
  to,
  duration = 1800,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setValue(to);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
};

export default CountUp;
