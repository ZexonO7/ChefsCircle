
const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // User will need to add this
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
  if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
    // Return mock data when API key is not set
    return getMockCulinaryNews();
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=cooking OR culinary OR chef OR recipe OR food&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
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
      description: "Discover how innovative cooking methods are changing the way professional chefs approach food preparation and presentation.",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date().toISOString(),
      source: { name: "Culinary Today" },
      author: "Chef Maria Rodriguez"
    },
    {
      title: "Sustainable Ingredients: The Future of Culinary Arts",
      description: "Leading chefs share their insights on incorporating sustainable and locally-sourced ingredients into their menus.",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Green Kitchen" },
      author: "James Thompson"
    },
    {
      title: "Michelin Star Secrets: Behind the Scenes of Excellence",
      description: "Get an exclusive look at the preparation methods and quality standards that define Michelin-starred restaurants.",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Fine Dining Weekly" },
      author: "Sophie Chen"
    }
  ];
};
