#!/bin/bash

# Production startup script for Railway
set -e

echo "🚀 Starting Product Explorer Backend in Production Mode"
echo "=================================================="

# Environment validation
echo "📋 Validating environment..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$NODE_ENV" ]; then
    echo "⚠️  WARNING: NODE_ENV is not set, defaulting to production"
    export NODE_ENV=production
fi

echo "✅ Environment: $NODE_ENV"
echo "✅ Node Version: $(node --version)"
echo "✅ NPM Version: $(npm --version)"

# Database connectivity check
echo "🗄️  Checking database connectivity..."
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect()
  .then(() => {
    console.log('✅ Database connection successful');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" || exit 1

# Run migrations
echo "🔄 Running database migrations..."
npm run migration:run || {
    echo "⚠️  Migration failed or no migrations to run"
}

# Optional: Run seed data (uncomment if needed)
# echo "🌱 Seeding database..."
# npm run seed || echo "⚠️  Seeding failed or no seed data"

# Start the application
echo "🎯 Starting NestJS application..."
echo "📡 Health check will be available at: /health"
echo "📚 API docs will be available at: /api/docs"
echo "=================================================="

exec npm run start:prod