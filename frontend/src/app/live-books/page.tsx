'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProductImage from '@/components/ui/ProductImage';
import { Search, Filter, ExternalLink, BookOpen, User, DollarSign, Package } from 'lucide-react';

interface LiveProduct {
  sourceId: string;
  title: string;
  author?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  inStock: boolean;
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
  minPrice?: number;
  maxPrice?: number;
  conditions?: string;
  publisher?: string;
  categories?: string;
}

export default function LiveBooksPage() {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchType, setSearchType] = useState<'search' | 'advanced' | 'budget' | 'collection'>('search');

  const conditions = ['LIKE_NEW', 'VERY_GOOD', 'GOOD', 'WELL_READ'];
  const collections = {
    'Sale Collection 1': '520304558353',
    'Sale Collection 2': '520304722193',
    'Sale Collection 3': '520304820497',
  };

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      let url = '';
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, value.toString());
        }
      });

      switch (searchType) {
        case 'advanced':
          url = `/api/products/live/advanced?${params}`;
          break;
        case 'budget':
          url = `/api/products/live/budget?${params}`;
          break;
        case 'collection':
          const collectionId = filters.categories || Object.values(collections)[0];
          url = `/api/products/live/collection/${collectionId}?${params}`;
          break;
        default:
          url = `/api/products/live/search?${params}`;
      }

      console.log('Fetching from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LiveSearchResponse = await response.json();
      
      setProducts(data.data || []);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev,
      });

      console.log(`Loaded ${data.data?.length || 0} products from World of Books API`);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [searchType]);

  const handleSearch = () => {
    fetchProducts(1);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'GBP' ? 'GBP' : 'USD',
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Live World of Books API
        </h1>
        <p className="text-gray-600">
          Real-time book data from World of Books using their Algolia search API.
          This demonstrates the integrated API service with proper rate limiting and caching.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Endpoint Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'search', label: 'Basic Search', desc: 'Search with basic filters' },
              { key: 'advanced', label: 'Advanced Search', desc: 'Full-featured search with facets' },
              { key: 'budget', label: 'Budget Books', desc: 'Books under £2.99' },
              { key: 'collection', label: 'Collections', desc: 'Curated book collections' },
            ].map(({ key, label, desc }) => (
              <Button
                key={key}
                variant={searchType === key ? 'primary' : 'outline'}
                onClick={() => setSearchType(key as any)}
                className="flex flex-col items-start p-4 h-auto"
              >
                <span className="font-medium">{label}</span>
                <span className="text-xs text-white-800 mt-1">{desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="inline h-4 w-4 mr-1" />
                Search Query
              </label>
              <Input
                type="text"
                placeholder="e.g., Harry Potter"
                value={filters.q || ''}
                onChange={(e) => handleFilterChange('q', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Author
              </label>
              <Input
                type="text"
                placeholder="e.g., J.K. Rowling"
                value={filters.author || ''}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
            </div>

            {searchType === 'advanced' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  Publisher
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Penguin"
                  value={filters.publisher || ''}
                  onChange={(e) => handleFilterChange('publisher', e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Price Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min £"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-20"
                />
                <span className="self-center text-gray-500">to</span>
                <Input
                  type="number"
                  placeholder="Max £"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Package className="inline h-4 w-4 mr-1" />
                Book Condition
              </label>
              <select
                value={filters.conditions || ''}
                onChange={(e) => handleFilterChange('conditions', e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {searchType === 'collection' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection
                </label>
                <select
                  value={filters.categories || Object.values(collections)[0]}
                  onChange={(e) => handleFilterChange('categories', e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {Object.entries(collections).map(([name, id]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {!loading && !error && (
        <div className="mb-6 text-sm text-gray-600">
          Found {pagination.total.toLocaleString()} books • Page {pagination.page} of {pagination.totalPages}
        </div>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.sourceId} className="group hover:shadow-lg transition-shadow">
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
                    {formatPrice(typeof product.price === 'string' ? parseFloat(product.price) : product.price, product.currency)}
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
      )}

      {!loading && !error && products.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search filters or search terms.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && products.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}