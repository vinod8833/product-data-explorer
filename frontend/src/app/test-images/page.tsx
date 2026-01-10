'use client';

import { useState, useEffect } from 'react';
import ProductImage from '@/components/ui/ProductImage';

interface TestProduct {
  id: number;
  title: string;
  imageUrl: string;
  sourceId: string;
  isbn?: string;
}

export default function TestImagesPage() {
  const [products, setProducts] = useState<TestProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?page=1&limit=6')
      .then(res => res.json())
      .then(data => {
        const productPromises = data.data.slice(0, 6).map((product: any) =>
          fetch(`/api/products/${product.id}`)
            .then(res => res.json())
            .then(detail => ({
              id: product.id,
              title: product.title,
              imageUrl: product.imageUrl,
              sourceId: product.sourceId,
              isbn: detail.detail?.isbn
            }))
        );
        
        return Promise.all(productPromises);
      })
      .then(products => {
        setProducts(products);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Loading Test</h1>
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Information</h2>
        <p className="text-sm text-gray-700 mb-2">
          This page tests the image loading fallback system:
        </p>
        <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
          <li>Invalid World of Books URLs should be detected</li>
          <li>OpenLibrary covers should be tried using ISBN</li>
          <li>Local SVG placeholder should be shown as final fallback</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <div className="aspect-[3/4] mb-4">
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                title={product.title}
                isbn={product.isbn}
                sourceId={product.sourceId}
                className="w-full h-full object-cover rounded"
                fallbackClassName="w-full h-full flex items-center justify-center bg-gray-100 rounded"
                onImageLoad={(src) => {
                  console.log(` Image loaded for ${product.title}:`, src);
                }}
                onImageError={(src) => {
                  console.log(` Image failed for ${product.title}:`, src);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">{product.title}</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>ID: {product.id}</div>
                <div>Source: {product.sourceId}</div>
                <div>ISBN: {product.isbn || 'None'}</div>
                <div className="break-all">Original URL: {product.imageUrl}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Expected Behavior</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• All images should display (either OpenLibrary covers or placeholder)</li>
          <li>• Check browser console for loading logs</li>
          <li>• Products with ISBNs should try OpenLibrary first</li>
          <li>• Final fallback should be the book placeholder SVG</li>
        </ul>
      </div>
    </div>
  );
}