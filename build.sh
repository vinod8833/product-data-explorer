#!/bin/bash
set -e

echo "🔧 Installing Node.js and npm..."
# This will be handled by Nixpacks

echo "📁 Changing to backend directory..."
cd backend

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application (production-safe)..."
npm run build
# Also build the production-safe main file
npx tsc src/main-production.ts --outDir dist --target es2020 --module commonjs --esModuleInterop --allowSyntheticDefaultImports --experimentalDecorators --emitDecoratorMetadata --skipLibCheck || echo "⚠️ Production build fallback failed"

echo "✅ Build complete!"