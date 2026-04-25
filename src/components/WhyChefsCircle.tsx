import { ChefHat, Users, BookOpen, Award, ArrowRight, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemberCount } from '@/hooks/useMemberCount';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';
import Parallax from '@/components/motion/Parallax';

const stats = [
  { icon: Users, label: 'Active members', valueKey: 'members' },
  { icon: Trophy, label: 'Expert-led', value: 'Masterclasses' },
  { icon: Star, label: 'Quality', value: 'Editorially crafted' },
];

const pillars = [
  {
    icon: ChefHat,
    title: 'Expert-led instruction',
    body:
      'Renowned chefs share the why behind the craft — not just recipes, but real, applied technique.',
  },
  {
    icon: Users,
    title: 'A considered community',
    body:
      'A small, kind, ambitious group of home cooks. Share what you cooked, get thoughtful feedback.',
  },
  {
    icon: BookOpen,
    title: 'Structured paths',
    body:
      'Move from fundamentals to mastery through carefully sequenced courses and live sessions.',
  },
  {
    icon: Award,
    title: 'Recognition that matters',
    body:
      'Earn beautiful, verifiable certificates and build a portfolio of work you can be proud of.',
  },
];

const WhyChefsCircle = () => {
  const { memberCount, formatCount } = useMemberCount();

  return (
    <section
      id="why-chefscircle"
      className="relative overflow-hidden bg-secondary/40 py-24 sm:py-32"
    >
      <Parallax offset={40} className="pointer-events-none absolute -right-32 top-10 h-96 w-96 opacity-30">
        <div className="h-full w-full rounded-full bg-accent/30 blur-3xl" />
      </Parallax>
      <Parallax offset={-30} className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 opacity-20">
        <div className="h-full w-full rounded-full bg-foreground/10 blur-3xl" />
      </Parallax>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/70 backdrop-blur-md">
              <ChefHat className="h-3 w-3" />
              Why ChefsCircle
            </span>
          </Reveal>
          <h2 className="mt-6 font-playfair text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <TextReveal text="The future of" as="span" className="block" />
            <TextReveal
              text="culinary education."
              as="span"
              className="block italic text-gold-gradient"
              delay={0.25}
            />
          </h2>
          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-2xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
              Cooking shows inspire — but they don&apos;t teach. ChefsCircle bridges
              that gap with intimate, personalized, deeply considered culinary
              education.
            </p>
          </Reveal>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((s, i) => {
            const Icon = s.icon;
            const value =
              s.valueKey === 'members'
                ? memberCount && memberCount > 0
                  ? formatCount(memberCount)
                  : 'Growing'
                : s.value;
            return (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="premium-card flex h-full flex-col items-center p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 font-playfair text-3xl font-semibold text-foreground">
                    {value}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Pillars */}
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-2">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="premium-card group flex h-full gap-5 p-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-2 font-inter text-sm leading-relaxed text-foreground/60">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3} className="mt-16 text-center">
          <Link
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            className="btn-glow group inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent"
          >
            Read our approach
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyChefsCircle;
