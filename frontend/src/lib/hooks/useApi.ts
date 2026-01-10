import { useState, useEffect } from 'react';
import { api } from '../api';
import { Navigation, Category, Product, ProductDetail, PaginatedResponse, ScrapeJob, SearchFilters } from '../types';

export function useNavigation() {
  const [data, setData] = useState<Navigation[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/navigation');
      setData(response.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    navigation: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useCategories(navigationId?: number, page = 1, limit = 20) {
  const [data, setData] = useState<PaginatedResponse<Category> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = navigationId 
        ? `/categories/navigation/${navigationId}?page=${page}&limit=${limit}`
        : `/categories?page=${page}&limit=${limit}`;
      const response = await api.get(url);
      setData(response.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigationId, page, limit]);

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useAllCategories() {
  const [data, setData] = useState<Category[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/categories?page=1&limit=100');
      setData(response.data.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useProducts(
  categoryId?: number, 
  page = 1, 
  limit = 20, 
  filters: SearchFilters = {}
) {
  const [data, setData] = useState<PaginatedResponse<Product> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        ),
      });

      const url = categoryId 
        ? `/products/category/${categoryId}?${params}`
        : `/products?${params}`;
        
      console.log('Fetching products from:', url);
      
      const response = await api.get(url);
      
      setData(response.data);
      setError(undefined);
    } catch (err) {
      console.error('Products fetch error:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId, page, limit, JSON.stringify(filters)]);

  return {
    products: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useProduct(id: number) {
  const [data, setData] = useState<ProductDetail | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await api.get(`/products/${id}`);
      setData(response.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    product: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useProductSearch(query: string, page = 1, limit = 20) {
  const [data, setData] = useState<PaginatedResponse<Product> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    if (!query || !query.trim()) {
      setData(undefined);
      setIsLoading(false);
      setError(undefined);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(undefined);
      
      const url = `/products/search?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${limit}`;
      console.log('Searching with URL:', url);
      
      const response = await api.get(url);
      console.log('Search response:', response.data);
      
      setData(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err);
      setData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, page, limit]);

  return {
    products: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useScrapeJobs(page = 1, limit = 10) {
  const [data, setData] = useState<PaginatedResponse<ScrapeJob> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/scraping/jobs?page=${page}&limit=${limit}`);
      setData(response.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return {
    jobs: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}

export function useScrapeStats() {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/scraping/stats');
      setData(response.data);
      setError(undefined);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate: fetchData,
  };
}