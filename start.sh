#!/bin/bash
set -e

echo "🚀 Starting backend application..."
echo "Current directory: $(pwd)"
echo "Contents: $(ls -la)"

echo "📁 Changing to backend directory..."
cd backend

echo "Current directory after cd: $(pwd)"
echo "Contents: $(ls -la)"

echo "📋 Environment check:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..." # Only show first 20 chars for security

echo "🔍 Checking if dist directory exists..."
if [ -d "dist" ]; then
    echo "✅ dist directory found"
    ls -la dist/
else
    echo "❌ dist directory not found - running build..."
    npm run build
fi

echo "🗄️ Testing database connection..."
node -e "
const { Client } = require('pg');
const client = new Client({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
client.connect()
  .then(() => {
    console.log('✅ Database connection successful');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️ Continuing anyway...');
  });
" || echo "⚠️ Database test failed, continuing..."

echo "🎯 Starting NestJS application on port $PORT..."
echo "📡 Health endpoint will be at: http://localhost:$PORT/health"

# Try production-safe version first, fallback to regular
if [ -f "dist/main-production.js" ]; then
    echo "🔒 Using production-safe startup..."
    exec node dist/main-production.js
else
    echo "🔄 Using regular startup..."
    exec npm run start:prod
fi