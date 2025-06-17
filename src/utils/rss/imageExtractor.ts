
// Extract image from RSS content or HTML
export const extractImageFromContent = (content: string): string | null => {
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

export const extractImageFromRSSItem = (item: Element): string => {
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
  if (!imageUrl) {
    const description = item.querySelector('description, summary, content')?.textContent?.trim() || 
                      item.querySelector('content\\:encoded')?.textContent?.trim() || '';
    if (description) {
      const extractedImage = extractImageFromContent(description);
      if (extractedImage) {
        imageUrl = extractedImage;
      }
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
  
  return imageUrl;
};
