
import { supabase } from '@/integrations/supabase/client';

export class AIImageService {
  private static imageCache = new Map<string, string>();

  static async generateRelevantImage(title: string, description: string): Promise<string> {
    // Use free Unsplash images - no API key needed
    return this.getFallbackImage();
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
