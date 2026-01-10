import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { generateImageFallbacks, EnhancedImageProps } from '@/lib/imageUtils';

export default function ProductImage({ 
  src, 
  alt, 
  title,
  isbn,
  sourceId,
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center",
  onImageLoad,
  onImageError
}: EnhancedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fallbacks = useMemo(() => {
    return generateImageFallbacks(title, isbn, sourceId);
  }, [title, isbn, sourceId]);

  useEffect(() => {
    const isInvalidUrl = src && (
      src.includes('images.worldofbooks.com') || 
      src.includes('worldofbooks.com/images') ||
      !src.startsWith('http')
    );

    if (src && !isInvalidUrl) {
      setCurrentSrc(src);
      setFallbackIndex(0);
      setImageError(false);
      setImageLoading(true);
      setRetryCount(0);
      return;
    }

    if ((!src || isInvalidUrl) && fallbacks.length > 0) {
      const firstFallback = fallbacks[0];
      
      if (process.env.NODE_ENV === 'development') {
        console.log(' Invalid/missing primary image src:', src, '-> using fallback:', firstFallback.url, 'Type:', firstFallback.type);
      }

      setCurrentSrc(firstFallback.url);
      setFallbackIndex(1);
      setImageError(false);
      setImageLoading(true);
      setRetryCount(0);
    }
  }, [src, fallbacks]);

  const handleImageError = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(' Image failed to load:', currentSrc, 'Retry:', retryCount, 'Fallback:', fallbackIndex);
    }
    
    if (onImageError) {
      onImageError(currentSrc || '');
    }

    const shouldRetry = currentSrc && 
      !currentSrc.includes('images.worldofbooks.com') && 
      !currentSrc.includes('/book-cover-placeholder.svg') &&
      retryCount === 0;

    if (shouldRetry) {
      setRetryCount(1);
      setImageLoading(true);
      const separator = (currentSrc || '').includes('?') ? '&' : '?';
      setCurrentSrc(`${currentSrc}${separator}t=${Date.now()}`);
      return;
    }

    if (fallbackIndex < fallbacks.length) {
      const nextFallback = fallbacks[fallbackIndex];
      if (process.env.NODE_ENV === 'development') {
        console.log(' Trying fallback:', nextFallback.url, 'Type:', nextFallback.type);
      }
      
      setCurrentSrc(nextFallback.url);
      setFallbackIndex(fallbackIndex + 1);
      setRetryCount(0);
      setImageLoading(true);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(' All fallbacks exhausted, showing error state');
    }
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(' Image loaded successfully:', currentSrc);
    }
    setImageLoading(false);
    setImageError(false);
    
    if (onImageLoad && currentSrc) {
      onImageLoad(currentSrc);
    }
  };

  if (!currentSrc || imageError) {
    return (
      <div className={fallbackClassName}>
        <div className="text-center p-4">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Cover Not Available</p>
          {title && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{title}</p>
          )}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-red-500 mt-1">
              <p>Original: {src || 'None'}</p>
              <p>Tried {fallbackIndex} fallbacks</p>
              {isbn && <p>ISBN: {isbn}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className={fallbackClassName}>
          <div className="animate-pulse bg-gray-300 w-12 h-12 rounded"></div>
        </div>
      )}
      <Image
        src={currentSrc}
        alt={alt}
        width={300}
        height={400}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        unoptimized={currentSrc.includes('/book-cover-placeholder.svg') || currentSrc.includes('openlibrary.org')}
        key={currentSrc}
      />
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
          {currentSrc?.includes('openlibrary.org') ? 'OL' : 
           currentSrc?.includes('/book-cover-placeholder.svg') ? 'Local' : 'Other'}
        </div>
      )}
    </div>
  );
}