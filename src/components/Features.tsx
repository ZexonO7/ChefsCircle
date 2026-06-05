import { Users, BookOpen, Crown, Sparkles, Play, ArrowRight, UtensilsCrossed, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemberCount } from '@/hooks/useMemberCount';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';
import Parallax from '@/components/motion/Parallax';
import CountUp from '@/components/motion/CountUp';

const Features = () => {
  const navigate = useNavigate();
  const { memberCount, formatCount } = useMemberCount();

  const features = [
    {
      icon: Play,
      title: 'Live masterclasses',
      description:
        'Cook in real time with chefs on screen. Ask questions, taste as you go, understand the why behind every technique.',
      tag: 'Weekly',
    },
    {
      icon: Crown,
      title: 'On-demand library',
      description:
        'A growing archive of beautifully shot classes — techniques, regional cuisines, and modern interpretations.',
      tag: 'Members',
    },
    {
      icon: Users,
      title: 'A considered community',
      description:
        'A focused circle of home cooks who care about craft. Share your work, get thoughtful feedback, refine your practice.',
      tag: 'Community',
    },
    {
      icon: Sparkles,
      title: 'Recipes worth keeping',
      description:
        'Every recipe is tested in real kitchens — from quick weeknight dishes to refined occasion menus.',
      tag: 'Curated',
    },
  ];

  const stats = [
    { icon: UtensilsCrossed, value: 50, suffix: '+', label: 'Recipes' },
    { icon: Play, value: 12, suffix: '+', label: 'Masterclasses' },
    { icon: Award, value: 8, suffix: '', label: 'Expert chefs' },
    { icon: BookOpen, value: 20, suffix: '+', label: 'Free courses' },
  ];

  return (
    <section id="features" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
              <Sparkles className="h-3 w-3" />
              The platform
            </span>
          </Reveal>
          <h2 className="mt-6 font-playfair text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <TextReveal text="Everything you need" as="span" className="block" />
            <TextReveal
              text="to master your craft."
              as="span"
              className="block italic text-foreground/70"
              delay={0.25}
            />
          </h2>
          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
              A focused set of tools and experiences, designed for cooks who want
              to go deeper.
            </p>
          </Reveal>

          {/* Animated stat counters */}
          <Reveal delay={0.5}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-2 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground/60">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-playfair text-3xl font-semibold tracking-tight text-foreground">
                      <CountUp to={s.value} suffix={s.suffix} duration={1600} />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Feature cards with parallax depth */}
        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={0.1 + i * 0.08}>
                <Parallax offset={10 + i * 5} className="h-full">
                  <div className="premium-card group h-full p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/40">
                        {f.tag}
                      </span>
                    </div>
                    <h3 className="mt-6 font-playfair text-xl font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-3 font-inter text-sm leading-relaxed text-foreground/60">
                      {f.description}
                    </p>
                  </div>
                </Parallax>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4} className="mt-16 text-center">
          <button
            onClick={() => navigate('/culinary-journey')}
            className="btn-glow group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Begin your journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Features;

