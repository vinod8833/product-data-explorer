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
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Wishlist Tester (Dev Only)</h3>
      <div className="flex gap-2 items-center">
        <Button onClick={handleAdd} size="sm" variant="outline">
          Add Test Product
        </Button>
        <Button onClick={handleRemove} size="sm" variant="outline">
          Remove Test Product
        </Button>
        <Button onClick={handleToggle} size="sm">
          Toggle ({inWishlist ? 'Remove' : 'Add'})
        </Button>
        <span className="text-sm text-gray-600">
          Actions: {actionCount} | Wishlist Count: {getWishlistCount()} | In Wishlist: {inWishlist ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
}