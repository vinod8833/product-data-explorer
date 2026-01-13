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

  const detail = product.detail;
  const reviews = product.reviews || [];

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

      {/* Quick Info Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Author:</span>
            <div className="text-blue-700">{product.author || 'Unknown'}</div>
          </div>
          <div>
            <span className="font-medium text-blue-900">Publisher:</span>
            <div className="text-blue-700">{detail?.publisher || 'Unknown'}</div>
          </div>
          <div>
            <span className="font-medium text-blue-900">Price:</span>
            <div className="text-blue-700 font-semibold">
              {product.price ? formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency) : 'N/A'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-900">Availability:</span>
            <div className={`font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-8">
        <div className=" ">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            title={product.title}
            isbn={detail?.isbn}
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
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-blue-600">
                  <Link 
                    href={`/products?category=${product.category.slug}`}
                    className="hover:underline"
                  >
                    {product.category.title}
                  </Link>
                </span>
              </div>
            )}
            {detail?.publisher && (
              <p className="text-sm text-gray-600 mb-2">
                Published by <span className="font-medium">{detail.publisher}</span>
                {detail.publicationDate && (
                  <span> • {formatDate(detail.publicationDate)}</span>
                )}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {product.price ? formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency) : 'Price not available'}
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {detail?.isbn && (
                <span className="text-sm text-gray-600">
                  ISBN: <span className="font-mono">{detail.isbn}</span>
                </span>
              )}
            </div>
          </div>

          {detail?.ratingsAvg && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(parseFloat(detail.ratingsAvg!.toString())) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg text-gray-600">
                {parseFloat(detail.ratingsAvg.toString()).toFixed(1)} out of 5
              </span>
              <span className="text-sm text-gray-500">
                ({detail.reviewsCount || 0} reviews)
              </span>
            </div>
          )}

          {detail?.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{detail.description}</p>
            </div>
          )}

          {detail?.genres && detail.genres.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {product.sourceUrl && (
              <Link 
                href={product.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on World of Books
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Product Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {product.sourceId && (
              <div className="flex justify-between">
                <span className="font-medium">Source ID:</span>
                <span className="text-sm text-gray-600">{product.sourceId}</span>
              </div>
            )}
            {detail?.publisher && (
              <div className="flex justify-between">
                <span className="font-medium">Publisher:</span>
                <span>{detail.publisher}</span>
              </div>
            )}
            {detail?.publicationDate && (
              <div className="flex justify-between">
                <span className="font-medium">Publication Date:</span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(detail.publicationDate)}
                </span>
              </div>
            )}
            {detail?.isbn && (
              <div className="flex justify-between">
                <span className="font-medium">ISBN:</span>
                <span className="font-mono text-sm">{detail.isbn}</span>
              </div>
            )}
            {detail?.pageCount && (
              <div className="flex justify-between">
                <span className="font-medium">Pages:</span>
                <span>{detail.pageCount}</span>
              </div>
            )}
            {product.currency && (
              <div className="flex justify-between">
                <span className="font-medium">Currency:</span>
                <span>{product.currency}</span>
              </div>
            )}
            {product.lastScrapedAt && (
              <div className="flex justify-between">
                <span className="font-medium">Last Updated:</span>
                <span className="text-sm text-gray-600">{formatDate(product.lastScrapedAt)}</span>
              </div>
            )}
            {detail?.genres && detail.genres.length > 0 && (
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

        {/* Technical Specifications Card */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail?.specs?.bindingType && (
              <div className="flex justify-between">
                <span className="font-medium">Binding Type:</span>
                <span>{detail.specs.bindingType}</span>
              </div>
            )}
            {detail?.specs?.productType && (
              <div className="flex justify-between">
                <span className="font-medium">Product Type:</span>
                <span>{detail.specs.productType}</span>
              </div>
            )}
            {detail?.specs?.yearPublished && (
              <div className="flex justify-between">
                <span className="font-medium">Year Published:</span>
                <span>{detail.specs.yearPublished}</span>
              </div>
            )}
            {detail?.specs?.isbn10 && (
              <div className="flex justify-between">
                <span className="font-medium">ISBN-10:</span>
                <span className="font-mono text-sm">{detail.specs.isbn10}</span>
              </div>
            )}
            {detail?.specs?.isbn13 && (
              <div className="flex justify-between">
                <span className="font-medium">ISBN-13:</span>
                <span className="font-mono text-sm">{detail.specs.isbn13}</span>
              </div>
            )}
            {detail?.specs?.availableConditions && detail.specs.availableConditions.length > 0 && (
              <div>
                <span className="font-medium">Available Conditions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {detail.specs.availableConditions.map((condition: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                    >
                      {condition.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {detail?.specs?.hierarchicalCategories && (
              <div>
                <span className="font-medium">Category Hierarchy:</span>
                <div className="mt-1 space-y-1">
                  {detail.specs.hierarchicalCategories.lvl0 && (
                    <div className="text-sm text-gray-600">
                      • {detail.specs.hierarchicalCategories.lvl0}
                    </div>
                  )}
                  {detail.specs.hierarchicalCategories.lvl1 && (
                    <div className="text-sm text-gray-600 ml-4">
                      • {detail.specs.hierarchicalCategories.lvl1}
                    </div>
                  )}
                  {detail.specs.hierarchicalCategories.lvl2 && (
                    <div className="text-sm text-gray-600 ml-8">
                      • {detail.specs.hierarchicalCategories.lvl2}
                    </div>
                  )}
                </div>
              </div>
            )}
            {product.sourceUrl && (
              <div className="pt-3 border-t">
                <Link 
                  href={product.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View on World of Books
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Reviews & Ratings
            </CardTitle>
            {detail?.ratingsAvg && (
              <CardDescription>
                Average rating: {parseFloat(detail.ratingsAvg.toString()).toFixed(1)}/5 ({detail.reviewsCount || 0} reviews)
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
              <div className="text-center py-6">
                <Star className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-2">No reviews available</p>
                <p className="text-sm text-gray-400">Be the first to review this product!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Section */}
      {(detail?.description || product.category) && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {detail?.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{detail.description}</p>
                </div>
              )}
              {product.category && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Category Information</h4>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/products?category=${product.category.slug}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {product.category.title}
                    </Link>
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.price && (
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metadata Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Product ID:</span>
                <span className="ml-2">{product.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Source ID:</span>
                <span className="ml-2 font-mono">{product.sourceId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <span className="ml-2">{formatDate(product.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <span className="ml-2">{formatDate(product.updatedAt)}</span>
              </div>
              {product.lastScrapedAt && (
                <div>
                  <span className="font-medium text-gray-600">Last Scraped:</span>
                  <span className="ml-2">{formatDate(product.lastScrapedAt)}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Currency:</span>
                <span className="ml-2">{product.currency}</span>
              </div>
            </div>
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