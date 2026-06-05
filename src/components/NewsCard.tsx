import { Card, CardContent } from '@/components/ui/card';
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
      <Card className="premium-card overflow-hidden h-full col-span-1 md:col-span-2 lg:col-span-3">
        <div className="grid md:grid-cols-2 h-full">
          <div 
            className="bg-cover bg-center h-64 md:h-full p-8 flex items-center justify-center relative"
            style={{ backgroundImage: `url('${article.urlToImage}')` }}
          >
            <div className="text-background text-center bg-foreground/60 backdrop-blur-sm p-4 rounded-xl">
              <span className="px-3 py-1 bg-accent/20 rounded-full text-xs font-medium uppercase tracking-[0.18em] text-background inline-block mb-4">
                Featured News
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold font-playfair">{article.title}</h3>
            </div>
          </div>
          <CardContent className="p-8 bg-card">
            <div className="flex items-center gap-4 text-foreground/50 text-sm mb-4">
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
            <p className="text-foreground/60 mb-6 font-inter leading-relaxed">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.18em] text-foreground/40">
                {article.source.name}
              </span>
              <button 
                onClick={handleReadMore}
                className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Read full article
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="premium-card overflow-hidden h-full">
      <div className="grid grid-rows-[200px,1fr]">
        <div 
          className="bg-cover bg-center relative"
          style={{ backgroundImage: `url('${article.urlToImage}')` }}
        >
          <div className="w-full h-full bg-foreground/20 flex items-end p-4">
            <span className="px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/70 inline-block">
              {article.source.name}
            </span>
          </div>
        </div>
        <CardContent className="p-6 bg-card">
          <div className="flex items-center gap-4 text-foreground/50 text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-foreground font-playfair">
            {article.title}
          </h3>
          <p className="text-foreground/60 mb-4 line-clamp-3 font-inter text-sm leading-relaxed">
            {article.description}
          </p>
          <button 
            onClick={handleReadMore}
            className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 mt-auto w-full"
          >
            Read article
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </CardContent>
      </div>
    </Card>
  );
};

export default NewsCard;
