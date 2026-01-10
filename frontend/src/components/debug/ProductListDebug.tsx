import { useState } from 'react';
import { Product } from '@/lib/types';

interface ProductListDebugProps {
  products: Product[];
}

export default function ProductListDebug({ products }: ProductListDebugProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const titleCounts = products.reduce((acc, product) => {
    acc[product.title] = (acc[product.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const authorCounts = products.reduce((acc, product) => {
    if (product.author) {
      acc[product.author] = (acc[product.author] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const uniqueTitles = Object.keys(titleCounts).length;
  const uniqueAuthors = Object.keys(authorCounts).length;
  const totalProducts = products.length;

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
      >
        List Debug ({totalProducts})
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-auto text-xs">
          <h3 className="font-bold mb-2">Product List Debug</h3>
          
          <div className="space-y-2">
            <div>
              <strong>Diversity Stats:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1">
                <div>Total Products: {totalProducts}</div>
                <div>Unique Titles: {uniqueTitles}</div>
                <div>Unique Authors: {uniqueAuthors}</div>
                <div>Diversity Ratio: {((uniqueTitles / totalProducts) * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div>
              <strong>Title Distribution:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                {Object.entries(titleCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([title, count]) => (
                    <div key={title} className="text-xs">
                      {count}x {title.substring(0, 30)}...
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <strong>Author Distribution:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                {Object.entries(authorCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([author, count]) => (
                    <div key={author} className="text-xs">
                      {count}x {author}
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <strong>Sample Products:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 max-h-32 overflow-y-auto">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="text-xs border-b border-gray-200 pb-1 mb-1">
                    <div>ID: {product.id}</div>
                    <div>Title: {product.title}</div>
                    <div>Author: {product.author}</div>
                    <div>Price: {product.price} {product.currency}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}