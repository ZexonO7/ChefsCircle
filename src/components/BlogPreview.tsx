import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { useNewsApi } from '@/hooks/useNewsApi';
import { Skeleton } from '@/components/ui/skeleton';
import Reveal from '@/components/motion/Reveal';
import TextReveal from '@/components/motion/TextReveal';

const BlogPreview = () => {
  const { articles, isLoading } = useNewsApi();

  // Get the 3 most recent articles
  const recentArticles = articles.slice(0, 3);

  return (
    <section id="news" className="relative bg-background py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-accent mb-6">
                <Newspaper className="h-3 w-3" />
                Latest updates
              </span>
            </Reveal>
            <h2 className="mt-6 font-playfair text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <TextReveal text="Culinary news" as="span" className="block" />
              <TextReveal
                text="& trends."
                as="span"
                className="block italic text-foreground/70"
                delay={0.25}
              />
            </h2>
            <Reveal delay={0.4}>
              <p className="mt-6 font-inter text-base leading-relaxed text-foreground/60 sm:text-lg max-w-xl">
                Stay informed with the latest culinary news, industry trends, and expert insights from the world of professional cooking.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.5}>
            <Link to="/blog">
              <button className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-7 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-accent/50 hover:text-accent">
                View all news
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-80 sm:h-96 w-full rounded-2xl bg-secondary/60" />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="sm:hidden">
                <div className="flex gap-4 pb-4 overflow-x-auto snap-x snap-mandatory pl-1">
                  {recentArticles.map((article, index) => (
                    <Reveal key={index} delay={index * 0.1}>
                      <div className="flex-none w-[85vw] snap-center">
                        <NewsCard article={article} />
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full ${
                          i === 0 ? 'w-6 bg-accent' : 'w-2 bg-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {recentArticles.map((article, index) => (
                  <Reveal key={index} delay={0.1 + index * 0.08}>
                    <NewsCard article={article} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;