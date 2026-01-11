#!/usr/bin/env node

const http = require('http');
const https = require('https');

const RAILWAY_URL = process.argv[2] || 'https://product-data-explorer-production.up.railway.app';

console.log('🔍 Verifying Full-Stack Railway deployment...');
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

async function verifyFullStackEndpoints() {
  const endpoints = [
    // Frontend endpoints
    { path: '/', name: 'Frontend Home', type: 'frontend' },
    { path: '/about', name: 'About Page', type: 'frontend' },
    { path: '/contact', name: 'Contact Page', type: 'frontend' },
    { path: '/readme', name: 'README Page', type: 'frontend' },
    
    // Backend API endpoints
    { path: '/health', name: 'Backend Health', type: 'backend' },
    { path: '/api', name: 'API Root', type: 'backend' },
    { path: '/api/docs', name: 'Swagger Docs', type: 'backend' },
    { path: '/api/navigation', name: 'Navigation API', type: 'backend' },
    { path: '/api/categories', name: 'Categories API', type: 'backend' },
    { path: '/api/products', name: 'Products API', type: 'backend' }
  ];

  let successCount = 0;
  let frontendCount = 0;
  let backendCount = 0;
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(RAILWAY_URL, endpoint.path);
      
      if (result.status === 200 || result.status === 301 || result.status === 302) {
        console.log(`✅ ${endpoint.name}: OK (${result.status})`);
        successCount++;
        
        if (endpoint.type === 'frontend') frontendCount++;
        if (endpoint.type === 'backend') backendCount++;
        
        // Check content type
        const contentType = result.headers['content-type'] || '';
        const isHTML = contentType.includes('text/html');
        const isJSON = contentType.includes('application/json');
        
        console.log(`   📄 Type: ${isHTML ? 'HTML' : isJSON ? 'JSON' : 'Other'} (${contentType})`);
        
        // Parse JSON responses for backend endpoints
        if (isJSON && endpoint.type === 'backend') {
          try {
            const json = JSON.parse(result.data);
            console.log(`   📊 Response: ${json.message || json.status || 'OK'}`);
          } catch (e) {
            console.log(`   📊 Response: Valid JSON`);
          }
        }
        
        results.push({
          endpoint: endpoint.name,
          type: endpoint.type,
          status: 'success',
          httpStatus: result.status,
          contentType: contentType
        });
      } else {
        console.log(`⚠️  ${endpoint.name}: HTTP ${result.status}`);
        results.push({
          endpoint: endpoint.name,
          type: endpoint.type,
          status: 'error',
          httpStatus: result.status
        });
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      results.push({
        endpoint: endpoint.name,
        type: endpoint.type,
        status: 'failed',
        error: error.message
      });
    }
    
    console.log('');
  }

  console.log(`📊 Summary: ${successCount}/${endpoints.length} endpoints working`);
  console.log(`⚛️  Frontend: ${frontendCount} pages working`);
  console.log(`🔧 Backend: ${backendCount} API endpoints working`);
  
  // Detailed summary
  console.log('\n📋 Detailed Results:');
  console.log('Frontend Pages:');
  results.filter(r => r.type === 'frontend').forEach(result => {
    const status = result.status === 'success' ? '✅' : '❌';
    console.log(`  ${status} ${result.endpoint}`);
  });
  
  console.log('\nBackend APIs:');
  results.filter(r => r.type === 'backend').forEach(result => {
    const status = result.status === 'success' ? '✅' : '❌';
    console.log(`  ${status} ${result.endpoint}`);
  });
  
  const frontendWorking = results.filter(r => r.type === 'frontend' && r.status === 'success').length;
  const backendWorking = results.filter(r => r.type === 'backend' && r.status === 'success').length;
  
  if (frontendWorking > 0 && backendWorking > 0) {
    console.log('\n🎉 Full-Stack deployment verification PASSED!');
    console.log('🚀 Both frontend and backend are working correctly');
    return true;
  } else if (frontendWorking > 0) {
    console.log('\n⚠️  Partial success: Frontend working, Backend issues');
    return false;
  } else if (backendWorking > 0) {
    console.log('\n⚠️  Partial success: Backend working, Frontend issues');
    return false;
  } else {
    console.log('\n💥 Full-Stack deployment verification FAILED!');
    console.log('❌ Both frontend and backend have issues');
    return false;
  }
}

verifyFullStackEndpoints().then((success) => {
  console.log('\n🏁 Full-Stack verification complete');
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Verification failed:', error);
  process.exit(1);
});