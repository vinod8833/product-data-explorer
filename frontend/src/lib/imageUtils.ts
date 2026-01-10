export interface ImageFallback {
  url: string;
  type: 'openlibrary' | 'placeholder';
}


export function generateImageFallbacks(
  title?: string,
  isbn?: string,
  sourceId?: string
): ImageFallback[] {
  const fallbacks: ImageFallback[] = [];

  if (isbn) {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    
    fallbacks.push({
      url: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`,
      type: 'openlibrary'
    });
    fallbacks.push({
      url: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`,
      type: 'openlibrary'
    });
  }

  if (title) {
    const cleanTitle = title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);
    
    fallbacks.push({
      url: `https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`,
      type: 'openlibrary'
    });
  }

  fallbacks.push({
    url: '/book-cover-placeholder.svg',
    type: 'placeholder'
  });

  return fallbacks;
}

export async function testImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' 
    });
    return response.ok;
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.search.includes('debug=images')) {
      console.warn('Image test failed:', url, error);
    }
    return false;
  }
}


export async function getBestImageUrl(
  primaryUrl?: string,
  title?: string,
  isbn?: string,
  sourceId?: string
): Promise<string | undefined> {
  if (primaryUrl) {
    const isAccessible = await testImageUrl(primaryUrl);
    if (isAccessible) {
      return primaryUrl;
    }
  }

  if (title) {
    const fallbacks = generateImageFallbacks(title, isbn, sourceId);
    
    for (const fallback of fallbacks) {
      const isAccessible = await testImageUrl(fallback.url);
      if (isAccessible) {
        return fallback.url;
      }
    }
  }

  return undefined;
}

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    setTimeout(() => resolve(false), 3000);
    
    img.src = src;
  });
}

export interface EnhancedImageProps {
  src?: string;
  alt: string;
  title?: string;
  isbn?: string;
  sourceId?: string;
  className?: string;
  fallbackClassName?: string;
  onImageLoad?: (src: string) => void;
  onImageError?: (src: string) => void;
}