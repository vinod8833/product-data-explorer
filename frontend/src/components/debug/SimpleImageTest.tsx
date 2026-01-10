'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SimpleImageTestProps {
  src?: string;
  title?: string;
  isbn?: string;
}

export default function SimpleImageTest({ src, title, isbn }: SimpleImageTestProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const testUrls = [
    src, // Original URL
    isbn ? `https://covers.openlibrary.org/b/isbn/${isbn.replace(/[-\s]/g, '')}-L.jpg` : null,
    '/book-cover-placeholder.svg'
  ].filter(Boolean) as string[];
  
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const currentUrl = testUrls[currentUrlIndex];
  
  const handleError = () => {
    console.log('SimpleImageTest: Image failed:', currentUrl);
    setImageError(true);
    
    if (currentUrlIndex < testUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      setImageError(false);
      setImageLoaded(false);
    }
  };
  
  const handleLoad = () => {
    console.log('SimpleImageTest: Image loaded:', currentUrl);
    setImageLoaded(true);
    setImageError(false);
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-blue-100 p-2 text-xs">
      <div>Testing: {currentUrl}</div>
      <div>Status: {imageLoaded ? ' Loaded' : imageError ? ' Error' : 'Loading…'}</div>
      <div>URL {currentUrlIndex + 1}/{testUrls.length}</div>
      
      <div style={{ width: '1px', height: '1px', overflow: 'hidden' }}>
        <Image
          src={currentUrl}
          alt="test"
          width={1}
          height={1}
          onError={handleError}
          onLoad={handleLoad}
          unoptimized={currentUrl.includes('openlibrary.org') || currentUrl.includes('.svg')}
        />
      </div>
    </div>
  );
}