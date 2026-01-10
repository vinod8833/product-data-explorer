'use client';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import Button from '@/components/ui/Button';
import { Product } from '@/lib/types';
import { Heart } from 'lucide-react';

const testProducts: Product[] = [
  {
    id: 1001,
    title: 'Test Book 1',
    author: 'Test Author 1',
    price: 19.99,
    currency: 'USD',
    imageUrl: 'https://via.placeholder.com/300x400',
    sourceUrl: 'https://example.com/test-book-1',
    inStock: true,
    sourceId: 'test-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1002,
    title: 'Test Book 2',
    author: 'Test Author 2',
    price: 24.99,
    currency: 'USD',
    imageUrl: 'https://via.placeholder.com/300x400',
    sourceUrl: 'https://example.com/test-book-2',
    inStock: true,
    sourceId: 'test-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function TestWishlistPage() {
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount, clearWishlist } = useWishlist();
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setActionLog(prev => [`[${timestamp}] ${action}`, ...prev.slice(0, 9)]);
  };

  const handleAdd = (product: Product) => {
    logAction(`Adding "${product.title}" to wishlist`);
    addToWishlist(product, 'medium');
  };

  const handleRemove = (productId: number, title: string) => {
    logAction(`Removing "${title}" from wishlist`);
    removeFromWishlist(productId);
  };

  const handleClear = () => {
    logAction('Clearing entire wishlist');
    clearWishlist();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Wishlist Duplicate Notification Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Wishlist Status</h2>
          <p className="text-gray-600 mb-4">
            Total items in wishlist: <span className="font-semibold">{getWishlistCount()}</span>
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={handleClear} variant="outline" disabled={getWishlistCount() === 0}>
              Clear Wishlist
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {testProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-gray-600">by {product.author}</p>
                    <p className="text-green-600 font-semibold">${product.price}</p>
                  </div>
                  <div className={`p-2 rounded-full ${inWishlist ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <Heart className={`h-5 w-5 ${inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAdd(product)}
                    disabled={inWishlist}
                    variant="primary"
                    size="sm"
                  >
                    Add to Wishlist
                  </Button>
                  
                  <Button
                    onClick={() => handleRemove(product.id, product.title)}
                    disabled={!inWishlist}
                    variant="outline"
                    size="sm"
                  >
                    Remove from Wishlist
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Status: {inWishlist ? 'In Wishlist' : 'Not in Wishlist'}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Action Log</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {actionLog.length === 0 ? (
              <p className="text-gray-500 italic">No actions performed yet</p>
            ) : (
              actionLog.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
          <Button 
            onClick={() => setActionLog([])} 
            variant="outline" 
            size="sm" 
            className="mt-4"
            disabled={actionLog.length === 0}
          >
            Clear Log
          </Button>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Click "Add to Wishlist" - should show exactly ONE success toast</li>
            <li>• Click "Add to Wishlist" again - should show exactly ONE info toast (already exists)</li>
            <li>• Click "Remove from Wishlist" - should show exactly ONE success toast</li>
            <li>• Try rapid clicking - should be prevented by loading state</li>
            <li>• Open browser console to see detailed logs</li>
            <li>• Check that each action shows only one notification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}