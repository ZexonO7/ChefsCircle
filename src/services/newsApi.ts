
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
  
  console.log('Fetching culinary news, API key present:', !!apiKey);
  
  if (!apiKey || apiKey === '' || apiKey.includes('YOUR_NEWS_API_KEY')) {
    console.log('No valid API key found, using mock data');
    return getMockCulinaryNews();
  }

  try {
    console.log('Making API request to NewsAPI...');
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=(cooking OR culinary OR chef OR recipe OR food OR restaurant OR kitchen) AND (news OR industry OR trend)&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
    );

    console.log('NewsAPI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NewsAPI error response:', errorText);
      throw new Error(`News API error: ${response.status} - ${errorText}`);
    }

    const data: NewsResponse = await response.json();
    console.log('Raw NewsAPI response:', data);
    console.log('Total results from API:', data.totalResults);
    console.log('Articles received:', data.articles?.length || 0);

    if (!data.articles || data.articles.length === 0) {
      console.log('No articles returned from API, using mock data');
      return getMockCulinaryNews();
    }

    // Filter out removed articles and ensure we have valid content
    const validArticles = data.articles.filter(article => 
      article.title && 
      article.description && 
      article.url &&
      article.urlToImage &&
      !article.title.includes('[Removed]') &&
      !article.description.includes('[Removed]') &&
      article.title.toLowerCase() !== 'removed' &&
      article.description.toLowerCase() !== 'removed'
    );

    console.log('Valid articles after filtering:', validArticles.length);

    if (validArticles.length === 0) {
      console.log('No valid articles after filtering, using mock data');
      return getMockCulinaryNews();
    }

    console.log('Successfully fetched real culinary news:', validArticles.length, 'articles');
    return validArticles;

  } catch (error) {
    console.error('Error fetching culinary news from API:', error);
    console.log('Falling back to mock data due to error');
    return getMockCulinaryNews();
  }
};

const getMockCulinaryNews = (): NewsArticle[] => {
  console.log('Generating mock culinary news data');
  return [
    {
      title: "Revolutionary Cooking Techniques Transform Modern Kitchens",
      description: "Discover how innovative cooking methods are changing the way professional chefs approach food preparation and presentation in today's culinary landscape.",
      url: "https://www.foodandwine.com/",
      urlToImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date().toISOString(),
      source: { name: "Food & Wine" },
      author: "Chef Maria Rodriguez"
    },
    {
      title: "Sustainable Ingredients: The Future of Culinary Arts",
      description: "Leading chefs share their insights on incorporating sustainable and locally-sourced ingredients into their menus for a better future.",
      url: "https://www.bonappetit.com/",
      urlToImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Bon Appétit" },
      author: "James Thompson"
    },
    {
      title: "Michelin Star Secrets: Behind the Scenes of Excellence",
      description: "Get an exclusive look at the preparation methods and quality standards that define Michelin-starred restaurants around the world.",
      url: "https://guide.michelin.com/",
      urlToImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Michelin Guide" },
      author: "Sophie Chen"
    },
    {
      title: "Plant-Based Revolution in Fine Dining",
      description: "How top restaurants are embracing plant-based cuisine without compromising on flavor or presentation standards.",
      url: "https://www.eater.com/",
      urlToImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Eater" },
      author: "David Kim"
    },
    {
      title: "Global Street Food Influences Modern Cuisine",
      description: "Explore how traditional street food flavors are being elevated and incorporated into contemporary restaurant menus worldwide.",
      url: "https://www.saveur.com/",
      urlToImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Saveur" },
      author: "Ana Martinez"
    },
    {
      title: "The Rise of Fermentation in Contemporary Cooking",
      description: "Professional chefs are rediscovering ancient fermentation techniques to create bold new flavors and enhance nutritional value.",
      url: "https://www.epicurious.com/",
      urlToImage: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Epicurious" },
      author: "Michael Foster"
    }
  ];
};
