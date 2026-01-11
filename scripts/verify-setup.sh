#!/bin/bash

# Verification script for BookData Hub setup
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 BookData Hub Setup Verification${NC}"
echo "=================================="

# Check if required files exist
echo -e "\n${YELLOW}📁 Checking project structure...${NC}"

required_files=(
    "Makefile"
    "docker-compose.yml"
    "backend/package.json"
    "frontend/package.json"
    "backend/.env.example"
    "frontend/.env.example"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file"
    else
        echo -e "❌ $file (missing)"
        exit 1
    fi
done

# Check if dependencies are installed
echo -e "\n${YELLOW}🔧 Checking dependencies...${NC}"

check_command() {
    if command -v $1 >/dev/null 2>&1; then
        echo -e "✅ $1 ($(command -v $1))"
    else
        echo -e "❌ $1 (not found)"
        return 1
    fi
}

check_command "docker" || exit 1
check_command "docker-compose" || exit 1
check_command "node" || exit 1
check_command "npm" || exit 1
check_command "make" || exit 1

# Check Node.js version
echo -e "\n${YELLOW}📋 Checking versions...${NC}"
node_version=$(node --version | sed 's/v//')
major_version=$(echo $node_version | cut -d. -f1)

if [ "$major_version" -ge 18 ]; then
    echo -e "✅ Node.js $node_version (>= 18 required)"
else
    echo -e "❌ Node.js $node_version (>= 18 required)"
    exit 1
fi

echo -e "✅ Docker $(docker --version | cut -d' ' -f3 | sed 's/,//')"
echo -e "✅ Docker Compose $(docker-compose --version | cut -d' ' -f3 | sed 's/,//')"

# Check if ports are available
echo -e "\n${YELLOW}🔌 Checking port availability...${NC}"

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "⚠️  Port $1 is in use"
        return 1
    else
        echo -e "✅ Port $1 is available"
        return 0
    fi
}

ports_ok=true
check_port 3000 || ports_ok=false  # Frontend
check_port 3001 || ports_ok=false  # Backend
check_port 5432 || ports_ok=false  # PostgreSQL
check_port 6379 || ports_ok=false  # Redis

if [ "$ports_ok" = false ]; then
    echo -e "\n${YELLOW}⚠️  Some ports are in use. You may need to stop other services.${NC}"
    echo -e "Run 'make stop' to stop any existing services."
fi

# Test Docker
echo -e "\n${YELLOW}🐳 Testing Docker...${NC}"
if docker run --rm hello-world >/dev/null 2>&1; then
    echo -e "✅ Docker is working correctly"
else
    echo -e "❌ Docker test failed"
    exit 1
fi

# Test Make commands
echo -e "\n${YELLOW}🛠️  Testing Make commands...${NC}"
if make help >/dev/null 2>&1; then
    echo -e "✅ Makefile is working correctly"
else
    echo -e "❌ Makefile test failed"
    exit 1
fi

echo -e "\n${GREEN}🎉 Setup verification complete!${NC}"
echo -e "\n${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Run: ${GREEN}make setup && make dev${NC}"
echo -e "  2. Or run: ${GREEN}make start${NC}"
echo -e "  3. Open: ${GREEN}http://localhost:3000${NC}"
echo -e "\n${YELLOW}💡 Tip: Run 'make help' to see all available commands${NC}"