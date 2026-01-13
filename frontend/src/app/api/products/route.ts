import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    // Forward all query parameters to the backend
    const backendApiUrl = `${backendUrl}/products?${searchParams.toString()}`;
    
    console.log('Proxying request to backend:', backendApiUrl);
    
    const response = await fetch(backendApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return the backend response directly
    return NextResponse.json(data);

  } catch (error) {
    console.error('Frontend API Proxy Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const backendApiUrl = `${backendUrl}/products`;
    
    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Frontend API Proxy Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product via backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}