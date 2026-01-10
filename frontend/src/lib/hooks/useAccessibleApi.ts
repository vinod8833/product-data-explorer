import useSWR from 'swr';
import { useCallback, useEffect, useRef } from 'react';
import { api } from '../api';
import { 
  Navigation, 
  Category, 
  Product, 
  ProductDetail, 
  PaginatedResponse, 
  SearchFilters 
} from '../types';

function useAccessibleSWR<T>(
  key: string | null, 
  options: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  } = {}
) {
  const { data, error, isLoading, mutate } = useSWR<T>(key);
  const previousLoadingRef = useRef(isLoading);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return;

    if (announcementRef.current) {
      document.body.removeChild(announcementRef.current);
    }

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    announcementRef.current = announcement;

    setTimeout(() => {
      if (announcementRef.current === announcement) {
        document.body.removeChild(announcement);
        announcementRef.current = null;
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (previousLoadingRef.current && !isLoading && !error && data) {
      if (options.successMessage) {
        announce(options.successMessage);
      }
    } else if (previousLoadingRef.current && !isLoading && error) {
      const message = options.errorMessage || 'Failed to load data';
      announce(message, 'assertive');
    }

    previousLoadingRef.current = isLoading;
  }, [isLoading, error, data, announce, options]);

  return { data, error, isLoading, mutate, announce };
}

export function useProducts(
  categoryId?: number,
  page = 1,
  limit = 20,
  filters: SearchFilters = {}
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => 
        value !== undefined && value !== '' && value !== null
      )
    ),
  });

  const url = categoryId 
    ? `/products/category/${categoryId}?${params}`
    : `/products?${params}`;

  const result = useAccessibleSWR<PaginatedResponse<Product>>(
    url,
    {
      loadingMessage: 'Loading products...',
      errorMessage: 'Failed to load products',
      successMessage: 'Products loaded successfully',
    }
  );

  const { data, error, isLoading, mutate, announce } = result;

  return {
    products: data,
    isLoading,
    isError: error,
    mutate,
    announce
  };
}

export function useNavigation() {
  const { data, error, isLoading, mutate } = useAccessibleSWR<Navigation[]>(
    '/navigation',
    {
      loadingMessage: 'Loading navigation...',
      successMessage: 'Navigation loaded',
      errorMessage: 'Failed to load navigation'
    }
  );

  return {
    navigation: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useCategories(navigationId?: number, page = 1, limit = 20) {
  const url = navigationId 
    ? `/categories/navigation/${navigationId}?page=${page}&limit=${limit}`
    : `/categories?page=${page}&limit=${limit}`;

  const result = useAccessibleSWR<PaginatedResponse<Category>>(
    url,
    {
      loadingMessage: 'Loading categories...',
      errorMessage: 'Failed to load categories',
      successMessage: 'Categories loaded successfully',
    }
  );

  const { data, error, isLoading, mutate } = result;

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useViewHistory() {
  const trackView = useCallback(async (productId: number, categoryId?: number) => {
    try {
      await api.post('/view-history', {
        productId,
        categoryId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  }, []);

  return { trackView };
}