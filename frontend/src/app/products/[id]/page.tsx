'use client';

import { use } from 'react';
import { useProduct } from '@/lib/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import ProductDebugInfo from '@/components/debug/ProductDebugInfo';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import { ProductDetailSkeleton } from '@/components/ui/LoadingSkeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { ArrowLeft, ExternalLink, Star, Calendar, User, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  const { product, isLoading, isError } = useProduct(productId);

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productData = product as any;
  const detail = productData.detail || {};
  const reviews = productData.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-6">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <div className=" ">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            title={product.title}
            isbn={detail.isbn}
            sourceId={product.sourceId}
            className="object-cover"
            fallbackClassName="w-full h-full flex items-center justify-center"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            {product.author && (
              <p className="text-lg text-gray-600 flex items-center mb-2">
                <User className="mr-2 h-5 w-5" />
                by {product.author}
              </p>
            )}
            {product.category && (
              <p className="text-sm text-blue-600 mb-2">
                <Link 
                  href={`/products?category=${product.category.slug}`}
                  className="hover:underline"
                >
                  {product.category.title}
                </Link>
              </p>
            )}
          </div>

          <div className="text-2xl font-bold text-green-600">
            {product.price ? formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency) : 'Price not available'}
          </div>

          {detail.ratingsAvg && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(parseFloat(detail.ratingsAvg)) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg text-gray-600">
                {parseFloat(detail.ratingsAvg).toFixed(1)} out of 5
              </span>
              <span className="text-sm text-gray-500">
                ({detail.reviewsCount || 0} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {detail.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{detail.description}</p>
            </div>
          )}

          <div className="flex gap-4">
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.sourceId && (
              <div className="flex justify-between">
                <span className="font-medium">Source ID:</span>
                <span className="text-sm text-gray-600">{product.sourceId}</span>
              </div>
            )}
            {detail.publisher && (
              <div className="flex justify-between">
                <span className="font-medium">Publisher:</span>
                <span>{detail.publisher}</span>
              </div>
            )}
            {detail.publicationDate && (
              <div className="flex justify-between">
                <span className="font-medium">Publication Date:</span>
                <span>{formatDate(detail.publicationDate)}</span>
              </div>
            )}
            {detail.isbn && (
              <div className="flex justify-between">
                <span className="font-medium">ISBN:</span>
                <span>{detail.isbn}</span>
              </div>
            )}
            {detail.pageCount && (
              <div className="flex justify-between">
                <span className="font-medium">Pages:</span>
                <span>{detail.pageCount}</span>
              </div>
            )}
            {detail.genres && detail.genres.length > 0 && (
              <div>
                <span className="font-medium">Genres:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detail.genres.map((genre: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Reviews
            </CardTitle>
            {detail.ratingsAvg && (
              <CardDescription>
                Average rating: {parseFloat(detail.ratingsAvg).toFixed(1)}/5 ({detail.reviewsCount || 0} reviews)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.author || 'Anonymous'}</span>
                      {review.rating && (
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {review.text && (
                      <p className="text-gray-700 text-sm">{review.text}</p>
                    )}
                    {review.reviewDate && (
                      <p className="text-gray-500 text-xs mt-1">
                        {formatDate(review.reviewDate)}
                      </p>
                    )}
                  </div>
                ))}
                {reviews.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    And {reviews.length - 3} more reviews...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No reviews available for this product.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12">
        <ProductRecommendations currentProduct={product} limit={8} />
      </div>
      
      <ProductDebugInfo product={product} />
    </div>
  );
}