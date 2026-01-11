const http = require('http');

console.log('🧪 Testing favicon fix...');

// Start the server
const { spawn } = require('child_process');
const server = spawn('node', ['index.js'], {
  env: { ...process.env, PORT: '8081' }
});

server.stdout.on('data', (data) => {
  console.log('Server:', data.toString().trim());
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString().trim());
});

// Wait for server to start, then test
setTimeout(() => {
  console.log('🌐 Testing endpoints...');
  
  const testEndpoints = [
    '/',
    '/health',
    '/favicon.ico',
    '/api',
    '/nonexistent'
  ];
  
  let completed = 0;
  
  testEndpoints.forEach((path, index) => {
    setTimeout(() => {
      const req = http.get(`http://localhost:8081${path}`, (res) => {
        console.log(`✅ ${path}: ${res.statusCode}`);
        completed++;
        
        if (completed === testEndpoints.length) {
          console.log('🎉 All tests completed successfully!');
          server.kill();
          process.exit(0);
        }
      });
      
      req.on('error', (err) => {
        console.error(`❌ ${path}: ${err.message}`);
        completed++;
        
        if (completed === testEndpoints.length) {
          server.kill();
          process.exit(1);
        }
      });
    }, index * 200);
  });
}, 2000);

// Cleanup after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout, cleaning up...');
  server.kill();
  process.exit(0);
}, 10000);