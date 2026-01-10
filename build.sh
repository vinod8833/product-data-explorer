#!/bin/bash
set -e

echo "🔧 Installing Node.js and npm..."
# This will be handled by Nixpacks

echo "📁 Changing to backend directory..."
cd backend

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "✅ Build complete!"