
import { supabase } from '@/integrations/supabase/client';

export class AIImageService {
  private static imageCache = new Map<string, string>();
  private static aiEnabled = true;
  private static aiDisabledReason: string | null = null;

  private static disableAI(reason: string) {
    if (!this.aiEnabled) return;
    this.aiEnabled = false;
    this.aiDisabledReason = reason;
    console.warn('AI image generation disabled:', reason);
  }
  static async generateRelevantImage(title: string, description: string): Promise<string> {
    // Check cache first
    const cacheKey = `${title}-${description}`.substring(0, 100);
    if (this.imageCache.has(cacheKey)) {
      console.log('Returning cached AI image for:', title);
      return this.imageCache.get(cacheKey)!;
    }

    // If AI is disabled (e.g., credits exhausted), skip calling the function entirely.
    if (!this.aiEnabled) {
      console.log('AI image generation disabled, using fallback:', this.aiDisabledReason);
      return this.getFallbackImage();
    }

    try {
      console.log('Generating AI image for:', title);

      const { data, error } = await supabase.functions.invoke('generate-article-image', {
        body: { title, description },
      });

      if (error) {
        const status = (error as any)?.context?.status ?? (error as any)?.status;
        const message = String((error as any)?.message ?? '');
        const normalized = message.toLowerCase();

        console.error('Error calling generate-article-image function:', error);

        if (
          status === 402 ||
          normalized.includes('payment_required') ||
          normalized.includes('not enough credits')
        ) {
          this.disableAI('Not enough credits for AI image generation');
        }

        return this.getFallbackImage();
      }

      if (data?.imageUrl) {
        console.log('Successfully generated AI image for:', title);
        this.imageCache.set(cacheKey, data.imageUrl);
        return data.imageUrl;
      }

      if (data?.usesFallback || data?.error) {
        console.log('AI generation unavailable, using fallback:', data?.error);
        // If backend tells us it's unavailable, don't keep retrying every article.
        this.disableAI(String(data?.error ?? 'AI image generation unavailable'));
        return this.getFallbackImage();
      }

      return this.getFallbackImage();
    } catch (error) {
      const message = String((error as any)?.message ?? error ?? '');
      const normalized = message.toLowerCase();

      console.error('Failed to generate AI image:', error);

      if (normalized.includes('payment_required') || normalized.includes('not enough credits')) {
        this.disableAI('Not enough credits for AI image generation');
      }

      return this.getFallbackImage();
    }
  }

  private static getFallbackImage(): string {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  static clearCache(): void {
    this.imageCache.clear();
    console.log('AI image cache cleared');
  }
}
