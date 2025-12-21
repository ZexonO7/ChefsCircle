
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { NewsArticle } from '@/services/newsApi';
import { useToast } from '@/hooks/use-toast';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReadMore = () => {
    console.log('Read more button clicked for article:', article.title);
    console.log('Article URL:', article.url);
    
    if (article.url && article.url !== '#') {
      try {
        console.log('Opening URL in new tab:', article.url);
        window.open(article.url, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "Opening article",
          description: `Redirecting to ${article.source.name}`,
        });
      } catch (error) {
        console.error('Error opening URL:', error);
        toast({
          title: "Unable to open article",
          description: "There was an issue opening the article link",
          variant: "destructive",
        });
      }
    } else {
      console.log('No valid URL found for article');
      toast({
        title: "Article unavailable",
        description: "This article link is not available",
        variant: "destructive",
      });
    }
  };

  if (featured) {
    return (
      <Card className="overflow-hidden hover:shadow-chef-luxury transition-shadow duration-300 h-full border border-chef-royal-green/20 col-span-1 md:col-span-2 lg:col-span-3 bg-white">
        <div className="grid md:grid-cols-2 h-full">
          <div 
            className="bg-cover bg-center h-64 md:h-full p-8 flex items-center justify-center relative"
            style={{ backgroundImage: `url('${article.urlToImage}')` }}
          >
            {/* ChefsCircle Branding */}
            <div className="absolute top-4 right-4 bg-chef-gold/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
              <span className="text-chef-charcoal font-playfair font-bold text-sm">ChefsCircle</span>
            </div>
            <div className="text-white text-center bg-chef-charcoal/60 backdrop-blur-sm p-4 rounded-lg">
              <span className="px-3 py-1 bg-chef-royal-blue/20 rounded-full text-sm font-medium inline-block mb-4">
                Featured News
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-playfair">{article.title}</h3>
            </div>
          </div>
          <CardContent className="p-8 bg-chef-cream">
            <div className="flex items-center gap-4 text-chef-charcoal/60 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </div>
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
              )}
            </div>
            <p className="text-chef-charcoal/70 mb-6 font-inter">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-chef-royal-blue font-medium">
                {article.source.name}
              </span>
              <button 
                onClick={handleReadMore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-chef-royal-blue text-white font-medium rounded-lg hover:bg-chef-royal-blue/90 transition-colors group border-0"
              >
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-chef-luxury transition-shadow duration-300 h-full border border-chef-royal-green/20 bg-white">
      <div className="grid grid-rows-[200px,1fr]">
        <div 
          className="bg-cover bg-center relative"
          style={{ backgroundImage: `url('${article.urlToImage}')` }}
        >
          {/* ChefsCircle Branding */}
          <div className="absolute top-3 right-3 bg-chef-gold/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-lg">
            <span className="text-chef-charcoal font-playfair font-bold text-xs">ChefsCircle</span>
          </div>
          <div className="w-full h-full bg-chef-charcoal/20 flex items-center justify-center">
            <span className="px-3 py-1 bg-chef-royal-blue/20 backdrop-blur-sm rounded-full text-sm font-medium text-white inline-block">
              {article.source.name}
            </span>
          </div>
        </div>
        <CardContent className="p-6 bg-chef-cream">
          <div className="flex items-center gap-4 text-chef-charcoal/60 text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2 text-chef-charcoal font-playfair">
            {article.title}
          </h3>
          <p className="text-chef-charcoal/70 mb-4 line-clamp-3 font-inter">
            {article.description}
          </p>
          <button 
            onClick={handleReadMore}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-chef-royal-blue text-white font-medium rounded-lg hover:bg-chef-royal-blue/90 transition-colors group mt-auto w-full border-0"
          >
            Read Article
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </CardContent>
      </div>
    </Card>
  );
};

export default NewsCard;
