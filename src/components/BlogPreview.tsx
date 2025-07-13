import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { useNewsApi } from '@/hooks/useNewsApi';
import { Skeleton } from '@/components/ui/skeleton';
const BlogPreview = () => {
  const {
    articles,
    isLoading
  } = useNewsApi();

  // Get the 3 most recent articles
  const recentArticles = articles.slice(0, 3);
  return <section id="news" className="py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 md:px-12 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Newspaper size={16} className="sm:w-5 sm:h-5 text-chef-royal-blue" />
              <span className="text-chef-royal-blue font-medium text-sm sm:text-base">Latest Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-chef-charcoal font-playfair">Culinary News & Trends</h2>
            <p className="text-chef-charcoal/70 max-w-xl font-inter text-sm sm:text-base">
              Stay informed with the latest culinary news, industry trends, and expert insights from the world of professional cooking.
            </p>
          </div>
          <Link to="/blog" className="mt-3 sm:mt-4 md:mt-0 w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-chef-royal-blue font-medium rounded-lg border-2 border-chef-royal-blue hover:bg-chef-royal-blue hover:text-white transition-colors group text-sm sm:text-base">
              View All News
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
        
        <div className="relative">
          {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({
            length: 3
          }).map((_, index) => <Skeleton key={index} className="h-80 sm:h-96 w-full rounded-lg bg-chef-cream" />)}
            </div> : <>
              {/* Mobile: Horizontal scroll */}
              <div className="sm:hidden">
                <div className="flex gap-4 pb-4 overflow-x-auto snap-x snap-mandatory pl-1">
                  {recentArticles.map((article, index) => <div key={index} className="flex-none w-[85%] snap-center">
                      <NewsCard article={article} />
                    </div>)}
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-chef-royal-blue' : 'w-2 bg-chef-charcoal/30'}`} />)}
                  </div>
                </div>
              </div>
              
              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recentArticles.map((article, index) => <NewsCard key={index} article={article} />)}
              </div>
            </>}
        </div>
      </div>
    </section>;
};
export default BlogPreview;