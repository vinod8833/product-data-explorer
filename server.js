const http = require('http');

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

console.log('🚀 Minimal Railway Server Starting...');
console.log('Port:', port);
console.log('Host:', host);
console.log('NODE_ENV:', process.env.NODE_ENV);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      port: port,
      environment: process.env.NODE_ENV || 'development'
    }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Product Data Explorer API - Railway Deployment Test',
      timestamp: new Date().toISOString(),
      port: port,
      endpoints: {
        health: '/health'
      }
    }));
  }
});

server.listen(port, host, () => {
  console.log(`✅ Server running at http://${host}:${port}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('📴 Shutting down...');
  server.close(() => process.exit(0));
});