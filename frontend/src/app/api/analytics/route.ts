import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemType, itemId, sessionId, userId, userAgent, ipAddress } = body;

    if (!itemType || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Item type and ID are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO view_history (item_type, item_id, session_id, user_id, user_agent, ip_address, viewed_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         RETURNING *`,
        [itemType, itemId, sessionId, userId, userAgent, ipAddress]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'View recorded successfully'
      }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Analytics Record Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record view',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    const itemType = searchParams.get('itemType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await pool.connect();
    
    try {
      let query = `
        SELECT 
          vh.id,
          vh.item_type as "itemType",
          vh.item_id as "itemId",
          vh.session_id as "sessionId",
          vh.user_id as "userId",
          vh.viewed_at as "viewedAt",
          CASE 
            WHEN vh.item_type = 'product' THEN p.title
            WHEN vh.item_type = 'category' THEN c.title
            ELSE vh.item_id::text
          END as "itemTitle"
        FROM view_history vh
        LEFT JOIN product p ON vh.item_type = 'product' AND vh.item_id = p.id::text
        LEFT JOIN category c ON vh.item_type = 'category' AND vh.item_id = c.id::text
        WHERE 1=1
      `;
      
      const queryParams = [];
      let paramCount = 1;

      if (sessionId) {
        query += ` AND vh.session_id = $${paramCount++}`;
        queryParams.push(sessionId);
      }

      if (userId) {
        query += ` AND vh.user_id = $${paramCount++}`;
        queryParams.push(userId);
      }

      if (itemType) {
        query += ` AND vh.item_type = $${paramCount++}`;
        queryParams.push(itemType);
      }

      query += ` ORDER BY vh.viewed_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      queryParams.push(limit, offset);

      const result = await client.query(query, queryParams);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM view_history vh WHERE 1=1';
      const countParams = [];
      let countParamCount = 1;

      if (sessionId) {
        countQuery += ` AND vh.session_id = $${countParamCount++}`;
        countParams.push(sessionId);
      }

      if (userId) {
        countQuery += ` AND vh.user_id = $${countParamCount++}`;
        countParams.push(userId);
      }

      if (itemType) {
        countQuery += ` AND vh.item_type = $${countParamCount++}`;
        countParams.push(itemType);
      }

      const countResult = await client.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      return NextResponse.json({
        success: true,
        data: result.rows,
        total,
        limit,
        offset,
        timestamp: new Date().toISOString()
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Analytics Get Error:', error);
    
    // Return mock data if database fails
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      limit: parseInt(new URL(request.url).searchParams.get('limit') || '50'),
      offset: parseInt(new URL(request.url).searchParams.get('offset') || '0'),
      timestamp: new Date().toISOString(),
      note: 'Using mock data - database connection failed'
    });
  }
}