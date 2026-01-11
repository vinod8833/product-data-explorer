// Production Railway server for Product Data Explorer
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log('🚀 Starting Product Data Explorer API...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL ? 'Connected' : 'Not configured');

// Check if we should use the full NestJS backend
const useFullBackend = process.env.DATABASE_URL && NODE_ENV === 'production';

if (useFullBackend) {
  console.log('🎯 Starting full NestJS backend...');
  
  // Start the NestJS application
  const backendProcess = spawn('node', ['backend/dist/main-production.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: PORT,
      HOST: '0.0.0.0'
    }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Backend process error:', err);
    // Fall back to simple server
    startSimpleServer();
  });

  backendProcess.on('exit', (code) => {
    console.log(`🔄 Backend process exited with code ${code}`);
    if (code !== 0) {
      console.log('🔄 Falling back to simple server...');
      startSimpleServer();
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down backend...');
    backendProcess.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down backend...');
    backendProcess.kill('SIGINT');
  });

} else {
  console.log('🔧 Starting simple fallback server...');
  startSimpleServer();
}

function startSimpleServer() {
  const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // Set headers early
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    let response;
    let statusCode = 200;
    
    if (req.url === '/health') {
      response = {
        status: 'ok',
        message: 'Product Data Explorer API - Simple Mode',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: PORT,
        environment: NODE_ENV,
        mode: 'fallback',
        database: process.env.DATABASE_URL ? 'configured' : 'not configured',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
      };
    } else if (req.url === '/api' || req.url === '/api/') {
      response = {
        message: 'Product Data Explorer API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          api: '/api',
          docs: '/api/docs (available in full mode)'
        },
        note: 'Running in simple mode. Full NestJS API will be available once database is connected.'
      };
    } else if (req.url === '/api/docs') {
      response = {
        message: 'API Documentation',
        note: 'Swagger documentation is available in full NestJS mode',
        fallback: 'Simple API endpoints available',
        endpoints: [
          'GET /health - Health check',
          'GET /api - API information',
          'GET / - Root endpoint'
        ]
      };
    } else if (req.url === '/' || req.url === '/favicon.ico') {
      // Handle favicon.ico requests gracefully
      if (req.url === '/favicon.ico') {
        response = {
          message: 'No favicon available',
          note: 'This is an API server'
        };
      } else {
        response = {
          message: 'Product Data Explorer API',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          status: 'Railway deployment successful',
          mode: useFullBackend ? 'full' : 'simple',
          endpoints: {
            health: '/health',
            api: '/api',
            docs: '/api/docs'
          },
          github: 'https://github.com/vinod8833/product-data-explorer'
        };
      }
    } else {
      statusCode = 404;
      response = {
        error: 'Not Found',
        message: `Endpoint ${req.url} not found`,
        available: ['/', '/health', '/api', '/api/docs'],
        timestamp: new Date().toISOString()
      };
    }
    
    // Only call writeHead once
    res.writeHead(statusCode);
    res.end(JSON.stringify(response, null, 2));
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Simple server listening on port ${PORT}`);
    console.log(`🌐 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`📚 API info: http://0.0.0.0:${PORT}/api`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}