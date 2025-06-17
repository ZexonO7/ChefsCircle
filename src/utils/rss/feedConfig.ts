
export interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

export const CULINARY_RSS_FEEDS: RSSFeed[] = [
  {
    url: 'https://feeds.feedburner.com/foodandwine/recipes',
    name: 'Food & Wine',
    category: 'recipes'
  },
  {
    url: 'https://www.bonappetit.com/feed/rss',
    name: 'Bon Appétit',
    category: 'general'
  },
  {
    url: 'https://www.eater.com/rss/index.xml',
    name: 'Eater',
    category: 'news'
  },
  {
    url: 'https://feeds.feedburner.com/seriouseats/recipes',
    name: 'Serious Eats',
    category: 'recipes'
  },
  {
    url: 'https://www.epicurious.com/services/rss/recipes',
    name: 'Epicurious',
    category: 'recipes'
  },
  {
    url: 'https://www.foodnetwork.com/feeds/recipes.xml',
    name: 'Food Network',
    category: 'recipes'
  }
];

export const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
