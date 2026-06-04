import { ArrowRight, ChefHat, Users } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "./AuthProvider";
import { useMemberCount } from "@/hooks/useMemberCount";
import TextReveal from "@/components/motion/TextReveal";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { memberCount, formatCount } = useMemberCount();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 220]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.18]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.85, 0]);

  const handlePrimaryCta = () => {
    if (user) navigate('/clubs');
    else navigate('/membership');
  };

  const handleSecondaryCta = () => {
    navigate('/courses');
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-background"
      aria-label="ChefsCircle hero"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: bgY, scale: bgScale }}
      >
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1280&fit=crop&q=85"
          alt=""
          aria-hidden
          className="h-[120%] w-full object-cover"
        />
      </motion.div>

      {/* Layered warm overlay */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/30 to-background"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-foreground/40 via-transparent to-transparent" />

      {/* Floating gold orbs (depth) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl animate-float-slow"
        style={{ animationDelay: '1s' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/4 top-20 h-64 w-64 rounded-full bg-accent/25 blur-3xl animate-float-slow"
        style={{ animationDelay: '3s' }}
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center md:min-h-[92vh]"
      >
        <h1 className="font-playfair text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[88px]">
          <TextReveal text="Cook wat" as="span" className="block" />
          <span className="mt-2 block">
            <TextReveal
              text="u crave"
              className="font-cursive text-gold-gradient italic text-6xl sm:text-7xl md:text-8xl lg:text-[100px]"
              delay={0.35}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl font-inter text-base text-foreground/70 sm:text-lg md:text-xl"
        >
          A modern culinary platform — masterclasses, live sessions, and a
          considered community for people who take food seriously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <button
            onClick={handlePrimaryCta}
            className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium tracking-wide text-background transition-colors hover:bg-foreground/90 sm:text-base"
          >
            {user ? 'Enter' : 'Get started'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={handleSecondaryCta}
            className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-8 py-4 text-sm font-medium tracking-wide text-foreground backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent sm:text-base"
          >
            Explore courses
            <ChefHat className="h-4 w-4 transition-transform group-hover:rotate-6" />
          </button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.2em] text-foreground/50"
        >
          <span className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            {memberCount && memberCount > 0 ? `${formatCount(memberCount)} members` : 'A growing community'}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
          <span>Live masterclasses</span>
          <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
          <span>Curated by chefs</span>
        </motion.div>
      </motion.div>

      {/* Subtle scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-foreground/40"
      >
        Scroll
      </motion.div>
    </section>
  );
};

export default Hero;
