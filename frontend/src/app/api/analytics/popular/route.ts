import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('itemType') || 'product';
    const limit = parseInt(searchParams.get('limit') || '10');
    const timeframe = searchParams.get('timeframe') || 'week';

    let timeCondition = '';
    switch (timeframe) {
      case 'day':
        timeCondition = "AND vh.viewed_at >= NOW() - INTERVAL '1 day'";
        break;
      case 'week':
        timeCondition = "AND vh.viewed_at >= NOW() - INTERVAL '1 week'";
        break;
      case 'month':
        timeCondition = "AND vh.viewed_at >= NOW() - INTERVAL '1 month'";
        break;
      default:
        timeCondition = "AND vh.viewed_at >= NOW() - INTERVAL '1 week'";
    }

    const client = await pool.connect();
    
    try {
      let query = '';
      
      if (itemType === 'product') {
        query = `
          SELECT 
            p.id,
            p.title,
            p.author,
            p.price,
            p.currency,
            p.image_url as "imageUrl",
            COUNT(vh.id) as "viewCount"
          FROM view_history vh
          JOIN product p ON vh.item_id = p.id::text
          WHERE vh.item_type = 'product' ${timeCondition}
          GROUP BY p.id, p.title, p.author, p.price, p.currency, p.image_url
          ORDER BY "viewCount" DESC
          LIMIT $1
        `;
      } else if (itemType === 'category') {
        query = `
          SELECT 
            c.id,
            c.title,
            c.slug,
            COUNT(vh.id) as "viewCount"
          FROM view_history vh
          JOIN category c ON vh.item_id = c.id::text
          WHERE vh.item_type = 'category' ${timeCondition}
          GROUP BY c.id, c.title, c.slug
          ORDER BY "viewCount" DESC
          LIMIT $1
        `;
      } else {
        query = `
          SELECT 
            vh.item_id as "itemId",
            vh.item_type as "itemType",
            COUNT(vh.id) as "viewCount"
          FROM view_history vh
          WHERE vh.item_type = $2 ${timeCondition}
          GROUP BY vh.item_id, vh.item_type
          ORDER BY "viewCount" DESC
          LIMIT $1
        `;
      }

      const queryParams = itemType === 'product' || itemType === 'category' 
        ? [limit] 
        : [limit, itemType];

      const result = await client.query(query, queryParams);

      return NextResponse.json({
        success: true,
        data: result.rows,
        itemType,
        timeframe,
        limit,
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Popular Items API Error:', error);
    
    // Return mock popular items if database fails
    const mockPopularProducts = [
      {
        id: 1,
        title: 'Popular Book 1',
        author: 'Popular Author 1',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png&text=Popular+Book',
        viewCount: 150
      },
      {
        id: 2,
        title: 'Popular Book 2',
        author: 'Popular Author 2',
        price: 15.99,
        currency: 'GBP',
        imageUrl: 'https://dummyimage.com/300x400/cccccc/666666.png&text=Popular+Book',
        viewCount: 120
      }
    ];

    const mockPopularCategories = [
      { id: 1, title: 'Fiction', slug: 'fiction', viewCount: 200 },
      { id: 2, title: 'Non-Fiction', slug: 'non-fiction', viewCount: 150 }
    ];

    const itemType = new URL(request.url).searchParams.get('itemType') || 'product';
    const mockData = itemType === 'category' ? mockPopularCategories : mockPopularProducts;

    return NextResponse.json({
      success: true,
      data: mockData,
      itemType,
      timeframe: new URL(request.url).searchParams.get('timeframe') || 'week',
      limit: parseInt(new URL(request.url).searchParams.get('limit') || '10'),
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}