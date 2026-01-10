'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import { ExternalLink, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLiveBooks, formatBookPrice, type SearchType, type LiveSearchFilters } from '@/lib/hooks/useLiveBooks';

interface LiveBookGridProps {
  searchType?: SearchType;
  initialFilters?: LiveSearchFilters;
  showPagination?: boolean;
  showHeader?: boolean;
  maxItems?: number;
  className?: string;
  onProductClick?: (product: any) => void;
}

export default function LiveBookGrid({
  searchType = 'search',
  initialFilters = {},
  showPagination = true,
  showHeader = true,
  maxItems,
  className = '',
  onProductClick,
}: LiveBookGridProps) {
  const {
    products,
    pagination,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
  } = useLiveBooks(searchType, initialFilters, true);

  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showHeader && (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: maxItems || 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-t-lg"></div>
              <CardContent className="pt-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800 text-center">
              <BookOpen className="mx-auto h-8 w-8 mb-2" />
              <strong>Error loading live books:</strong> {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Live World of Books
          </h2>
          <p className="text-gray-600">
            {pagination.total.toLocaleString()} books available * Real-time data from World of Books
          </p>
        </div>
      )}

]      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <Card 
            key={product.sourceId} 
            className="group hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                title={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {!product.inStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </div>
              )}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Live
              </div>
            </div>
            
            <CardContent className="pt-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                {product.title}
              </h3>
              
              {product.author && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  by {product.author}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  {formatBookPrice(product.price, product.currency)}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex gap-2">
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                ID: {product.sourceId}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showPagination && !maxItems && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => prevPage()}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, pagination.page - 2) + i;
              if (pageNum > pagination.totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-10 h-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => nextPage()}
            className="flex items-center"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {showPagination && (
        <div className="text-center text-sm text-gray-600">
          Showing {displayProducts.length} of {pagination.total.toLocaleString()} books
          {maxItems && pagination.total > maxItems && (
            <span> • <a href="/live-books" className="text-blue-600 hover:underline">View all</a></span>
          )}
        </div>
      )}
    </div>
  );
}