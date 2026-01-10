import { useState } from 'react';
import { Product, ProductDetail } from '@/lib/types';

interface ProductDebugInfoProps {
  product: Product | ProductDetail;
}

export default function ProductDebugInfo({ product }: ProductDebugInfoProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const productData = product as any;
  const detail = productData.detail || {};
  const reviews = productData.reviews || [];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
      >
        Debug
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-auto text-xs">
          <h3 className="font-bold mb-2">Product Debug Info</h3>
          
          <div className="space-y-2">
            <div>
              <strong>Basic Info:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                {JSON.stringify({
                  id: product.id,
                  title: product.title,
                  author: product.author,
                  price: product.price,
                  currency: product.currency,
                  inStock: product.inStock,
                  imageUrl: product.imageUrl,
                  sourceUrl: product.sourceUrl,
                  sourceId: product.sourceId
                }, null, 2)}
              </pre>
            </div>
            
            {Object.keys(detail).length > 0 && (
              <div>
                <strong>Detail Info:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify({
                    description: detail.description,
                    publisher: detail.publisher,
                    isbn: detail.isbn,
                    ratingsAvg: detail.ratingsAvg,
                    reviewsCount: detail.reviewsCount,
                    pageCount: detail.pageCount,
                    genres: detail.genres
                  }, null, 2)}
                </pre>
              </div>
            )}
            
            {reviews.length > 0 && (
              <div>
                <strong>Reviews ({reviews.length}):</strong>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(reviews.slice(0, 2), null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <strong>Image Test:</strong>
              <div className="mt-1">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt="Test" 
                    className="w-16 h-20 object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.border = '2px solid red';
                      e.currentTarget.title = 'Failed to load';
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.border = '2px solid green';
                      e.currentTarget.title = 'Loaded successfully';
                    }}
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 border flex items-center justify-center text-xs">
                    No Image
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}