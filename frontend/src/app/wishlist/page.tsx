'use client';

import { useState } from 'react';
import { Heart, Share2, Grid, List } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import Button from '@/components/ui/Button';
import WishlistManager from '@/components/product/WishlistManager';

export default function WishlistPage() {
  const { wishlistItems, getWishlistCount } = useWishlist();
  const [isManagerOpen, setIsManagerOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-8 w-8 mr-3 text-red-500 fill-current" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-1">
                  {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
          </div>
        </div>

        <WishlistManager
          isOpen={isManagerOpen}
          onClose={() => setIsManagerOpen(false)}
        />
      </div>
    </div>
  );
}