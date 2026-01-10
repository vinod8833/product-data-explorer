#!/bin/bash
set -e

echo "🚀 Starting backend (simplified)..."

echo "🔍 Checking Node.js installation..."
echo "PATH: $PATH"
echo "Which node: $(which node 2>/dev/null || echo 'not found')"
echo "Node version: $(node --version 2>/dev/null || echo 'not available')"
echo "Which npm: $(which npm 2>/dev/null || echo 'not found')"

# Try to find node in common locations
for path in /nix/var/nix/profiles/default/bin/node /usr/bin/node /usr/local/bin/node; do
    if [ -f "$path" ]; then
        echo "Found node at: $path"
        export NODE_PATH="$path"
        break
    fi
done

cd backend

echo "📋 Environment:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOST: $HOST"

# Try different ways to start node
if command -v node >/dev/null 2>&1; then
    echo "🎯 Starting with 'node' command..."
    exec node src/simple-server.js
elif [ -n "$NODE_PATH" ]; then
    echo "🎯 Starting with explicit path: $NODE_PATH"
    exec "$NODE_PATH" src/simple-server.js
else
    echo "❌ Node.js not found anywhere!"
    echo "Available commands:"
    ls -la /usr/bin/ | grep -i node || echo "No node in /usr/bin/"
    ls -la /nix/var/nix/profiles/default/bin/ | grep -i node || echo "No node in nix profiles"
    exit 1
fi