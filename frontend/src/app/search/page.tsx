'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProductSearch } from '@/lib/hooks/useApi';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, X } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery); 
  const [page, setPage] = useState(1);

  const { products, isLoading, isError, mutate } = useProductSearch(searchQuery, page, 20);

  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
    setSearchQuery(urlQuery);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);
      const newUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
      router.push(newUrl);
    } else {
      clearSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchQuery('');
    router.push('/search');
  };

  const handleRefresh = () => {
    mutate();
  };

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't load the search results. Please try again.
          </p>
          <div className="space-x-4">
            <Button onClick={handleRefresh}>
              Try Again
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search for products, authors, or descriptions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" disabled={!query.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <div>Query: "{query}"</div>
              <div>Search Query: "{searchQuery}"</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>Results: {products?.total || 0}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Search results for "{searchQuery}"
          </h2>
          {products && (
            <p className="text-gray-600 mt-1">
              Found {products.total} products
            </p>
          )}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {products && products.data.length > 0 && !isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.data.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={products.totalPages}
              hasNext={products.hasNext}
              hasPrev={products.hasPrev}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {products && products.data.length === 0 && searchQuery && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            No products match your search for "{searchQuery}". Try different keywords or browse our categories.
          </p>
          <div className="space-x-4">
            <Button onClick={clearSearch}>
              Clear Search
            </Button>
            <Button variant="outline" onClick={() => router.push('/products')}>
              Browse All Products
            </Button>
          </div>
        </div>
      )}

      {!searchQuery && !isLoading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start searching
          </h3>
          <p className="text-gray-600 mb-6">
            Enter a search term above to find products by title, author, or description.
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push('/products')}>
              Browse All Products
            </Button>
            <Button variant="outline" onClick={() => router.push('/categories')}>
              Browse Categories
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}