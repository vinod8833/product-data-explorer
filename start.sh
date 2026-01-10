#!/bin/bash
set -e

echo "🚀 Starting backend (simplified)..."
cd backend

echo "📋 Environment:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOST: $HOST"

# Just try to start the simple server for now
echo "🎯 Starting simple test server..."
exec node src/simple-server.js