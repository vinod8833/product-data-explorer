import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocs = {
    title: 'Product Data Explorer API',
    version: '2.0.0',
    description: 'Next.js API for exploring products from World of Books with live scraping capabilities',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: {
        path: '/api/health',
        method: 'GET',
        description: 'Health check endpoint',
        response: {
          status: 'ok | error',
          timestamp: 'ISO string',
          uptime: 'number (seconds)',
          environment: 'string',
          version: 'string',
          service: 'string',
          database: 'configured | not configured'
        }
      },
      navigation: {
        list: {
          path: '/api/navigation',
          method: 'GET',
          description: 'Get all navigation items with their categories',
          response: {
            success: 'boolean',
            data: 'array of navigation objects',
            total: 'number',
            timestamp: 'ISO string'
          }
        },
        create: {
          path: '/api/navigation',
          method: 'POST',
          description: 'Create new navigation item',
          body: {
            title: 'string (required)',
            slug: 'string (required)',
            sourceUrl: 'string (optional)'
          }
        },
        getById: {
          path: '/api/navigation/[id]',
          method: 'GET',
          description: 'Get navigation item by ID'
        }
      },
      categories: {
        list: {
          path: '/api/categories',
          method: 'GET',
          description: 'Get all categories with pagination',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 20)',
            navigationId: 'number (optional)'
          },
          response: {
            success: 'boolean',
            data: 'array of category objects',
            pagination: 'pagination object'
          }
        },
        create: {
          path: '/api/categories',
          method: 'POST',
          description: 'Create new category',
          body: {
            navigationId: 'number (required)',
            parentId: 'number (optional)',
            title: 'string (required)',
            slug: 'string (required)',
            sourceUrl: 'string (optional)'
          }
        },
        getById: {
          path: '/api/categories/[id]',
          method: 'GET',
          description: 'Get category by ID'
        },
        update: {
          path: '/api/categories/[id]',
          method: 'PATCH',
          description: 'Update category by ID'
        },
        delete: {
          path: '/api/categories/[id]',
          method: 'DELETE',
          description: 'Delete category by ID'
        }
      },
      products: {
        list: {
          path: '/api/products',
          method: 'GET',
          description: 'Get all products with pagination and filtering',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 20)',
            categoryId: 'number (optional)',
            q: 'string (search query, optional)',
            author: 'string (optional)',
            minPrice: 'number (optional)',
            maxPrice: 'number (optional)'
          },
          response: {
            success: 'boolean',
            data: 'array of product objects',
            pagination: 'pagination object',
            filters: 'applied filters object'
          }
        },
        create: {
          path: '/api/products',
          method: 'POST',
          description: 'Create new product',
          body: {
            sourceId: 'string (required)',
            categoryId: 'number (optional)',
            title: 'string (required)',
            author: 'string (optional)',
            price: 'number (optional)',
            currency: 'string (default: GBP)',
            imageUrl: 'string (optional)',
            sourceUrl: 'string (required)',
            inStock: 'boolean (default: true)'
          }
        },
        getById: {
          path: '/api/products/[id]',
          method: 'GET',
          description: 'Get product by ID with full details'
        },
        update: {
          path: '/api/products/[id]',
          method: 'PATCH',
          description: 'Update product by ID'
        },
        delete: {
          path: '/api/products/[id]',
          method: 'DELETE',
          description: 'Delete product by ID'
        },
        search: {
          path: '/api/products/search',
          method: 'GET',
          description: 'Full-text search products',
          queryParams: {
            q: 'string (required)',
            page: 'number (default: 1)',
            limit: 'number (default: 20)',
            categoryId: 'number (optional)',
            author: 'string (optional)',
            minPrice: 'number (optional)',
            maxPrice: 'number (optional)'
          },
          response: {
            success: 'boolean',
            data: 'array of product objects with rank',
            pagination: 'pagination object',
            query: 'search query',
            filters: 'applied filters object'
          }
        }
      },
      analytics: {
        recordView: {
          path: '/api/analytics',
          method: 'POST',
          description: 'Record a view event for analytics',
          body: {
            itemType: 'string (product|category|search)',
            itemId: 'string (required)',
            sessionId: 'string (optional)',
            userId: 'string (optional)',
            userAgent: 'string (optional)',
            ipAddress: 'string (optional)'
          }
        },
        getHistory: {
          path: '/api/analytics',
          method: 'GET',
          description: 'Get view history',
          queryParams: {
            sessionId: 'string (optional)',
            userId: 'string (optional)',
            itemType: 'string (optional)',
            limit: 'number (default: 50)',
            offset: 'number (default: 0)'
          }
        },
        getPopular: {
          path: '/api/analytics/popular',
          method: 'GET',
          description: 'Get popular items by view count',
          queryParams: {
            itemType: 'string (product|category, default: product)',
            limit: 'number (default: 10)',
            timeframe: 'string (day|week|month, default: week)'
          }
        }
      }
    },
    dataModels: {
      Product: {
        id: 'number',
        sourceId: 'string',
        categoryId: 'number | null',
        title: 'string',
        author: 'string | null',
        price: 'number | null',
        currency: 'string',
        imageUrl: 'string | null',
        sourceUrl: 'string',
        inStock: 'boolean',
        lastScrapedAt: 'ISO string | null',
        createdAt: 'ISO string',
        updatedAt: 'ISO string',
        categoryTitle: 'string | null',
        categorySlug: 'string | null'
      },
      Category: {
        id: 'number',
        navigationId: 'number',
        parentId: 'number | null',
        title: 'string',
        slug: 'string',
        sourceUrl: 'string | null',
        productCount: 'number',
        lastScrapedAt: 'ISO string | null',
        createdAt: 'ISO string',
        updatedAt: 'ISO string',
        navigationTitle: 'string | null',
        parentTitle: 'string | null'
      },
      Navigation: {
        id: 'number',
        title: 'string',
        slug: 'string',
        sourceUrl: 'string | null',
        lastScrapedAt: 'ISO string | null',
        createdAt: 'ISO string',
        updatedAt: 'ISO string',
        categories: 'array of Category objects'
      },
      Pagination: {
        page: 'number',
        limit: 'number',
        total: 'number',
        totalPages: 'number',
        hasNext: 'boolean',
        hasPrev: 'boolean'
      }
    },
    examples: {
      searchProducts: {
        url: '/api/products/search?q=javascript&page=1&limit=10',
        description: 'Search for products containing "javascript"'
      },
      getProductsByCategory: {
        url: '/api/products?categoryId=1&page=1&limit=20',
        description: 'Get products from category ID 1'
      },
      recordProductView: {
        url: '/api/analytics',
        method: 'POST',
        body: {
          itemType: 'product',
          itemId: '123',
          sessionId: 'session-abc-123'
        },
        description: 'Record a product view for analytics'
      }
    },
    notes: [
      'All endpoints return JSON responses',
      'Database connection failures return mock data with a "note" field',
      'Pagination is 1-indexed (first page is page=1)',
      'All timestamps are in ISO 8601 format',
      'Price values are in the specified currency (default: GBP)',
      'Search uses PostgreSQL full-text search with ranking'
    ]
  };

  return NextResponse.json(apiDocs, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    }
  });
}