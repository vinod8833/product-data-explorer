#!/usr/bin/env node

const http = require('http');
const https = require('https');

const RAILWAY_URL = process.argv[2] || 'https://your-app.railway.app';

console.log('🔍 Verifying Railway deployment...');
console.log(`📡 Testing URL: ${RAILWAY_URL}`);

function makeRequest(url, path = '') {
  return new Promise((resolve, reject) => {
    const fullUrl = url + path;
    const client = fullUrl.startsWith('https') ? https : http;
    
    console.log(`🌐 Testing: ${fullUrl}`);
    
    const req = client.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verifyEndpoints() {
  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/health', name: 'Health Check' },
    { path: '/api', name: 'API Root' },
    { path: '/api/docs', name: 'API Documentation' }
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(RAILWAY_URL, endpoint.path);
      
      if (result.status === 200) {
        console.log(`✅ ${endpoint.name}: OK (${result.status})`);
        
        try {
          const json = JSON.parse(result.data);
          console.log(`   📄 Response:`, json);
        } catch (e) {
          console.log(`   📄 Response: ${result.data.substring(0, 100)}...`);
        }
      } else {
        console.log(`⚠️  ${endpoint.name}: ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
    
    console.log('');
  }
}

verifyEndpoints().then(() => {
  console.log('🏁 Verification complete');
}).catch(error => {
  console.error('💥 Verification failed:', error);
  process.exit(1);
});