import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import NewsCard from '@/components/NewsCard';
import { useNewsApi } from '@/hooks/useNewsApi';
import { RefreshCw, Newspaper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Blog = () => {
  const { articles, isLoading, error, refetch } = useNewsApi();
  const { toast } = useToast();

  const handleRefresh = async () => {
    console.log('Refresh button clicked');
    try {
      toast({
        title: "Refreshing news...",
        description: "Loading fresh culinary stories and insights",
      });
      
      await refetch();
      
      toast({
        title: "News refreshed!",
        description: "Latest curated culinary content has been loaded",
      });
      
      console.log('News refresh completed successfully');
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        title: "Refresh failed",
        description: "Unable to refresh news content",
        variant: "destructive",
      });
    }
  };

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <PageLayout>
      <SEO 
        title="ChefCircle - Latest Culinary News" 
        description="Stay updated with the latest culinary news, trends, and insights from the world of professional cooking and gastronomy." 
        keywords={['culinary news', 'cooking trends', 'chef news', 'food industry', 'restaurant news']} 
        type="website" 
      />
      
      <div className="w-full pt-24 pb-12 bg-gradient-to-b from-chef-charcoal to-chef-royal-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Newspaper className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold font-playfair">Latest Culinary News</h1>
            </div>
            <p className="text-xl text-chef-warm-ivory/90 mb-6 font-inter">
              Curated culinary stories, trends, and insights from the world of professional cooking
            </p>
            <button 
              onClick={handleRefresh} 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-chef-warm-ivory text-chef-charcoal font-semibold rounded-lg hover:bg-chef-cream transition-colors border-0"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh News
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {error && (
          <div className="text-center mb-8">
            <div className="border-red-200 bg-red-50 border rounded-lg p-4">
              <p className="text-red-800">
                Unable to load news content. Please try refreshing the page.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured article skeleton */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            {/* Other articles skeletons */}
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticle && (
              <NewsCard article={featuredArticle} featured={true} />
            )}
            
            {otherArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
            
            {articles.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-16">
                <h3 className="text-2xl font-bold mb-4 text-chef-charcoal">No news articles found</h3>
                <p className="text-chef-charcoal/70 mb-6">
                  We couldn't find any culinary news at the moment. Please try refreshing.
                </p>
                <button 
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-chef-royal-blue text-white font-medium rounded-lg hover:bg-chef-royal-blue/90 transition-colors border-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Blog;
