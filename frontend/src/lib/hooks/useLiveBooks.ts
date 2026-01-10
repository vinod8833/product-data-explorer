import { useState, useEffect } from 'react';

export interface LiveProduct {
  sourceId: string;
  title: string;
  author?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  inStock: boolean;
}

export interface LiveSearchResponse {
  data: LiveProduct[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  facets?: any;
}

export interface LiveSearchFilters {
  q?: string;
  author?: string;
  publisher?: string;
  minPrice?: number;
  maxPrice?: number;
  conditions?: string;
  categories?: string;
}

export type SearchType = 'search' | 'advanced' | 'budget' | 'collection';

export function useLiveBooks(
  searchType: SearchType = 'search',
  initialFilters: LiveSearchFilters = {},
  autoFetch: boolean = true
) {
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LiveSearchFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const buildUrl = (page: number = 1, currentFilters: LiveSearchFilters = filters) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
    });

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      }
    });

    switch (searchType) {
      case 'advanced':
        return `/api/products/live/advanced?${params}`;
      case 'budget':
        return `/api/products/live/budget?${params}`;
      case 'collection':
        const collectionId = currentFilters.categories || '520304558353'; // Default collection
        return `/api/products/live/collection/${collectionId}?${params}`;
      default:
        return `/api/products/live/search?${params}`;
    }
  };

  const fetchProducts = async (page: number = 1, newFilters?: LiveSearchFilters) => {
    setLoading(true);
    setError(null);

    const filtersToUse = newFilters || filters;

    try {
      const url = buildUrl(page, filtersToUse);
      console.log('Fetching live books from:', url);

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

      console.log(`Loaded ${data.data?.length || 0} live products`);
      return data;
    } catch (err) {
      console.error('Error fetching live products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<LiveSearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    return updatedFilters;
  };

  const search = async (newFilters?: Partial<LiveSearchFilters>) => {
    const filtersToUse = newFilters ? updateFilters(newFilters) : filters;
    return fetchProducts(1, filtersToUse);
  };

  const clearFilters = () => {
    setFilters({});
    return fetchProducts(1, {});
  };

  const goToPage = (page: number) => {
    return fetchProducts(page);
  };

  const nextPage = () => {
    if (pagination.hasNext) {
      return fetchProducts(pagination.page + 1);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrev) {
      return fetchProducts(pagination.page - 1);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProducts(1);
    }
  }, [searchType]); 

  return {
    products,
    pagination,
    filters,
    loading,
    error,
    
    search,
    fetchProducts,
    updateFilters,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    
    buildUrl,
  };
}

export const LIVE_BOOK_COLLECTIONS = {
  SALE_COLLECTION_1: '520304558353',
  SALE_COLLECTION_2: '520304722193',
  SALE_COLLECTION_3: '520304820497',
} as const;

export const BOOK_CONDITIONS = {
  LIKE_NEW: 'LIKE_NEW',
  VERY_GOOD: 'VERY_GOOD',
  GOOD: 'GOOD',
  WELL_READ: 'WELL_READ',
} as const;

export const formatBookPrice = (price: number, currency: string = 'GBP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'GBP' ? 'GBP' : 'USD',
  }).format(price);
};

export const getConditionDisplayName = (condition: string) => {
  return condition.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};