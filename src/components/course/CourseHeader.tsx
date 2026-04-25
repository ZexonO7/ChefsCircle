import { Clock, Users, Star, ChefHat } from 'lucide-react';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';

interface CourseHeaderProps {
  course: {
    title: string;
    instructor: string;
    description: string;
    category: string;
    duration: number;
    students: number;
    rating: number;
    difficulty: string;
  };
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-secondary/30 pt-28 pb-16">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md">
            {course.category}
          </span>
        </Reveal>
        <h1 className="mt-6 font-playfair text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          <TextReveal text={course.title} as="span" className="block" />
        </h1>
        <Reveal delay={0.4}>
          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
            {course.description}
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-foreground/50">
            <span className="inline-flex items-center gap-2">
              <ChefHat className="h-3.5 w-3.5" />
              {course.instructor}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {Math.floor(course.duration / 60)}h {course.duration % 60}m
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
            <span className="inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              New course
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
            <span className="inline-flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-accent" />
              {course.difficulty}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CourseHeader;
