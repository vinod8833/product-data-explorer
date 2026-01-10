'use client';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import Button from '@/components/ui/Button';
import { Product } from '@/lib/types';

const testProduct: Product = {
  id: 999999,
  title: 'Test Product for Wishlist',
  author: 'Test Author',
  price: 19.99,
  currency: 'USD',
  imageUrl: 'https://via.placeholder.com/300x400',
  sourceUrl: 'https://example.com/test-product',
  inStock: true,
  sourceId: 'test-source',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function WishlistTester() {
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();
  const [actionCount, setActionCount] = useState(0);
  
  const inWishlist = isInWishlist(testProduct.id);

  const handleAdd = () => {
    console.log(`[WishlistTester] Adding to wishlist - Action #${actionCount + 1}`);
    addToWishlist(testProduct, 'medium');
    setActionCount(prev => prev + 1);
  };

  const handleRemove = () => {
    console.log(`[WishlistTester] Removing from wishlist - Action #${actionCount + 1}`);
    removeFromWishlist(testProduct.id);
    setActionCount(prev => prev + 1);
  };

  const handleToggle = () => {
    if (inWishlist) {
      handleRemove();
    } else {
      handleAdd();
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        🧪 Wishlist Tester (Development Only)
      </h3>
      <div className="space-y-2">
        <p className="text-sm text-yellow-700">
          Test Product: {testProduct.title} | 
          Status: {inWishlist ? '❤️ In Wishlist' : '🤍 Not in Wishlist'} | 
          Total Items: {getWishlistCount()} | 
          Actions: {actionCount}
        </p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleAdd}
            disabled={inWishlist}
            variant="primary"
          >
            Add to Wishlist
          </Button>
          <Button 
            size="sm" 
            onClick={handleRemove}
            disabled={!inWishlist}
            variant="secondary"
          >
            Remove from Wishlist
          </Button>
          <Button 
            size="sm" 
            onClick={handleToggle}
            variant="outline"
          >
            Toggle ({inWishlist ? 'Remove' : 'Add'})
          </Button>
        </div>
      </div>
    </div>
  );
}