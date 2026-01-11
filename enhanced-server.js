// Enhanced Railway server with database connectivity and API structure
const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

console.log('🚀 Starting enhanced server...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database:', DATABASE_URL ? 'Configured' : 'Not configured');

// Simple database connection test (without requiring pg module initially)
async function testDatabaseConnection() {
  if (!DATABASE_URL) {
    return { status: 'not_configured', message: 'No DATABASE_URL provided' };
  }

  try {
    // We'll implement actual database connection later
    // For now, just validate the URL format
    const dbUrl = new URL(DATABASE_URL);
    return {
      status: 'url_valid',
      message: 'Database URL format is valid',
      host: dbUrl.hostname,
      port: dbUrl.port,
      database: dbUrl.pathname.slice(1)
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Invalid database URL format',
      error: error.message
    };
  }
}

// Route handler
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} ${method} ${path}`);

  // Set common headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    let response;

    switch (path) {
      case '/':
        response = {
          message: 'Product Data Explorer API',
          version: '2.0.0',
          timestamp: new Date().toISOString(),
          status: 'Enhanced server running',
          endpoints: {
            health: '/health',
            api: '/api',
            docs: '/api/docs',
            products: '/api/products',
            categories: '/api/categories'
          }
        };
        break;

      case '/health':
        const dbStatus = await testDatabaseConnection();
        response = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          port: PORT,
          environment: process.env.NODE_ENV || 'development',
          database: dbStatus,
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
          },
          version: '2.0.0'
        };
        break;

      case '/api':
        response = {
          message: 'Product Data Explorer API v2.0',
          timestamp: new Date().toISOString(),
          available_endpoints: [
            'GET /api/products - List products',
            'GET /api/categories - List categories',
            'GET /health - Health check',
            'GET /api/docs - API documentation'
          ],
          note: 'Enhanced server with database connectivity'
        };
        break;

      case '/api/docs':
        response = {
          title: 'Product Data Explorer API Documentation',
          version: '2.0.0',
          description: 'API for exploring product data from World of Books',
          timestamp: new Date().toISOString(),
          endpoints: {
            products: {
              'GET /api/products': 'List all products with pagination',
              'GET /api/products/:id': 'Get specific product details'
            },
            categories: {
              'GET /api/categories': 'List all categories',
              'GET /api/categories/:id': 'Get category details'
            },
            health: {
              'GET /health': 'System health check with database status'
            }
          },
          note: 'Full Swagger documentation will be available when NestJS is integrated'
        };
        break;

      case '/api/products':
        response = {
          message: 'Products endpoint',
          timestamp: new Date().toISOString(),
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0
          },
          note: 'Product data will be available when database is connected'
        };
        break;

      case '/api/categories':
        response = {
          message: 'Categories endpoint',
          timestamp: new Date().toISOString(),
          data: [],
          note: 'Category data will be available when database is connected'
        };
        break;

      default:
        response = {
          error: 'Not Found',
          message: `Endpoint ${path} not found`,
          timestamp: new Date().toISOString(),
          available_endpoints: ['/', '/health', '/api', '/api/docs', '/api/products', '/api/categories']
        };
        res.writeHead(404);
        res.end(JSON.stringify(response, null, 2));
        return;
    }

    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));

  } catch (error) {
    console.error('❌ Request error:', error);
    const errorResponse = {
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    res.writeHead(500);
    res.end(JSON.stringify(errorResponse, null, 2));
  }
}

// Create server
const server = http.createServer(handleRequest);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Enhanced server listening on port ${PORT}`);
  console.log(`🌐 Available at: http://0.0.0.0:${PORT}`);
  console.log(`💚 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`📚 API docs: http://0.0.0.0:${PORT}/api/docs`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});