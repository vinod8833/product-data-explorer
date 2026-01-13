'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchFilters } from '@/lib/types';
import { useAllCategories } from '@/lib/hooks/useApi';
import InfiniteProductGrid from '@/components/product/InfiniteProductGrid';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, isLoading: categoriesLoading } = useAllCategories();
  
  const [filters, setFilters] = useState<SearchFilters>({
    q: searchParams.get('q') || '',
    sortBy: 'completeness',
    sortOrder: 'DESC',
  });

  const navigationParam = searchParams.get('navigation');
  const categoryParam = searchParams.get('category');

  const categorySlugToIdMap = categories?.reduce((map, category) => {
    map[category.slug] = category.id;
    return map;
  }, {} as Record<string, number>) || {};

  const categoryId = categoryParam && categorySlugToIdMap[categoryParam] 
    ? categorySlugToIdMap[categoryParam] 
    : undefined;

  const enhancedFilters = { ...filters };
  
  if (navigationParam) {
    enhancedFilters.navigation = navigationParam;
  }
  
  if (categoryParam) {
    enhancedFilters.category = categoryParam;
  }

  useEffect(() => {
    const query = searchParams.get('q');
    const navigation = searchParams.get('navigation');
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const inStock = searchParams.get('inStock');
    
    const newFilters: SearchFilters = {
      q: query || '',
      author: author || '',
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy: sortBy || 'completeness',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      inStock: inStock ? inStock === 'true' : undefined,
    };

    if (navigation) {
      newFilters.navigation = navigation;
    }
    
    if (category) {
      newFilters.category = category;
    }

    setFilters(newFilters);
  }, [searchParams]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const getCategoryTitle = (slug: string) => {
    const category = categories?.find(cat => cat.slug === slug);
    return category?.title || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Products
          {navigationParam && ` - ${navigationParam.charAt(0).toUpperCase() + navigationParam.slice(1)}`}
          {categoryParam && ` - ${getCategoryTitle(categoryParam)}`}
        </h1>
        <p className="text-gray-600">
          Discover thousands of books with advanced search and filtering capabilities.
        </p>
        
      </div>

      <AdvancedSearch 
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      <InfiniteProductGrid 
        categoryId={undefined} 
        filters={enhancedFilters}
        itemsPerPage={20}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}