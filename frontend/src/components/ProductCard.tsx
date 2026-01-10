import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import SimpleImageTest from '@/components/debug/SimpleImageTest';
import { Product, ProductDetail } from '@/lib/types';
import { formatPrice, truncateText } from '@/lib/utils';
import { BookOpen, ExternalLink, Star, Heart, Plus } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product | ProductDetail;
}

export default function ProductCard({ 
  product
}: ProductCardProps) {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const productData = product as any;
  const detail = productData.detail || {};
  
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async () => {
    if (isAddingToWishlist) {
      console.log('[ProductCard] Wishlist action already in progress, ignoring');
      return;
    }
    
    setIsAddingToWishlist(true);
    console.log('[ProductCard] Wishlist toggle for product:', product.id, inWishlist ? 'remove' : 'add');
    
    try {
      if (inWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product as Product, 'medium');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    } finally {
      setTimeout(() => {
        setIsAddingToWishlist(false);
      }, 300);
    }
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('ProductCard rendering:', {
      id: product.id,
      title: product.title,
      author: product.author,
      imageUrl: product.imageUrl,
      sourceId: product.sourceId
    });
  }
  
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow" data-product-id={product.id}>
      <CardHeader className="pb-2">
        <div className="aspect-[3/4] relative mb-4 bg-gray-100 rounded-md overflow-hidden group">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            title={product.title}
            isbn={detail.isbn}
            sourceId={product.sourceId}
            className="object-cover"
            fallbackClassName="w-full h-full flex items-center justify-center bg-gray-100"
            onImageLoad={(src) => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Image loaded for product ${product.id}:`, src);
              }
            }}
            onImageError={(src) => {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Image failed for product ${product.id}:`, src);
              }
            }}
          />
          
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              disabled={isAddingToWishlist}
              className={`p-2 rounded-full shadow-lg transition-all ${
                inWishlist 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50'
              } ${isAddingToWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {!product.inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
          
          {inWishlist && (
            <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full group-hover:opacity-0 transition-opacity">
              <Heart className="h-3 w-3 fill-current" />
            </div>
          )}
          
          {process.env.NODE_ENV === 'development' && (
            <>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                ID: {product.id}
              </div>
              <SimpleImageTest 
                src={product.imageUrl} 
                title={product.title}
                isbn={detail.isbn}
              />
            </>
          )}
        </div>
        
        <CardTitle className="text-lg leading-tight">
          <Link 
            href={`/products/${product.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {truncateText(product.title, 60)}
          </Link>
        </CardTitle>
        
        {product.author && (
          <CardDescription className="text-sm">
            by {product.author}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          {product.price ? (
            <div className="text-lg font-semibold text-green-600 mb-2">
              {formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency)}
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-2">
              Price not available
            </div>
          )}
          
          {detail.ratingsAvg && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`star-${product.id}-${i}`}
                    className={`h-4 w-4 ${
                      i < Math.floor(parseFloat(detail.ratingsAvg)) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {parseFloat(detail.ratingsAvg).toFixed(1)} ({detail.reviewsCount || 0})
              </span>
            </div>
          )}
          
          <div className="flex items-center mb-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
        </div>

        <div className="flex gap-1">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}