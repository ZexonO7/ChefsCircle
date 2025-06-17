
import { CORS_PROXY } from './feedConfig';
import { parseRSSFeed, RSSItem } from './rssParser';

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
