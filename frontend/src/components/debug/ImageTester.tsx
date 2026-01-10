import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImageTesterProps {
  products: Product[];
}

export default function ImageTester({ products }: ImageTesterProps) {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    products.forEach(product => {
      const url = product.imageUrl;
      if (url && !imageStatus[url]) {
        setImageStatus(prev => ({ ...prev, [url]: 'loading' }));
        
        const img = new Image();
        img.onload = () => {
          setImageStatus(prev => ({ ...prev, [url]: 'success' }));
          if (process.env.NODE_ENV === 'development') {
            console.log(' Image loaded:', url);
          }
        };
        img.onerror = () => {
          setImageStatus(prev => ({ ...prev, [url]: 'error' }));
          // Reduce console noise - only log if debugging images specifically
          if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=images')) {
            console.warn(' Image failed:', url);
          }
        };
        img.src = url;
      }
    });
  }, [products]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }


}