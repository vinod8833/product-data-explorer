#!/usr/bin/env node

const http = require('http');
const https = require('https');

const RAILWAY_URL = process.argv[2] || 'https://product-data-explorer-production.up.railway.app';

console.log('🔍 Verifying Enhanced Railway deployment...');
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
    
    req.on('error', (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout (15s)'));
    });
  });
}

async function verifyEndpoints() {
  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/health', name: 'Health Check' },
    { path: '/api', name: 'API Info' },
    { path: '/api/docs', name: 'API Documentation' },
    { path: '/api/products', name: 'Products Endpoint' },
    { path: '/api/categories', name: 'Categories Endpoint' }
  ];

  let successCount = 0;
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(RAILWAY_URL, endpoint.path);
      
      if (result.status === 200) {
        console.log(`✅ ${endpoint.name}: OK (${result.status})`);
        successCount++;
        
        try {
          const json = JSON.parse(result.data);
          console.log(`   📄 Response preview:`, {
            message: json.message || json.title || 'No message',
            status: json.status || 'N/A',
            version: json.version || 'N/A'
          });
          
          results.push({
            endpoint: endpoint.name,
            status: 'success',
            data: json
          });
        } catch (e) {
          console.log(`   📄 Response: ${result.data.substring(0, 100)}...`);
          results.push({
            endpoint: endpoint.name,
            status: 'success',
            data: result.data.substring(0, 200)
          });
        }
      } else {
        console.log(`⚠️  ${endpoint.name}: HTTP ${result.status}`);
        console.log(`   📄 Response: ${result.data.substring(0, 200)}`);
        results.push({
          endpoint: endpoint.name,
          status: 'error',
          httpStatus: result.status
        });
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      results.push({
        endpoint: endpoint.name,
        status: 'failed',
        error: error.message
      });
    }
    
    console.log('');
  }

  console.log(`📊 Summary: ${successCount}/${endpoints.length} endpoints working`);
  
  if (successCount === endpoints.length) {
    console.log('\n🎉 Enhanced deployment verification PASSED!');
    console.log('🚀 All API endpoints are responding correctly');
    return true;
  } else {
    console.log('\n💥 Enhanced deployment verification FAILED!');
    console.log(`❌ ${endpoints.length - successCount} endpoints not working`);
    return false;
  }
}

verifyEndpoints().then((success) => {
  console.log('\n🏁 Enhanced verification complete');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Verification failed:', error);
  process.exit(1);
});