import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const author = searchParams.get('author');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    if (!q) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    const client = await pool.connect();
    
    try {
      let query = `
        SELECT 
          p.id,
          p.source_id as "sourceId",
          p.category_id as "categoryId",
          p.title,
          p.author,
          p.price,
          p.currency,
          p.image_url as "imageUrl",
          p.source_url as "sourceUrl",
          p.in_stock as "inStock",
          p.last_scraped_at as "lastScrapedAt",
          p.created_at as "createdAt",
          p.updated_at as "updatedAt",
          c.title as "categoryTitle",
          c.slug as "categorySlug",
          ts_rank(to_tsvector('english', p.title || ' ' || COALESCE(p.author, '')), plainto_tsquery('english', $1)) as rank
        FROM product p
        LEFT JOIN category c ON p.category_id = c.id
        WHERE to_tsvector('english', p.title || ' ' || COALESCE(p.author, '')) @@ plainto_tsquery('english', $1)
      `;
      
      const queryParams = [q];
      let paramCount = 2;

      if (categoryId) {
        query += ` AND p.category_id = $${paramCount++}`;
        queryParams.push(categoryId);
      }

      if (author) {
        query += ` AND p.author ILIKE $${paramCount++}`;
        queryParams.push(`%${author}%`);
      }

      if (minPrice) {
        query += ` AND p.price >= $${paramCount++}`;
        queryParams.push(minPrice);
      }

      if (maxPrice) {
        query += ` AND p.price <= $${paramCount++}`;
        queryParams.push(maxPrice);
      }

      query += ` ORDER BY rank DESC, p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      queryParams.push(limit.toString(), offset.toString());

      const result = await client.query(query, queryParams);

      // Get total count with same filters
      let countQuery = `
        SELECT COUNT(*) 
        FROM product p
        WHERE to_tsvector('english', p.title || ' ' || COALESCE(p.author, '')) @@ plainto_tsquery('english', $1)
      `;
      const countParams = [q];
      let countParamCount = 2;

      if (categoryId) {
        countQuery += ` AND p.category_id = $${countParamCount++}`;
        countParams.push(categoryId);
      }

      if (author) {
        countQuery += ` AND p.author ILIKE $${countParamCount++}`;
        countParams.push(`%${author}%`);
      }

      if (minPrice) {
        countQuery += ` AND p.price >= $${countParamCount++}`;
        countParams.push(minPrice);
      }

      if (maxPrice) {
        countQuery += ` AND p.price <= $${countParamCount++}`;
        countParams.push(maxPrice);
      }

      const countResult = await client.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        query: q,
        filters: {
          categoryId,
          author,
          minPrice,
          maxPrice
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Product Search API Error:', error);
    
    // Return mock search results if database fails
    const mockResults = [
      {
        id: 1,
        sourceId: 'wob-001',
        categoryId: 1,
        title: 'Search Result Book 1',
        author: 'Search Author 1',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png&text=Book+Cover',
        sourceUrl: 'https://worldofbooks.com/product/1',
        inStock: true,
        lastScrapedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryTitle: 'Fiction',
        categorySlug: 'fiction',
        rank: 0.5
      }
    ];

    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20');

    return NextResponse.json({
      success: true,
      data: mockResults,
      pagination: {
        page,
        limit,
        total: mockResults.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      query: new URL(request.url).searchParams.get('q'),
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}