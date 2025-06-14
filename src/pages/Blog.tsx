
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import NewsCard from '@/components/NewsCard';
import NewsApiKeyInput from '@/components/NewsApiKeyInput';
import { useNewsApi } from '@/hooks/useNewsApi';
import { useState, useEffect } from 'react';
import { RefreshCw, Newspaper, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        description: "Fetching the latest culinary stories from NewsAPI",
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
        description: "Unable to fetch latest news from API",
        variant: "destructive",
      });
    }
  };

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  // Check if we have a valid API key
  const apiKey = localStorage.getItem('news-api-key');
  const hasValidApiKey = apiKey && apiKey !== '' && !apiKey.includes('YOUR_NEWS_API_KEY');

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
                Configure your NewsAPI key to get real-time culinary stories and trends
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
              {hasValidApiKey ? 
                "Real-time culinary stories, trends, and insights from NewsAPI" :
                "Stay updated with the latest culinary stories, trends, and insights from around the world"
              }
            </p>
            <button 
              onClick={handleRefresh} 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-chef-warm-ivory text-chef-charcoal font-semibold rounded-lg hover:bg-chef-cream transition-colors border-0"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {hasValidApiKey ? 'Refresh Live News' : 'Refresh News'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {!hasValidApiKey && (
          <Alert className="mb-8 border-chef-royal-blue/20 bg-chef-royal-blue/5">
            <AlertCircle className="h-4 w-4 text-chef-royal-blue" />
            <AlertDescription className="text-chef-charcoal">
              You're viewing sample news. To get real-time culinary news, please configure your NewsAPI key in the settings.
              <button 
                onClick={() => setShowApiKeyInput(true)}
                className="ml-2 text-chef-royal-blue hover:underline font-medium"
              >
                Add API Key
              </button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <div className="text-center mb-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to load news from NewsAPI. {hasValidApiKey ? 'Please check your API key and try again.' : 'Showing sample content.'}
              </AlertDescription>
            </Alert>
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
                  We couldn't find any culinary news at the moment. Please try refreshing or check your API configuration.
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
