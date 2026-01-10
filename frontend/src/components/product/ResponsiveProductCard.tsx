'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ProductImage from '@/components/ui/ProductImage';
import { Product, ProductDetail } from '@/lib/types';
import { formatPrice, generateId } from '@/lib/utils';
import { useViewHistory } from '@/hooks/useViewHistory';
import { Heart, ExternalLink } from 'lucide-react';

interface ResponsiveProductCardProps {
  product: Product | ProductDetail;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  onQuickView?: (product: Product | ProductDetail) => void;
  onAddToWishlist?: (product: Product | ProductDetail) => void;
  className?: string;
}

export default function ResponsiveProductCard({
  product,
  variant = 'default',
  showQuickActions = true,
  onQuickView,
  onAddToWishlist,
  className,
}: ResponsiveProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToHistory } = useViewHistory();

  const productData = product as any;
  const titleId = generateId('product-title');

  const handleCardClick = () => {
    addToHistory({
      id: product.id.toString(),
      title: product.title,
      url: `/products/${product.id}`,
      type: 'product',
      metadata: {
        author: product.author,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        imageUrl: product.imageUrl,
        category: productData.category?.title,
      },
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${className || ''}`}>
      <Link href={`/products/${product.id}`} onClick={handleCardClick}>
        <CardHeader className="p-4">
          <div className="aspect-[3/4] relative mb-3">
            <ProductImage
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
            />
            {showQuickActions && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-full ${
                    isWishlisted ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'
                  } shadow-md hover:shadow-lg transition-all`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}
          </div>
          <CardTitle id={titleId} className="text-sm font-medium line-clamp-2 mb-1">
            {product.title}
          </CardTitle>
          {product.author && (
            <p className="text-xs text-gray-600 mb-2">{product.author}</p>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.price && (
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency)}
                </span>
              )}
              <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {showQuickActions && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView?.(product);
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Quick view"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}