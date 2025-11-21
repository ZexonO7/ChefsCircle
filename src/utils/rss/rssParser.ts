
import { extractImageFromRSSItem } from './imageExtractor';

export interface RSSItem {
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

const cleanDescription = (description: string): string => {
  // Safely parse HTML without executing scripts using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');
  const cleanText = doc.body.textContent || '';
  
  // Limit to reasonable length
  return cleanText.length > 200 ? cleanText.substring(0, 200) + '...' : cleanText;
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
      
      const imageUrl = extractImageFromRSSItem(item);
      
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
