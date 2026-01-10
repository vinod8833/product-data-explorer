#!/bin/bash

# Backend deployment script for Railway
set -e

echo "🚀 Starting backend deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run migration:run || echo "⚠️ Migration failed or no migrations to run"

# Start the application
echo "✅ Starting application..."
exec npm run start:prod