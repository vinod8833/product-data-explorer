import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface SimpleProductImageProps {
  src?: string;
  alt: string;
  title?: string;
  isbn?: string;
  sourceId?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function SimpleProductImage({ 
  src, 
  alt, 
  title,
  isbn,
  sourceId,
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full flex items-center justify-center"
}: SimpleProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const generateFallbacks = () => {
    const fallbacks = [];
    
    if (isbn) {
      const cleanIsbn = isbn.replace(/[-\s]/g, '');
      fallbacks.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`);
      fallbacks.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`);
    }
    
    if (title) {
      const cleanTitle = title.slice(0, 20).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '+');
      fallbacks.push(`https://dummyimage.com/300x400/6b7280/ffffff&text=${cleanTitle}`);
    }
    
    fallbacks.push('https://dummyimage.com/300x400/9ca3af/ffffff&text=No+Image');
    
    return fallbacks;
  };

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setImageError(false);
      setImageLoading(true);
      setFallbackIndex(0);
    }
  }, [src]);

  const handleImageError = () => {
    console.log('Image failed:', currentSrc, 'Fallback index:', fallbackIndex);
    
    const fallbacks = generateFallbacks();
    
    if (fallbackIndex < fallbacks.length) {
      const nextFallback = fallbacks[fallbackIndex];
      console.log('Trying fallback:', nextFallback);
      
      setCurrentSrc(nextFallback);
      setFallbackIndex(fallbackIndex + 1);
      setImageLoading(true);
      return;
    }

    console.log('All fallbacks exhausted');
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', currentSrc);
    setImageLoading(false);
    setImageError(false);
  };

  if (!currentSrc || imageError) {
    return (
      <div className={fallbackClassName}>
        <div className="text-center p-4">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No Image Available</p>
          {title && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{title}</p>
          )}
          <div className="text-xs text-red-500 mt-1">
            <p>Failed: {src}</p>
            <p>Tried {fallbackIndex} fallbacks</p>
          </div>
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
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${imageLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        referrerPolicy="no-referrer"
        key={currentSrc}
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <div className="absolute top-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
        {currentSrc?.includes('openlibrary.org') ? 'OL' : 
         currentSrc?.includes('archive.org') ? 'Archive' :
         currentSrc?.includes('dummyimage.com') ? 'Dummy' : 'Other'}
      </div>
    </div>
  );
}