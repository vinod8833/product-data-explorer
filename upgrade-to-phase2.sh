echo " Upgrading Railway deployment to Phase 2 (Enhanced API)"
echo "=================================================="

echo " Creating backup of current configuration..."
cp package.json package.json.backup
cp railway.toml railway.toml.backup

echo "Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "product-explorer-railway",
  "version": "2.0.0",
  "main": "enhanced-server.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node enhanced-server.js"
  }
}
EOF

echo "Updating railway.toml..."
cat > railway.toml << 'EOF'
[deploy]
startCommand = "node enhanced-server.js"

[environments.production]
variables = { 
  NODE_ENV = "production",
  DATABASE_URL = "postgresql://postgres:PKzoOzvUtjJgxIzKpOoXALIIAfLuHWls@centerbeam.proxy.rlwy.net:13082/railway"
}
EOF

echo "Updating nixpacks.toml..."
cat > nixpacks.toml << 'EOF'
[start]
cmd = 'node enhanced-server.js'
EOF

echo "Configuration updated for Phase 2"
echo ""
echo " Changes made:"
echo "  - package.json: Updated to use enhanced-server.js"
echo "  - railway.toml: Added DATABASE_URL and updated start command"
echo "  - nixpacks.toml: Updated start command"
echo ""
echo " Next steps:"
echo "  1. Test locally: PORT=8080 node enhanced-server.js"
echo "  2. Commit and push changes to trigger Railway deployment"
echo "  3. Verify deployment: node verify-enhanced.js"
echo ""
echo " Rollback if needed:"
echo "  cp package.json.backup package.json"
echo "  cp railway.toml.backup railway.toml"
echo ""
echo "Expected result: 6/6 API endpoints working with enhanced features"