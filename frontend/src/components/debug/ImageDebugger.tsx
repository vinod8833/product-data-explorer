'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImageDebuggerProps {
  products: Product[];
}

export default function ImageDebugger({ products }: ImageDebuggerProps) {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({});
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    products.slice(0, 5).forEach(product => {
      if (product.imageUrl && !imageStatus[product.imageUrl]) {
        setImageStatus(prev => ({ ...prev, [product.imageUrl!]: 'loading' }));
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        
        img.onload = () => {
          setImageStatus(prev => ({ ...prev, [product.imageUrl!]: 'success' }));
          if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=images')) {
            console.log(' Image loaded:', product.imageUrl);
          }
        };
        
        img.onerror = (error) => {
          setImageStatus(prev => ({ ...prev, [product.imageUrl!]: 'error' }));
          if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=images')) {
            console.warn(' Image failed:', product.imageUrl, error);
          }
        };
        
        img.src = product.imageUrl;
      }
    });
  }, [products]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 mb-2 block"
      >
        Images ({products.length})
      </button>
      
      {showDebugger && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-80 overflow-y-auto">
          <h3 className="font-bold mb-3 text-sm">Image Loading Status</h3>
          
          <div className="space-y-2">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="text-xs border-b border-gray-100 pb-2">
                <div className="font-medium">{product.title.slice(0, 30)}...</div>
                <div className="text-gray-600">ID: {product.id} | Author: {product.author}</div>
                
                {product.imageUrl ? (
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      imageStatus[product.imageUrl] === 'success' ? 'bg-green-500' :
                      imageStatus[product.imageUrl] === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-xs">
                      {imageStatus[product.imageUrl] || 'loading'}
                    </span>
                  </div>
                ) : (
                  <div className="text-red-500 text-xs">No image URL</div>
                )}
                
                {product.imageUrl && (
                  <div className="text-xs text-gray-500 mt-1 break-all">
                    {product.imageUrl.slice(0, 60)}...
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-600">
            <div>Total Products: {products.length}</div>
            <div>With Images: {products.filter(p => p.imageUrl).length}</div>
            <div>Loaded: {Object.values(imageStatus).filter(s => s === 'success').length}</div>
            <div>Failed: {Object.values(imageStatus).filter(s => s === 'error').length}</div>
          </div>
        </div>
      )}
    </div>
  );
}