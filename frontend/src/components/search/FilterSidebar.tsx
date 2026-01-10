'use client';

import { useState } from 'react';
import { SearchFilters } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Filter, X, Star, BookOpen, DollarSign } from 'lucide-react';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilterSidebar({ filters, onFiltersChange, isOpen, onToggle }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 100
  });

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Young Adult',
    'Children\'s Books', 'Poetry', 'Drama', 'Philosophy', 'Religion'
  ];

  const conditions = [
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'VERY_GOOD', label: 'Very Good' },
    { value: 'GOOD', label: 'Good' },
    { value: 'WELL_READ', label: 'Well Read' }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    handleFilterChange(type === 'min' ? 'minPrice' : 'maxPrice', value);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 100 });
    onFiltersChange({
      q: '',
      sortBy: 'id',
      sortOrder: 'DESC'
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== undefined && value !== '';
  });

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          onClick={onToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onToggle}
      />
      
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto lg:relative lg:w-64 lg:shadow-none">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </h2>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Price Range
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min £</label>
                    <Input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', parseFloat(e.target.value) || 0)}
                      className="w-20 text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max £</label>
                    <Input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value) || 100)}
                      className="w-20 text-sm"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>£0</span>
                    <span>£100+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {genres.map((genre) => (
                    <label key={genre} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.genres?.includes(genre) || false}
                        onChange={(e) => {
                          const currentGenres = filters.genres || [];
                          const newGenres = e.target.checked
                            ? [...currentGenres, genre]
                            : currentGenres.filter(g => g !== genre);
                          handleFilterChange('genres', newGenres.length > 0 ? newGenres : undefined);
                        }}
                        className="mr-2 rounded"
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Minimum Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label key={rating} className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating}
                        onChange={() => handleFilterChange('minRating', rating)}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Book Condition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <label key={condition.value} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.conditions?.includes(condition.value) || false}
                        onChange={(e) => {
                          const currentConditions = filters.conditions || [];
                          const newConditions = e.target.checked
                            ? [...currentConditions, condition.value]
                            : currentConditions.filter(c => c !== condition.value);
                          handleFilterChange('conditions', newConditions.length > 0 ? newConditions : undefined);
                        }}
                        className="mr-2 rounded"
                      />
                      {condition.label}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.inStock === undefined}
                      onChange={() => handleFilterChange('inStock', undefined)}
                      className="mr-2"
                    />
                    All Books
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.inStock === true}
                      onChange={() => handleFilterChange('inStock', true)}
                      className="mr-2"
                    />
                    In Stock Only
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.inStock === false}
                      onChange={() => handleFilterChange('inStock', false)}
                      className="mr-2"
                    />
                    Out of Stock
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}