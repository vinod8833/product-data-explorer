import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import ScreenReaderOnly from '@/components/accessibility/ScreenReaderOnly';
import { Product, ProductDetail } from '@/lib/types';
import { formatPrice, truncateText } from '@/lib/utils';
import { BookOpen, ExternalLink, Star } from 'lucide-react';

interface AccessibleProductCardProps {
  product: Product | ProductDetail;
  onView?: (productId: number) => void;
  priority?: boolean; 
}

export default function AccessibleProductCard({ 
  product, 
  onView,
  priority = false 
}: AccessibleProductCardProps) {
  const productData = product as any;
  const detail = productData.detail || {};
  
  const handleCardClick = () => {
    onView?.(Number(product.id));
  };

  const priceText = product.price 
    ? formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency)
    : 'Price not available';

  const availabilityText = product.inStock ? 'In stock' : 'Out of stock';
  const availabilityColor = product.inStock ? 'text-green-600' : 'text-red-600';

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      <CardHeader className="pb-2">
        <div className="aspect-[3/4] relative mb-4 bg-gray-100 rounded-md overflow-hidden">
          <ProductImage
            src={product.imageUrl}
            alt={`Cover image for ${product.title}`}
            title={product.title}
            isbn={detail.isbn}
            sourceId={product.sourceId}
            className="object-cover"
            fallbackClassName="w-full h-full flex items-center justify-center"
          />
          
          {!product.inStock && (
            <div 
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              role="status"
              aria-label="Out of stock"
            >
              Out of Stock
            </div>
          )}
        </div>
        
        <CardTitle className="text-lg leading-tight">
          <Link 
            href={`/products/${product.id}`}
            className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            onClick={handleCardClick}
            id={`product-title-${product.id}`}
          >
            {truncateText(product.title, 60)}
            <ScreenReaderOnly>
              , {availabilityText}, {priceText}
            </ScreenReaderOnly>
          </Link>
        </CardTitle>
        
        {product.author && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">by</span> {product.author}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className={`text-lg font-semibold ${product.price ? 'text-green-600' : 'text-gray-500'}`}>
            {priceText}
          </div>
          <div className={`text-sm ${availabilityColor}`} role="status">
            {availabilityText}
          </div>
          
          {detail.ratingsAvg && (
            <div className="flex items-center mt-2" role="img" aria-label={`Rating: ${detail.ratingsAvg} out of 5 stars`}>
              <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
              <span className="ml-1 text-sm text-gray-600">
                {detail.ratingsAvg}
              </span>
              <ScreenReaderOnly>out of 5 stars</ScreenReaderOnly>
              {detail.reviewsCount && (
                <span className="ml-2 text-sm text-gray-500">
                  ({detail.reviewsCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleCardClick}
            >
              View Details
              <ScreenReaderOnly>for {product.title}</ScreenReaderOnly>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}