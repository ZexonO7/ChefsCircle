
export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
}

export class ImageService {
  private static readonly UNSPLASH_ACCESS_KEY = 'your-unsplash-access-key-here';
  private static readonly UNSPLASH_API_URL = 'https://api.unsplash.com';
  
  // Cache to avoid repeated API calls for similar topics
  private static imageCache = new Map<string, string>();

  // Extract keywords from article title and description for image search
  static extractKeywords(title: string, description: string): string {
    // Combine title and description
    const text = `${title} ${description}`.toLowerCase();
    
    // Remove common words and extract meaningful keywords
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    const words = text.split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !commonWords.includes(word))
      .filter(word => /^[a-zA-Z]+$/.test(word));
    
    // Take the first 3-5 most relevant words
    const keywords = words.slice(0, 4).join(' ');
    
    // Add culinary context if not already present
    const culinaryTerms = ['cooking', 'chef', 'restaurant', 'kitchen', 'food', 'culinary', 'recipe', 'ingredient'];
    const hasCulinaryContext = culinaryTerms.some(term => text.includes(term));
    
    if (!hasCulinaryContext) {
      return `${keywords} cooking food`;
    }
    
    return keywords || 'cooking food';
  }

  static async fetchRelevantImage(title: string, description: string): Promise<string> {
    const searchQuery = this.extractKeywords(title, description);
    
    // Check cache first
    if (this.imageCache.has(searchQuery)) {
      const cachedUrl = this.imageCache.get(searchQuery)!;
      console.log(`Using cached image for query "${searchQuery}": ${cachedUrl}`);
      return cachedUrl;
    }

    try {
      console.log(`Fetching relevant image for: "${searchQuery}"`);
      
      // Use a free image service API (we'll use Unsplash's free tier)
      const response = await fetch(
        `${this.UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${this.UNSPLASH_ACCESS_KEY}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data: UnsplashResponse = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Get a random image from the results to add variety
        const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
        const selectedImage = data.results[randomIndex];
        const imageUrl = selectedImage.urls.regular;
        
        console.log(`Found relevant image for "${searchQuery}": ${imageUrl}`);
        
        // Cache the result
        this.imageCache.set(searchQuery, imageUrl);
        
        return imageUrl;
      } else {
        console.log(`No images found for query: "${searchQuery}"`);
        return this.getFallbackImage();
      }
    } catch (error) {
      console.error('Error fetching relevant image:', error);
      return this.getFallbackImage();
    }
  }

  // Fallback to a high-quality generic culinary image
  private static getFallbackImage(): string {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  // Alternative method using Lorem Picsum for food-related images
  static async fetchRelevantImageAlternative(title: string, description: string): Promise<string> {
    const searchQuery = this.extractKeywords(title, description);
    
    // Check cache first
    if (this.imageCache.has(searchQuery)) {
      return this.imageCache.get(searchQuery)!;
    }

    try {
      console.log(`Fetching alternative relevant image for: "${searchQuery}"`);
      
      // Use Lorem Picsum with a seed based on the search query for consistency
      const seed = searchQuery.replace(/\s+/g, '-').toLowerCase();
      const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
      
      console.log(`Generated alternative image URL: ${imageUrl}`);
      
      // Cache the result
      this.imageCache.set(searchQuery, imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating alternative image:', error);
      return this.getFallbackImage();
    }
  }
}
