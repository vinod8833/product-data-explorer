echo " Setting up Product Data Explorer..."

if ! command -v docker &> /dev/null; then
    echo " Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo " Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo " Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo " Creating environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo " Created backend/.env from example"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo " Created frontend/.env.local from example"
fi

echo " Installing dependencies..."

echo "Installing backend dependencies..."
cd backend && npm install
if [ $? -ne 0 ]; then
    echo " Failed to install backend dependencies"
    exit 1
fi
cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo " Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo "🐳 Starting services with Docker..."
docker-compose up -d postgres redis

echo "⏳ Waiting for services to be ready..."
sleep 10

echo " Building backend..."
cd backend && npm run build
if [ $? -ne 0 ]; then
    echo " Failed to build backend"
    exit 1
fi
cd ..

echo " Seeding database..."
cd backend && npm run seed
if [ $? -ne 0 ]; then
    echo "  Database seeding failed, but continuing..."
fi
cd ..

echo " Setup completed successfully!"
echo ""
echo " Product Data Explorer is ready!"
echo ""
echo "To start the application:"
echo "  Backend:  cd backend && npm run start:dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api"
echo ""
echo "To trigger initial scraping:"
echo "  curl -X POST http://localhost:3001/api/scraping/navigation -H 'Content-Type: application/json' -d '{\"baseUrl\":\"https://www.worldofbooks.com\"}'"