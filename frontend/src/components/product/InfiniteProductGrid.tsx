'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useProducts } from '@/lib/hooks/useApi';
import { SearchFilters, Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import ConditionalDebugComponents from '@/components/debug/ConditionalDebugComponents';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';
import Button from '@/components/ui/Button';
import { RefreshCw, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { useImageCache } from '@/lib/imageCache';

interface InfiniteProductGridProps {
  categoryId?: number;
  filters: SearchFilters;
  itemsPerPage?: number;
  enableVirtualization?: boolean;
}

export default function InfiniteProductGrid({ 
  categoryId, 
  filters, 
  itemsPerPage = 20,
  enableVirtualization = true
}: InfiniteProductGridProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const stableFilters = useMemo(() => filters, [
    filters?.q,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.author,
    filters?.inStock,
    filters?.sortBy,
    filters?.sortOrder
  ]);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 40 }); // Show first 40 items initially
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTop = useRef(0);
  const { preloadImages, getCacheStats } = useImageCache();

  const { products, isLoading, isError, mutate } = useProducts(
    categoryId, 
    currentPage, 
    itemsPerPage, 
    stableFilters
  );

  useEffect(() => {
    if (!enableVirtualization || !containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const itemHeight = 400; 
      const itemsPerRow = Math.floor(containerRef.current.clientWidth / 280); 
      
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) * itemsPerRow - itemsPerRow * 2);
      const endIndex = Math.min(
        allProducts.length,
        startIndex + Math.ceil(containerHeight / itemHeight) * itemsPerRow + itemsPerRow * 4
      );
      
      setVisibleRange({ start: startIndex, end: endIndex });
      lastScrollTop.current = scrollTop;
    };

    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [allProducts.length, enableVirtualization]);

  useEffect(() => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    setVisibleRange({ start: 0, end: 40 });
  }, [stableFilters, categoryId]);

  useEffect(() => {
    if (products && !isLoading) {
      if (process.env.NODE_ENV === 'development') {
        console.log('InfiniteProductGrid received products:', {
          page: currentPage,
          count: products.data.length,
          total: products.total,
          firstProduct: products.data[0]?.id,
          lastProduct: products.data[products.data.length - 1]?.id
        });
      }

      if (currentPage === 1) {
        setAllProducts(products.data);
        setTotalProducts(products.total);
        setHasMore(products.hasNext);
        
        const imageUrls = products.data
          .slice(0, 20)
          .map(p => p.imageUrl)
          .filter((url): url is string => Boolean(url));
        preloadImages(imageUrls);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('First page loaded, products set:', products.data.length);
        }
      } else {
        setAllProducts(prev => {
          const newProducts = products.data.filter(
            newProduct => !prev.some(existingProduct => existingProduct.id === newProduct.id)
          );
          
          const imageUrls = newProducts
            .slice(0, 10)
            .map(p => p.imageUrl)
            .filter((url): url is string => Boolean(url));
          preloadImages(imageUrls);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Appending products:', {
              existing: prev.length,
              new: newProducts.length,
              filtered: products.data.length - newProducts.length
            });
          }
          
          return [...prev, ...newProducts];
        });
        setHasMore(products.hasNext);
      }
      setIsLoadingMore(false);
    }
  }, [products, isLoading, currentPage, preloadImages]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMore, isLoading]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading, isLoadingMore]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    mutate();
  };

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to load products
        </h3>
        <p className="text-gray-600 mb-6">
          There was an error loading the products. Please try again.
        </p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {isLoading && currentPage === 1 ? (
            'Loading products...'
          ) : (
            <>
              Showing {allProducts.length} of {totalProducts} products
              {filters.q && ` for "${filters.q}"`}
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Cache: {getCacheStats().loaded}/{getCacheStats().size}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading && currentPage === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : allProducts.length > 0 ? (
        <>
          <div 
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-screen overflow-y-auto"
            style={{ minHeight: enableVirtualization ? `${Math.ceil(allProducts.length / 4) * 400}px` : 'auto' }}
          >
            {enableVirtualization ? (
              <>
                {visibleRange.start > 0 && (
                  <div 
                    style={{ 
                      height: `${Math.ceil(visibleRange.start / 4) * 400}px`,
                      gridColumn: '1 / -1'
                    }} 
                  />
                )}
                
                {allProducts.slice(visibleRange.start, visibleRange.end).map((product, index) => {
                  const actualIndex = visibleRange.start + index;
                  
                  if (process.env.NODE_ENV === 'development' && actualIndex < 5) {
                    console.log(`Rendering product ${actualIndex}:`, {
                      id: product.id,
                      title: product.title,
                      imageUrl: product.imageUrl
                    });
                  }
                  
                  return (
                    <ProductCard 
                      key={`product-${product.id}-${product.sourceId}`} 
                      product={product} 
                    />
                  );
                })}
                
                {visibleRange.end < allProducts.length && (
                  <div 
                    style={{ 
                      height: `${Math.ceil((allProducts.length - visibleRange.end) / 4) * 400}px`,
                      gridColumn: '1 / -1'
                    }} 
                  />
                )}
              </>
            ) : (
              allProducts.map((product, index) => {
                if (process.env.NODE_ENV === 'development' && index < 5) {
                  console.log(`Rendering product ${index}:`, {
                    id: product.id,
                    title: product.title,
                    imageUrl: product.imageUrl
                  });
                }
                
                return (
                  <ProductCard 
                    key={`product-${product.id}-${product.sourceId}`} 
                    product={product} 
                  />
                );
              })
            )}
          </div>

          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isLoadingMore ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Loading more products...</span>
              </div>
            ) : hasMore ? (
              <Button onClick={loadMore} variant="outline">
                Load More Products
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You've reached the end! Showing all {allProducts.length} products.
                </p>
                <Button onClick={scrollToTop} variant="outline" size="sm">
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Back to Top
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {filters.q 
              ? `No products match your search for "${filters.q}"`
              : 'No products are available at the moment'
            }
          </p>
          {filters.q && (
            <Button onClick={() => window.location.href = '/products'}>
              Clear Search
            </Button>
          )}
        </div>
      )}
      
      <ConditionalDebugComponents 
        products={allProducts}
        categoryId={categoryId?.toString()}
        filters={filters}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}