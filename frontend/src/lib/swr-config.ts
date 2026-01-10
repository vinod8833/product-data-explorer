import useSWR, { SWRConfiguration, mutate } from 'swr';
import { getFromStorage, setToStorage, announceToScreenReader } from './utils';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || '/api'
  : '/api';

const fetcher = async (url: string) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).info = await response.text();
    throw error;
  }

  return response.json();
};

export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  loadingTimeout: 10000,
  onError: (error, key) => {
    console.error('SWR Error:', error, 'Key:', key);
    
    if (error.status >= 500) {
      announceToScreenReader('Server error occurred. Please try again later.');
    } else if (error.status === 404) {
      announceToScreenReader('Requested content not found.');
    } else {
      announceToScreenReader('An error occurred while loading data.');
    }
  },
  onSuccess: (data, key) => {
    if (typeof window !== 'undefined' && data) {
      setToStorage(`swr-cache-${key}`, {
        data,
        timestamp: Date.now(),
      });
    }
  },
  fallback: (key: string) => {
    if (typeof window !== 'undefined') {
      const cached = getFromStorage(`swr-cache-${key}`, null) as { data: any; timestamp: number } | null;
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
        return cached.data;
      }
    }
    return undefined;
  },
};

export function useProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  navigation?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
} = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const key = `/products${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate: mutateProducts } = useSWR(key, {
    ...swrConfig,
    keepPreviousData: true, 
  });

  return {
    products: data?.data || [],
    pagination: data?.pagination || null,
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateProducts,
  };
}

export function useProduct(id: string | number) {
  const key = id ? `/products/${id}` : null;
  
  const { data, error, isLoading, mutate: mutateProduct } = useSWR(key, swrConfig);

  return {
    product: data || null,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateProduct,
  };
}

export function useCategories() {
  const { data, error, isLoading } = useSWR('/categories', swrConfig);

  return {
    categories: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

export function useNavigation() {
  const { data, error, isLoading } = useSWR('/navigation', swrConfig);

  return {
    navigation: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

export function useSearch(query: string, options: {
  enabled?: boolean;
  limit?: number;
} = {}) {
  const { enabled = true, limit = 20 } = options;
  const key = enabled && query ? `/products?search=${encodeURIComponent(query)}&limit=${limit}` : null;
  
  const { data, error, isLoading } = useSWR(key, {
    ...swrConfig,
    dedupingInterval: 2000, 
  });

  return {
    results: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: !!error,
    error,
  };
}

export function prefetchProducts(params: Parameters<typeof useProducts>[0] = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const key = `/products${queryString ? `?${queryString}` : ''}`;
  
  return mutate(key, fetcher(key), { revalidate: false });
}

export function prefetchProduct(id: string | number) {
  const key = `/products/${id}`;
  return mutate(key, fetcher(key), { revalidate: false });
}

export function invalidateProducts() {
  return mutate(
    (key) => typeof key === 'string' && key.startsWith('/products'),
    undefined,
    { revalidate: true }
  );
}

export function invalidateProduct(id: string | number) {
  return mutate(`/products/${id}`, undefined, { revalidate: true });
}