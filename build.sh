#!/bin/bash
set -e

echo "🔨 Building backend (simplified)..."
cd backend
npm ci
echo "✅ Dependencies installed"