import { useCallback } from 'react';


interface CachedImage {
  url: string;
  status: 'loading' | 'loaded' | 'error';
  timestamp: number;
  retryCount: number;
}

class ImageCacheManager {
  private cache = new Map<string, CachedImage>();
  private readonly MAX_CACHE_SIZE = 1000;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_RETRIES = 2;


  get(url: string): CachedImage | undefined {
    const cached = this.cache.get(url);
    
    if (cached && Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(url);
      return undefined;
    }
    
    return cached;
  }

  set(url: string, status: CachedImage['status'], retryCount = 0): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(url, {
      url,
      status,
      timestamp: Date.now(),
      retryCount
    });
  }

  shouldRetry(url: string): boolean {
    const cached = this.get(url);
    return !cached || (cached.status === 'error' && cached.retryCount < this.MAX_RETRIES);
  }


  incrementRetry(url: string): void {
    const cached = this.get(url);
    if (cached) {
      this.set(url, cached.status, cached.retryCount + 1);
    }
  }


  async preloadImages(urls: string[]): Promise<void> {
    const preloadPromises = urls.map(url => this.preloadSingleImage(url));
    await Promise.allSettled(preloadPromises);
  }


  private preloadSingleImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      const cached = this.get(url);
      if (cached && cached.status === 'loaded') {
        resolve();
        return;
      }

      this.set(url, 'loading');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      
      img.onload = () => {
        this.set(url, 'loaded');
        resolve();
      };
      
      img.onerror = () => {
        this.set(url, 'error');
        resolve();
      };
      
      setTimeout(() => {
        if (this.get(url)?.status === 'loading') {
          this.set(url, 'error');
          resolve();
        }
      }, 5000);
      
      img.src = url;
    });
  }


  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  clear(): void {
    this.cache.clear();
  }


  getStats(): { size: number; loaded: number; loading: number; error: number } {
    const entries = Array.from(this.cache.values());
    return {
      size: entries.length,
      loaded: entries.filter(e => e.status === 'loaded').length,
      loading: entries.filter(e => e.status === 'loading').length,
      error: entries.filter(e => e.status === 'error').length,
    };
  }
}

export const imageCache = new ImageCacheManager();


export function useImageCache() {
  const preloadImages = useCallback((urls: string[]) => {
    return imageCache.preloadImages(urls);
  }, []);

  const getImageStatus = useCallback((url: string) => {
    return imageCache.get(url);
  }, []);

  const getCacheStats = useCallback(() => {
    return imageCache.getStats();
  }, []);

  const clearCache = useCallback(() => {
    return imageCache.clear();
  }, []);

  return {
    preloadImages,
    getImageStatus,
    getCacheStats,
    clearCache,
  };
}