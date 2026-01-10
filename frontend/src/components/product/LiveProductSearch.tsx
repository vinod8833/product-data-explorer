'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface LiveProduct {
  id: number;
  sourceId: string;
  title: string;
  author?: string;
  price?: number | string;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LiveSearchResponse {
  data: LiveProduct[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  facets?: any;
}

interface SearchFilters {
  q?: string;
  author?: string;
  publisher?: string;
  minPrice?: number;
  maxPrice?: number;
  conditions?: string[];
  categories?: string[];
}

export default function LiveProductSearch() {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    maxPrice: 2.99, 
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const searchLiveProducts = async (searchFilters: SearchFilters, searchPage: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: searchPage.toString(),
        limit: '20',
      });

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          if (Array.isArray(value)) {
            params.set(key, value.join(','));
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const endpoint = searchFilters.q || searchFilters.author || searchFilters.publisher || searchFilters.categories?.length
        ? '/products/live/advanced'
        : '/products/live/budget';

      const response = await api.get(`${endpoint}?${params}`);
      const data: LiveSearchResponse = response.data;

      setProducts(data.data);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setHasNext(data.hasNext);
      setHasPrev(data.hasPrev);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch live products');
      console.error('Live search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchLiveProducts(filters, 1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    searchLiveProducts(filters, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    searchLiveProducts(filters, newPage);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ maxPrice: 2.99 });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Live Product Search
        </h2>
        <p className="text-gray-600">
          Search live data from World of Books with real-time availability and pricing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Live Products
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search books..."
              value={filters.q || ''}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max price (e.g., 2.99)"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              <Input
                placeholder="Author"
                value={filters.author || ''}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
              <Input
                placeholder="Publisher"
                value={filters.publisher || ''}
                onChange={(e) => handleFilterChange('publisher', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Min price"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => searchLiveProducts(filters, page)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Found {total} live products
              {filters.q && ` for "${filters.q}"`}
            </p>
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.sourceId} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or increasing the price range.
            </p>
            <Button onClick={handleClearFilters}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}