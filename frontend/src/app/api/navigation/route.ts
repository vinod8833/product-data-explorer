import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Get all navigation items with their categories
      const result = await client.query(`
        SELECT 
          n.id,
          n.title,
          n.slug,
          n.source_url as "sourceUrl",
          n.last_scraped_at as "lastScrapedAt",
          n.created_at as "createdAt",
          n.updated_at as "updatedAt",
          json_agg(
            json_build_object(
              'id', c.id,
              'title', c.title,
              'slug', c.slug,
              'productCount', c.product_count,
              'parentId', c.parent_id
            ) ORDER BY c.title
          ) FILTER (WHERE c.id IS NOT NULL) as categories
        FROM navigation n
        LEFT JOIN category c ON n.id = c.navigation_id
        GROUP BY n.id, n.title, n.slug, n.source_url, n.last_scraped_at, n.created_at, n.updated_at
        ORDER BY n.title
      `);

      return NextResponse.json({
        success: true,
        data: result.rows,
        total: result.rows.length,
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Navigation API Error:', error);
    
    // Return mock data if database fails
    const mockData = [
      {
        id: 1,
        title: 'Books',
        slug: 'books',
        sourceUrl: null,
        lastScrapedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categories: [
          { id: 1, title: 'Fiction', slug: 'fiction', productCount: 150, parentId: null },
          { id: 2, title: 'Non-Fiction', slug: 'non-fiction', productCount: 89, parentId: null },
          { id: 3, title: 'Children\'s Books', slug: 'childrens-books', productCount: 67, parentId: null }
        ]
      },
      {
        id: 2,
        title: 'Categories',
        slug: 'categories',
        sourceUrl: null,
        lastScrapedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categories: [
          { id: 4, title: 'Science Fiction', slug: 'science-fiction', productCount: 45, parentId: null },
          { id: 5, title: 'Romance', slug: 'romance', productCount: 78, parentId: null },
          { id: 6, title: 'Mystery', slug: 'mystery', productCount: 56, parentId: null }
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockData,
      total: mockData.length,
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, sourceUrl } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO navigation (title, slug, source_url, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING *`,
        [title, slug, sourceUrl]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Navigation item created successfully'
      }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create Navigation Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create navigation item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}