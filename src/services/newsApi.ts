
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

const getApiKey = (): string | null => {
  return localStorage.getItem('news-api-key');
};

export const fetchCulinaryNews = async (): Promise<NewsArticle[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey || apiKey === '' || apiKey.includes('YOUR_NEWS_API_KEY')) {
    // Return mock data when API key is not set or is placeholder
    return getMockCulinaryNews();
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=cooking OR culinary OR chef OR recipe OR food&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data.articles.filter(article => 
      article.title && 
      article.description && 
      article.urlToImage &&
      !article.title.includes('[Removed]')
    );
  } catch (error) {
    console.error('Error fetching culinary news:', error);
    return getMockCulinaryNews();
  }
};

const getMockCulinaryNews = (): NewsArticle[] => {
  return [
    {
      title: "Revolutionary Cooking Techniques Transform Modern Kitchens",
      description: "Discover how innovative cooking methods are changing the way professional chefs approach food preparation and presentation in today's culinary landscape.",
      url: "https://www.foodandwine.com/news/cooking-techniques-modern-kitchen-innovation",
      urlToImage: "/lovable-uploads/4d70a018-96e2-480a-9492-ccdb9dba7ce2.png",
      publishedAt: new Date().toISOString(),
      source: { name: "Food & Wine" },
      author: "Chef Maria Rodriguez"
    },
    {
      title: "Sustainable Ingredients: The Future of Culinary Arts",
      description: "Leading chefs share their insights on incorporating sustainable and locally-sourced ingredients into their menus for a better future.",
      url: "https://www.bonappetit.com/story/sustainable-cooking-local-ingredients",
      urlToImage: "/lovable-uploads/39671993-1bb4-4bb6-8819-3ca5c07c0042.png",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Bon Appétit" },
      author: "James Thompson"
    },
    {
      title: "Michelin Star Secrets: Behind the Scenes of Excellence",
      description: "Get an exclusive look at the preparation methods and quality standards that define Michelin-starred restaurants around the world.",
      url: "https://guide.michelin.com/en/article/dining-in/michelin-star-restaurants-behind-scenes",
      urlToImage: "/lovable-uploads/48ecf6e2-5a98-4a9d-af6f-ae2265cd4098.png",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Michelin Guide" },
      author: "Sophie Chen"
    },
    {
      title: "Plant-Based Revolution in Fine Dining",
      description: "How top restaurants are embracing plant-based cuisine without compromising on flavor or presentation standards.",
      url: "https://www.eater.com/fine-dining/plant-based-restaurant-trends",
      urlToImage: "/lovable-uploads/6739bd63-bf19-4abd-bb23-0b613bbf7ac8.png",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Eater" },
      author: "David Kim"
    },
    {
      title: "Global Street Food Influences Modern Cuisine",
      description: "Explore how traditional street food flavors are being elevated and incorporated into contemporary restaurant menus worldwide.",
      url: "https://www.saveur.com/culture/street-food-modern-restaurant-cuisine",
      urlToImage: "/lovable-uploads/7d120ee6-3614-4b75-9c35-716d54490d67.png",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Saveur" },
      author: "Ana Martinez"
    },
    {
      title: "The Rise of Fermentation in Contemporary Cooking",
      description: "Professional chefs are rediscovering ancient fermentation techniques to create bold new flavors and enhance nutritional value.",
      url: "https://www.epicurious.com/expert-advice/fermentation-techniques-modern-cooking",
      urlToImage: "/lovable-uploads/b862d5ae-6abb-44da-84f0-00a222f62906.png",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Epicurious" },
      author: "Michael Foster"
    }
  ];
};
