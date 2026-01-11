#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3002;

console.log('🚀 Starting Product Explorer Full-Stack Application');
console.log('================================================');
console.log(`Main Port: ${PORT}`);
console.log(`Backend Port: ${BACKEND_PORT}`);
console.log(`Frontend Port: ${FRONTEND_PORT}`);
console.log('Database:', process.env.DATABASE_URL ? 'Connected' : 'Not configured');

// Create proxy server
const proxy = httpProxy.createProxyServer({});

// Start backend server
console.log('🔧 Starting NestJS Backend...');
const backendProcess = spawn('node', ['dist/main-production.js'], {
  cwd: './backend',
  env: {
    ...process.env,
    PORT: BACKEND_PORT,
    HOST: '0.0.0.0'
  },
  stdio: 'pipe'
});

backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Start frontend server
console.log('⚛️  Starting Next.js Frontend...');
const frontendProcess = spawn('npm', ['start'], {
  cwd: './frontend',
  env: {
    ...process.env,
    PORT: FRONTEND_PORT,
    NEXT_PUBLIC_API_URL: `http://localhost:${BACKEND_PORT}/api`
  },
  stdio: 'pipe'
});

frontendProcess.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

frontendProcess.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Wait for services to start
setTimeout(() => {
  console.log('🌐 Creating proxy server...');
  
  // Create main server that proxies requests
  const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // Proxy API requests to backend
    if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
      proxy.web(req, res, {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true
      });
    } else {
      // Proxy everything else to frontend
      proxy.web(req, res, {
        target: `http://localhost:${FRONTEND_PORT}`,
        changeOrigin: true
      });
    }
  });

  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Proxy Error',
        message: 'Failed to proxy request',
        timestamp: new Date().toISOString()
      }));
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Full-stack application running!');
    console.log(`🌐 Main URL: http://0.0.0.0:${PORT}`);
    console.log(`⚛️  Frontend: http://0.0.0.0:${FRONTEND_PORT}`);
    console.log(`🔧 Backend: http://0.0.0.0:${BACKEND_PORT}`);
    console.log(`📚 API Docs: http://0.0.0.0:${PORT}/api/docs`);
    console.log(`💚 Health: http://0.0.0.0:${PORT}/health`);
  });

  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
  });

}, 5000); // Wait 5 seconds for services to start

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down...');
  backendProcess.kill('SIGTERM');
  frontendProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down...');
  backendProcess.kill('SIGINT');
  frontendProcess.kill('SIGINT');
  process.exit(0);
});

// Handle process exits
backendProcess.on('exit', (code) => {
  console.log(`🔧 Backend process exited with code ${code}`);
  if (code !== 0) {
    console.error('❌ Backend failed, shutting down...');
    process.exit(1);
  }
});

frontendProcess.on('exit', (code) => {
  console.log(`⚛️  Frontend process exited with code ${code}`);
  if (code !== 0) {
    console.error('❌ Frontend failed, shutting down...');
    process.exit(1);
  }
});