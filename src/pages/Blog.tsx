
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import NewsCard from '@/components/NewsCard';
import NewsApiKeyInput from '@/components/NewsApiKeyInput';
import { useNewsApi } from '@/hooks/useNewsApi';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Newspaper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Blog = () => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { articles, isLoading, error, refetch } = useNewsApi();
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is configured
    const apiKey = localStorage.getItem('news-api-key');
    if (!apiKey) {
      setShowApiKeyInput(true);
    }
  }, []);

  const handleApiKeySet = (apiKey: string) => {
    localStorage.setItem('news-api-key', apiKey);
    setShowApiKeyInput(false);
    window.location.reload(); // Reload to use the new API key
  };

  const handleRefresh = async () => {
    console.log('Refresh button clicked');
    try {
      toast({
        title: "Refreshing news...",
        description: "Fetching the latest culinary stories",
      });
      
      await refetch();
      
      toast({
        title: "News refreshed!",
        description: "Latest culinary news has been loaded",
      });
      
      console.log('News refresh completed successfully');
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast({
        title: "Refresh failed",
        description: "Unable to fetch latest news, showing cached content",
        variant: "destructive",
      });
    }
  };

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  if (showApiKeyInput) {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Latest Culinary News</h1>
              <p className="text-xl text-chef-warm-ivory/90 mb-6 font-inter">
                Configure your news API to get the latest culinary stories and trends
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <NewsApiKeyInput onApiKeySet={handleApiKeySet} />
        </div>
      </PageLayout>
    );
  }

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
              Stay updated with the latest culinary stories, trends, and insights from around the world
            </p>
            <Button 
              onClick={handleRefresh} 
              className="bg-chef-warm-ivory text-chef-charcoal hover:bg-chef-cream hover:text-chef-charcoal border-chef-warm-ivory border-2 font-semibold"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh News
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 mb-4">Failed to load news. Showing sample content.</p>
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
                  We couldn't find any culinary news at the moment. Please try refreshing or check back later.
                </p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Blog;
