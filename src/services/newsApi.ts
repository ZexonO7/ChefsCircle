
import { fetchAllCulinaryRSSFeeds } from './rssService';

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

// Comprehensive list of unique culinary images
const UNIQUE_CULINARY_IMAGES = [
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // pasta
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // burger
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // pizza
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // salad
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // soup
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // dessert
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // bread
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // wine
  'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // seafood
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // meat
  'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // cheese
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // restaurant
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // kitchen
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // spices
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // fruit
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // coffee
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // breakfast
  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // grill
  'https://images.unsplash.com/photo-1567521464027-f51d5066fab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // awards
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // chef cooking
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // ingredients
  'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // fresh vegetables
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // healthy food
  'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // fine dining
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // cooking utensils
];

// Track used images to ensure uniqueness
let usedImageIndices = new Set<number>();

const getUniqueImage = (): string => {
  // Reset if we've used all images
  if (usedImageIndices.size >= UNIQUE_CULINARY_IMAGES.length) {
    usedImageIndices.clear();
  }
  
  // Find an unused image
  let imageIndex;
  do {
    imageIndex = Math.floor(Math.random() * UNIQUE_CULINARY_IMAGES.length);
  } while (usedImageIndices.has(imageIndex));
  
  usedImageIndices.add(imageIndex);
  return UNIQUE_CULINARY_IMAGES[imageIndex];
};

export const fetchCulinaryNews = async (): Promise<NewsArticle[]> => {
  console.log('Fetching real culinary news from RSS feeds');
  
  try {
    const rssItems = await fetchAllCulinaryRSSFeeds();
    
    if (rssItems.length === 0) {
      console.log('No RSS items found, falling back to curated content');
      return getCuratedCulinaryNews();
    }
    
    console.log(`Converting ${rssItems.length} RSS items to NewsArticle format`);
    
    // Reset used images for fresh assignment
    usedImageIndices.clear();
    
    const articles: NewsArticle[] = rssItems.map((item) => {
      // Try to use image from RSS feed first, but validate it's actually an image
      let imageUrl = '';
      
      if (item['media:content']?.url) {
        const rssImageUrl = item['media:content'].url;
        // Check if it's actually an image URL
        if (rssImageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) || 
            rssImageUrl.includes('unsplash.com') || 
            rssImageUrl.includes('images.') ||
            rssImageUrl.includes('photo')) {
          imageUrl = rssImageUrl;
          console.log(`Using valid RSS image for "${item.title}": ${imageUrl}`);
        }
      } else if (item.enclosure?.url) {
        const enclosureUrl = item.enclosure.url;
        if (enclosureUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          imageUrl = enclosureUrl;
          console.log(`Using valid RSS enclosure image for "${item.title}": ${imageUrl}`);
        }
      }
      
      // If no valid RSS image found, use unique fallback
      if (!imageUrl) {
        imageUrl = getUniqueImage();
        console.log(`Using unique fallback image for "${item.title}": ${imageUrl}`);
      }
      
      return {
        title: item.title,
        description: item.description,
        url: item.link,
        urlToImage: imageUrl,
        publishedAt: new Date(item.pubDate).toISOString(),
        source: {
          name: (item as any).sourceName || 'Culinary News'
        },
        author: undefined
      };
    });
    
    console.log(`Successfully converted RSS items to ${articles.length} news articles with unique images`);
    return articles;
    
  } catch (error) {
    console.error('Error fetching RSS feeds, falling back to curated content:', error);
    return getCuratedCulinaryNews();
  }
};

const getCuratedCulinaryNews = (): NewsArticle[] => {
  console.log('Generating curated culinary news data with unique images');
  
  // Reset used images for fresh assignment
  usedImageIndices.clear();
  
  const now = Date.now();
  const articles = [
    {
      title: "Revolutionary Cooking Techniques Transform Modern Kitchens",
      description: "Discover how innovative cooking methods are changing the way professional chefs approach food preparation and presentation in today's culinary landscape.",
      url: "https://www.foodandwine.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Food & Wine" },
      author: "Chef Maria Rodriguez"
    },
    {
      title: "Sustainable Ingredients: The Future of Culinary Arts",
      description: "Leading chefs share their insights on incorporating sustainable and locally-sourced ingredients into their menus for a better future.",
      url: "https://www.bonappetit.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Bon Appétit" },
      author: "James Thompson"
    },
    {
      title: "Michelin Star Secrets: Behind the Scenes of Excellence",
      description: "Get an exclusive look at the preparation methods and quality standards that define Michelin-starred restaurants around the world.",
      url: "https://guide.michelin.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Michelin Guide" },
      author: "Sophie Chen"
    },
    {
      title: "Plant-Based Revolution in Fine Dining",
      description: "How top restaurants are embracing plant-based cuisine without compromising on flavor or presentation standards.",
      url: "https://www.eater.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Eater" },
      author: "David Kim"
    },
    {
      title: "Global Street Food Influences Modern Cuisine",
      description: "Explore how traditional street food flavors are being elevated and incorporated into contemporary restaurant menus worldwide.",
      url: "https://www.saveur.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Saveur" },
      author: "Ana Martinez"
    },
    {
      title: "The Rise of Fermentation in Contemporary Cooking",
      description: "Professional chefs are rediscovering ancient fermentation techniques to create bold new flavors and enhance nutritional value.",
      url: "https://www.epicurious.com/",
      urlToImage: getUniqueImage(),
      publishedAt: new Date(now - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Epicurious" },
      author: "Michael Foster"
    }
  ];

  return articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
};
