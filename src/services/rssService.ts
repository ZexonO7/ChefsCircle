
import { CULINARY_RSS_FEEDS } from '@/utils/rss/feedConfig';
import { fetchRSSFeed } from '@/utils/rss/feedFetcher';
import { RSSItem } from '@/utils/rss/rssParser';

// Re-export types for backward compatibility
export type { RSSItem } from '@/utils/rss/rssParser';
export type { RSSFeed } from '@/utils/rss/feedConfig';
export { CULINARY_RSS_FEEDS } from '@/utils/rss/feedConfig';

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
