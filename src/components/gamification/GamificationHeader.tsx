
import { Trophy } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';

const GamificationHeader = () => {
  return (
    <div className="text-center mb-12">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent mb-6">
          <Trophy className="h-3 w-3" />
          Culinary Journey
        </span>
      </Reveal>
      <h2 className="mt-6 font-playfair text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
        <TextReveal text="Your cooking" as="span" className="block" />
        <TextReveal
          text="progress."
          as="span"
          className="block italic text-foreground/70"
          delay={0.25}
        />
      </h2>
      <Reveal delay={0.4}>
        <p className="mx-auto mt-6 max-w-2xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
          Level up your culinary skills, earn badges, and compete with fellow chefs in our gamified cooking experience.
        </p>
      </Reveal>
    </div>
  );
};

export default GamificationHeader;
