
interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid?: string;
  'media:content'?: {
    url: string;
  };
  enclosure?: {
    url: string;
  };
}

interface RSSChannel {
  title: string;
  items: RSSItem[];
}

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

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Extract image from RSS content or HTML
const extractImageFromContent = (content: string): string | null => {
  try {
    // Try to find image URLs in the content
    const imgRegex = /<img[^>]+src="([^">]+)"/gi;
    const match = imgRegex.exec(content);
    if (match && match[1]) {
      return match[1];
    }
    
    // Try to find any image URLs
    const urlRegex = /https?:\/\/[^\s<>"]+\.(jpg|jpeg|png|gif|webp)/gi;
    const urlMatch = urlRegex.exec(content);
    if (urlMatch && urlMatch[0]) {
      return urlMatch[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting image from content:', error);
    return null;
  }
};

export const fetchRSSFeed = async (feedUrl: string, sourceName: string): Promise<RSSItem[]> => {
  try {
    console.log(`Fetching RSS feed from ${sourceName}: ${feedUrl}`);
    
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log(`Successfully fetched RSS feed from ${sourceName}`);
    
    return parseRSSFeed(xmlText, sourceName);
  } catch (error) {
    console.error(`Error fetching RSS feed from ${sourceName}:`, error);
    return [];
  }
};

export const parseRSSFeed = (xmlText: string, sourceName: string): RSSItem[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return [];
    }
    
    const items = xmlDoc.querySelectorAll('item, entry');
    console.log(`Found ${items.length} items in ${sourceName} RSS feed`);
    
    const rssItems: RSSItem[] = [];
    
    items.forEach((item, index) => {
      if (index >= 10) return; // Limit to 10 items per feed
      
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const description = item.querySelector('description, summary, content')?.textContent?.trim() || 
                         item.querySelector('content\\:encoded')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || 
                   item.querySelector('link')?.getAttribute('href') || '';
      const pubDate = item.querySelector('pubDate, published, updated')?.textContent?.trim() || '';
      const guid = item.querySelector('guid, id')?.textContent?.trim() || '';
      
      // Enhanced image extraction from multiple sources
      let imageUrl = '';
      
      // 1. Try media:content
      const mediaContent = item.querySelector('media\\:content, content');
      if (mediaContent && mediaContent.getAttribute('url')) {
        imageUrl = mediaContent.getAttribute('url') || '';
      }
      
      // 2. Try media:thumbnail
      if (!imageUrl) {
        const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
        if (mediaThumbnail && mediaThumbnail.getAttribute('url')) {
          imageUrl = mediaThumbnail.getAttribute('url') || '';
        }
      }
      
      // 3. Try enclosure
      if (!imageUrl) {
        const enclosure = item.querySelector('enclosure[type^="image"]');
        if (enclosure && enclosure.getAttribute('url')) {
          imageUrl = enclosure.getAttribute('url') || '';
        }
      }
      
      // 4. Extract from content/description HTML
      if (!imageUrl && description) {
        const extractedImage = extractImageFromContent(description);
        if (extractedImage) {
          imageUrl = extractedImage;
        }
      }
      
      // 5. Extract from content:encoded
      if (!imageUrl) {
        const contentEncoded = item.querySelector('content\\:encoded')?.textContent;
        if (contentEncoded) {
          const extractedImage = extractImageFromContent(contentEncoded);
          if (extractedImage) {
            imageUrl = extractedImage;
          }
        }
      }
      
      if (title && description && link && pubDate) {
        rssItems.push({
          title,
          description: cleanDescription(description),
          link,
          pubDate,
          guid: guid || link,
          ...(imageUrl && { 'media:content': { url: imageUrl } })
        });
      }
    });
    
    return rssItems;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${sourceName}:`, error);
    return [];
  }
};

const cleanDescription = (description: string): string => {
  // Remove HTML tags and clean up the description
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = description;
  const cleanText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Limit to reasonable length
  return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
};

export const fetchAllCulinaryRSSFeeds = async (): Promise<RSSItem[]> => {
  console.log('Fetching all culinary RSS feeds...');
  
  const feedPromises = CULINARY_RSS_FEEDS.map(feed => 
    fetchRSSFeed(feed.url, feed.name)
  );
  
  try {
    const results = await Promise.allSettled(feedPromises);
    const allItems: RSSItem[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const feedInfo = CULINARY_RSS_FEEDS[index];
        const items = result.value.map(item => ({
          ...item,
          sourceName: feedInfo.name,
          sourceCategory: feedInfo.category
        }));
        allItems.push(...items);
      } else {
        console.error(`Failed to fetch from ${CULINARY_RSS_FEEDS[index].name}:`, result.reason);
      }
    });
    
    // Sort by publication date (newest first)
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    
    console.log(`Successfully fetched ${allItems.length} total RSS items`);
    return allItems.slice(0, 20); // Return top 20 items
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return [];
  }
};
