export interface Navigation {
  id: number;
  title: string;
  slug: string;
  sourceUrl?: string;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  navigationId: number;
  parentId?: number;
  title: string;
  slug: string;
  sourceUrl?: string;
  productCount: number;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface Product {
  id: number;
  sourceId: string;
  categoryId?: number;
  title: string;
  author?: string;
  price?: number | string;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  inStock: boolean;
  lastScrapedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface ProductDetail extends Product {
  description?: string;
  specs?: Record<string, any>;
  ratingsAvg?: number | string;
  reviewsCount?: number;
  publisher?: string;
  publicationDate?: string;
  isbn?: string;
  pageCount?: number;
  genres?: string[];
  reviews?: Review[];
}

export interface Review {
  id: number;
  productId: number;
  author?: string;
  rating?: number;
  text?: string;
  reviewDate?: string;
  helpfulCount: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ScrapeJob {
  id: number;
  targetUrl: string;
  targetType: 'navigation' | 'category' | 'product_list' | 'product_detail';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt?: string;
  finishedAt?: string;
  errorLog?: string;
  itemsScraped: number;
  retryCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  q?: string;
  categoryId?: number;
  navigation?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  genres?: string[];
  minRating?: number;
  conditions?: string[];
}