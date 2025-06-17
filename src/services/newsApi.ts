
import { fetchAllCulinaryRSSFeeds } from './rssService';
import { AIImageService } from './aiImageService';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const fetchCulinaryNews = async (): Promise<NewsArticle[]> => {
  console.log('Fetching culinary news with AI-generated relevant images');
  
  try {
    const rssItems = await fetchAllCulinaryRSSFeeds();
    
    if (rssItems.length === 0) {
      console.log('No RSS items found, falling back to curated content');
      return getCuratedCulinaryNewsWithAIImages();
    }
    
    console.log(`Converting ${rssItems.length} RSS items to NewsArticle format with AI-generated images`);
    
    const articles: NewsArticle[] = [];
    
    for (const item of rssItems) {
      // Generate AI image based on article content
      console.log(`Generating AI image for: "${item.title}"`);
      const aiGeneratedImage = await AIImageService.generateRelevantImage(item.title, item.description);
      
      articles.push({
        title: item.title,
        description: item.description,
        url: item.link,
        urlToImage: aiGeneratedImage,
        publishedAt: new Date(item.pubDate).toISOString(),
        source: {
          name: (item as any).sourceName || 'Culinary News'
        },
        author: undefined
      });
    }
    
    console.log(`Successfully converted RSS items to ${articles.length} news articles with AI-generated images`);
    return articles;
    
  } catch (error) {
    console.error('Error fetching RSS feeds, falling back to curated content:', error);
    return getCuratedCulinaryNewsWithAIImages();
  }
};

const getCuratedCulinaryNewsWithAIImages = async (): Promise<NewsArticle[]> => {
  console.log('Generating curated culinary news data with AI-generated images');
  
  const now = Date.now();
  const articlesData = [
    {
      title: "Revolutionary Cooking Techniques Transform Modern Kitchens",
      description: "Discover how innovative cooking methods are changing the way professional chefs approach food preparation and presentation in today's culinary landscape.",
      url: "https://www.foodandwine.com/",
      publishedAt: new Date(now - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Food & Wine" },
      author: "Chef Maria Rodriguez"
    },
    {
      title: "Sustainable Ingredients: The Future of Culinary Arts",
      description: "Leading chefs share their insights on incorporating sustainable and locally-sourced ingredients into their menus for a better future.",
      url: "https://www.bonappetit.com/",
      publishedAt: new Date(now - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Bon Appétit" },
      author: "James Thompson"
    },
    {
      title: "Michelin Star Secrets: Behind the Scenes of Excellence",
      description: "Get an exclusive look at the preparation methods and quality standards that define Michelin-starred restaurants around the world.",
      url: "https://guide.michelin.com/",
      publishedAt: new Date(now - Math.random() * 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Michelin Guide" },
      author: "Sophie Chen"
    },
    {
      title: "Plant-Based Revolution in Fine Dining",
      description: "How top restaurants are embracing plant-based cuisine without compromising on flavor or presentation standards.",
      url: "https://www.eater.com/",
      publishedAt: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Eater" },
      author: "David Kim"
    },
    {
      title: "Global Street Food Influences Modern Cuisine",
      description: "Explore how traditional street food flavors are being elevated and incorporated into contemporary restaurant menus worldwide.",
      url: "https://www.saveur.com/",
      publishedAt: new Date(now - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Saveur" },
      author: "Ana Martinez"
    },
    {
      title: "The Rise of Fermentation in Contemporary Cooking",
      description: "Professional chefs are rediscovering ancient fermentation techniques to create bold new flavors and enhance nutritional value.",
      url: "https://www.epicurious.com/",
      publishedAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Epicurious" },
      author: "Michael Foster"
    }
  ];

  // Generate AI images for each curated article
  const articles: NewsArticle[] = [];
  for (const articleData of articlesData) {
    const aiGeneratedImage = await AIImageService.generateRelevantImage(
      articleData.title, 
      articleData.description
    );
    
    articles.push({
      ...articleData,
      urlToImage: aiGeneratedImage
    });
  }

  return articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
};
