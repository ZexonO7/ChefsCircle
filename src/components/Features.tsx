import { Users, BookOpen, Crown, Sparkles, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemberCount } from '@/hooks/useMemberCount';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';

const Features = () => {
  const navigate = useNavigate();
  const { memberCount, formatCount } = useMemberCount();

  const features = [
    {
      icon: Play,
      title: 'Live Cook-Alongs',
      description:
        'Cook in real time with world-class chefs. Ask questions, taste together, and learn the why behind every move.',
      tag: 'Weekly',
    },
    {
      icon: Crown,
      title: 'Master Classes',
      description:
        'A growing library of cinematic masterclasses — covering technique, regional cuisines, and modern craft.',
      tag: 'Premium',
    },
    {
      icon: Users,
      title: 'A Considered Community',
      description:
        'A small, thoughtful circle of home cooks who care. Share creations, get sharp feedback, and grow together.',
      tag: 'Members',
    },
    {
      icon: Sparkles,
      title: 'Editorial Recipes',
      description:
        'Every recipe is tested and styled with care — from quick weeknight wins to weekend showpieces.',
      tag: 'Curated',
    },
  ];

  return (
    <section id="features" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
              <Sparkles className="h-3 w-3" />
              The Platform
            </span>
          </Reveal>
          <h2 className="mt-6 font-playfair text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <TextReveal text="A new home for" as="span" className="block" />
            <TextReveal
              text="modern culinary craft."
              as="span"
              className="block italic text-foreground/70"
              delay={0.25}
            />
          </h2>
          <Reveal delay={0.4}>
            <p className="mx-auto mt-6 max-w-xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
              Everything you need to grow as a cook — beautifully designed, quietly
              powerful, and built around real people in real kitchens.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-foreground/40">
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                {memberCount && memberCount > 0
                  ? `${formatCount(memberCount)} Members`
                  : 'Growing community'}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" />
                Free courses available
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={0.1 + i * 0.08}>
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
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4} className="mt-16 text-center">
          <button
            onClick={() => navigate('/culinary-journey')}
            className="btn-glow group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Begin your culinary journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Features;
