
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { useNewsApi } from '@/hooks/useNewsApi';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPreview = () => {
  const { articles, isLoading } = useNewsApi();
  
  // Get the 3 most recent articles
  const recentArticles = articles.slice(0, 3);

  return (
    <section id="news" className="py-16 md:py-24 px-4 md:px-12 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Newspaper size={20} className="text-chef-royal-blue" />
              <span className="text-chef-royal-blue font-medium">Latest Updates</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-chef-charcoal font-playfair">Culinary News & Trends</h2>
            <p className="text-chef-charcoal/70 max-w-xl font-inter">
              Stay informed with the latest culinary news, industry trends, and expert insights from the world of professional cooking.
            </p>
          </div>
          <Link to="/blog" className="mt-4 md:mt-0">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-chef-royal-blue font-medium rounded-lg border-2 border-chef-royal-blue hover:bg-chef-royal-blue hover:text-white transition-colors group">
              View All News
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
        
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-96 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden">
                <div className="flex gap-6 pb-4 overflow-x-auto snap-x snap-mandatory pl-1">
                  {recentArticles.map((article, index) => (
                    <div key={index} className="flex-none w-[85%] snap-center">
                      <NewsCard article={article} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-chef-royal-blue' : 'w-2 bg-chef-charcoal/30'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Desktop: Grid layout */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article, index) => (
                  <NewsCard key={index} article={article} />
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
