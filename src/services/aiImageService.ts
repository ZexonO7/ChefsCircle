
import { supabase } from '@/integrations/supabase/client';

export class AIImageService {
  private static imageCache = new Map<string, string>();

  static async generateRelevantImage(title: string, description: string): Promise<string> {
    const cacheKey = `${title}_${description}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      const cachedUrl = this.imageCache.get(cacheKey)!;
      console.log(`Using cached AI-generated image for: "${title}"`);
      return cachedUrl;
    }

    try {
      console.log(`Generating AI image for article: "${title}"`);
      
      const { data, error } = await supabase.functions.invoke('generate-article-image', {
        body: { title, description }
      });

      if (error) {
        console.warn('Image generation unavailable, using fallback:', error.message);
        return this.getFallbackImage();
      }

      // Check if edge function returned a fallback flag (e.g., HuggingFace credits exhausted)
      if (data?.usesFallback) {
        console.warn('Image generation unavailable (credits/payment issue), using fallback');
        return this.getFallbackImage();
      }

      if (data?.success && data?.imageUrl) {
        console.log(`Successfully generated AI image for: "${title}"`);
        
        // Cache the result
        this.imageCache.set(cacheKey, data.imageUrl);
        
        return data.imageUrl;
      } else {
        console.log(`No image generated for: "${title}"`);
        return this.getFallbackImage();
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      return this.getFallbackImage();
    }
  }

  private static getFallbackImage(): string {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  static clearCache(): void {
    this.imageCache.clear();
    console.log('AI image cache cleared');
  }
}
