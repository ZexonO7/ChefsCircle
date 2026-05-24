import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Play, Clock, Users, Crown, BookOpen, Search, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCourseEnrollments } from '@/hooks/useCourseEnrollments';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';

interface CourseCardData {
  id: number;
  title: string;
  instructor: string;
  description: string;
  image: string;
  duration: number;
  lessons: number;
  price: number;
  difficulty: string;
  category: string;
  isFeatured: boolean;
}

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getEnrollmentCount } = useCourseEnrollments();

  const filters = ['All', 'Free', 'Premium', 'Beginner', 'Intermediate', 'Advanced'];

  const courses: CourseCardData[] = [
    // Free first
    {
      id: 1,
      title: 'Knife Skills Mastery',
      instructor: 'Chef Isabella Rodriguez',
      description:
        'Master professional knife technique, from basic cuts to advanced julienne. The foundation every cook needs.',
      image:
        'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 180,
      lessons: 12,
      price: 0,
      difficulty: 'Beginner',
      category: 'Fundamentals',
      isFeatured: true,
    },
    {
      id: 4,
      title: 'Plant-Based Protein Power',
      instructor: 'Chef Green Thompson',
      description:
        'Discover the world of plant proteins. Build satisfying, nutritious meals without compromise.',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 150,
      lessons: 10,
      price: 0,
      difficulty: 'Beginner',
      category: 'Healthy',
      isFeatured: false,
    },
    {
      id: 6,
      title: 'Quick Weeknight Dinners',
      instructor: 'Chef Sarah Williams',
      description:
        'Beautiful, healthy meals in 30 minutes or less. Designed for the busiest of weeks.',
      image:
        'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 120,
      lessons: 6,
      price: 0,
      difficulty: 'Beginner',
      category: 'Quick & Easy',
      isFeatured: false,
    },
    // Premium
    {
      id: 2,
      title: 'Italian Pasta Making',
      instructor: 'Nonna Maria Giuseppe',
      description:
        'Authentic Tuscan pasta from scratch — traditional techniques passed down for generations.',
      image:
        'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 240,
      lessons: 8,
      price: 10,
      difficulty: 'Intermediate',
      category: 'International',
      isFeatured: true,
    },
    {
      id: 3,
      title: 'Molecular Gastronomy Basics',
      instructor: 'Dr. James Chen',
      description:
        'Transform ordinary ingredients into extraordinary culinary art with science-led techniques.',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 360,
      lessons: 15,
      price: 10,
      difficulty: 'Advanced',
      category: 'Innovation',
      isFeatured: false,
    },
    {
      id: 5,
      title: 'French Pastry Techniques',
      instructor: 'Maître Pâtissier Laurent',
      description:
        'Master classic French pastry — from pâte choux to laminated doughs and macarons.',
      image:
        'https://images.unsplash.com/photo-1509365465985-25d11c17e812?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: 480,
      lessons: 20,
      price: 10,
      difficulty: 'Advanced',
      category: 'Baking',
      isFeatured: true,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (selectedFilter === 'Free') matchesFilter = course.price === 0;
    else if (selectedFilter === 'Premium') matchesFilter = course.price > 0;
    else if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedFilter))
      matchesFilter = course.difficulty === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleEnrollment = (course: CourseCardData) => {
    if (!user && course.price > 0) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to enroll in premium courses.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    navigate(`/courses/${course.id}`);
  };

  const renderCourseCard = (course: CourseCardData, index: number, featured = false) => (
    <Reveal key={course.id} delay={Math.min(index * 0.07, 0.4)}>
      <article
        onClick={() => navigate(`/courses/${course.id}`)}
        className="premium-card group cursor-pointer overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-accent backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}
            {course.price === 0 ? (
              <span className="rounded-full border border-background/30 bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-md">
                Free
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-accent backdrop-blur-md">
                <Crown className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>
          <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            <Play className="h-3 w-3" />
            {course.lessons} lessons
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            <span>{course.category}</span>
            <span>{course.difficulty}</span>
          </div>
          <h3 className="mt-3 font-playfair text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
            {course.title}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-foreground/50">
            {course.instructor}
          </p>
          <p className="mt-3 line-clamp-2 font-inter text-sm leading-relaxed text-foreground/60">
            {course.description}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-foreground/55">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(course.duration)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {getEnrollmentCount(course.id)}
              </span>
            </div>
            {course.price === 0 ? (
              <span className="text-sm font-semibold text-foreground">Free</span>
            ) : (
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">${course.price}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                  or with membership
                </div>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnrollment(course);
            }}
            className="btn-glow group/btn mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            {course.price === 0 ? 'Start Learning' : 'Enroll Now'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </article>
    </Reveal>
  );

  const featuredCourses = courses.filter((c) => c.isFeatured);

  return (
    <PageLayout>
      <SEO
        title="Culinary Courses — ChefsCircle"
        description="Learn from world-class chefs with cinematic, considered courses. From foundations to mastery."
        keywords={['culinary courses', 'cooking classes', 'chef training', 'culinary education']}
      />

      <div className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-secondary/30">
          <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-6 py-20 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-background/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Courses
              </span>
            </Reveal>
            <h1 className="mt-6 font-playfair text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              <TextReveal text="Master the" as="span" className="block" />
              <TextReveal
                text="culinary arts."
                as="span"
                className="block italic text-gold-gradient"
                delay={0.25}
              />
            </h1>
            <Reveal delay={0.4}>
              <p className="mx-auto mt-6 max-w-xl font-inter text-base leading-relaxed text-foreground/60 sm:text-lg">
                Cinematic masterclasses from world-renowned chefs. Free foundations.
                Premium depth. Always considered.
              </p>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mx-auto mt-10 max-w-md">
                <div className="glass-panel relative overflow-hidden rounded-full">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search courses, chefs, techniques…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full bg-transparent pl-12 pr-5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-20 border-b border-border/40 bg-background/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-6 py-4 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition-all ${
                  selectedFilter === filter
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        {selectedFilter === 'All' && featuredCourses.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
                    Editor&apos;s pick
                  </span>
                  <h2 className="mt-2 font-playfair text-3xl font-semibold text-foreground sm:text-4xl">
                    Featured Courses
                  </h2>
                </div>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredCourses.map((c, i) => renderCourseCard(c, i, true))}
            </div>
          </section>
        )}

        {/* All */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <Reveal>
            <div className="mb-10">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/50">
                Library
              </span>
              <h2 className="mt-2 font-playfair text-3xl font-semibold text-foreground sm:text-4xl">
                {selectedFilter === 'All' ? 'All Courses' : `${selectedFilter} Courses`}
              </h2>
            </div>
          </Reveal>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/20 py-20 text-center">
              <BookOpen className="mx-auto mb-4 h-8 w-8 text-foreground/30" />
              <p className="text-sm text-foreground/60">No courses match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((c, i) => renderCourseCard(c, i))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
};

export default Courses;
