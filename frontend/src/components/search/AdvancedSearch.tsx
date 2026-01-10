'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SearchFilters } from '@/lib/types';
import { Search, Filter, X, BookOpen, User, DollarSign, Calendar, Star } from 'lucide-react';

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export default function AdvancedSearch({ onFiltersChange, initialFilters = {} }: AdvancedSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isInitialized = useRef(false);

  const popularGenres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Young Adult'
  ];

  const priceRanges = [
    { label: 'Under £5', min: 0, max: 5 },
    { label: '£5 - £10', min: 5, max: 10 },
    { label: '£10 - £20', min: 10, max: 20 },
    { label: '£20 - £30', min: 20, max: 30 },
    { label: 'Over £30', min: 30, max: undefined },
  ];

  const handleFiltersUpdate = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [onFiltersChange]);

  useEffect(() => {
    if (!isInitialized.current) {
      const urlFilters: SearchFilters = {
        q: searchParams.get('q') || initialFilters.q || '',
        author: searchParams.get('author') || initialFilters.author || '',
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : initialFilters.minPrice,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : initialFilters.maxPrice,
        sortBy: searchParams.get('sortBy') || initialFilters.sortBy || 'id',
        sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || initialFilters.sortOrder || 'DESC',
        inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : initialFilters.inStock,
      };
      
      handleFiltersUpdate(urlFilters);
      isInitialized.current = true;
    }
  }, []); 

  useEffect(() => {
    if (isInitialized.current) {
      const urlFilters: SearchFilters = {
        q: searchParams.get('q') || '',
        author: searchParams.get('author') || '',
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
        sortBy: searchParams.get('sortBy') || 'id',
        sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC',
        inStock: searchParams.get('inStock') ? searchParams.get('inStock') === 'true' : undefined,
      };
      
      if (JSON.stringify(filters) !== JSON.stringify(urlFilters)) {
        handleFiltersUpdate(urlFilters);
      }
    }
  }, [searchParams, handleFiltersUpdate]); 

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    handleFiltersUpdate(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') {
        params.set(k, v.toString());
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceRangeSelect = (range: typeof priceRanges[0]) => {
    handleFilterChange('minPrice', range.min);
    handleFilterChange('maxPrice', range.max);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      q: '',
      sortBy: initialFilters.sortBy || 'id',
      sortOrder: initialFilters.sortOrder || 'DESC',
    };
    handleFiltersUpdate(clearedFilters);
    router.push('/products');
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (value === undefined || value === '') return false;
    // Don't consider default sort values as active filters
    if (key === 'sortBy' && (value === 'id' || value === initialFilters.sortBy)) return false;
    if (key === 'sortOrder' && (value === 'DESC' || value === initialFilters.sortOrder)) return false;
    return true;
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search & Filter
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books, authors, genres..."
            value={filters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Quick Price Ranges
          </label>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <Button
                key={range.label}
                variant={
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? "primary"
                    : "outline"
                }
                size="sm"
                onClick={() => handlePriceRangeSelect(range)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-4 w-4 mr-1" />
                  Author
                </label>
                <Input
                  type="text"
                  placeholder="e.g., George Orwell"
                  value={filters.author || ''}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </div>

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
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy || 'id'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="id">Newest</option>
                    <option value="title">Title A-Z</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                  >
                    {filters.sortOrder === 'ASC' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline h-4 w-4 mr-1" />
                Availability
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === undefined}
                    onChange={() => handleFilterChange('inStock', undefined)}
                    className="mr-2"
                  />
                  All Books
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === true}
                    onChange={() => handleFilterChange('inStock', true)}
                    className="mr-2"
                  />
                  In Stock Only
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === false}
                    onChange={() => handleFilterChange('inStock', false)}
                    className="mr-2"
                  />
                  Out of Stock
                </label>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {filters.q && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{filters.q}"
                <button
                  onClick={() => handleFilterChange('q', '')}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.author && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Author: {filters.author}
                <button
                  onClick={() => handleFilterChange('author', '')}
                  className="ml-1 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                Price: £{filters.minPrice || 0} - £{filters.maxPrice || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minPrice', undefined);
                    handleFilterChange('maxPrice', undefined);
                  }}
                  className="ml-1 hover:text-yellow-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.inStock !== undefined && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {filters.inStock ? 'In Stock' : 'Out of Stock'}
                <button
                  onClick={() => handleFilterChange('inStock', undefined)}
                  className="ml-1 hover:text-purple-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}