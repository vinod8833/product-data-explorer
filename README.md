# BookData Hub

A modern full-stack web application for exploring book data from World of Books with real-time scraping capabilities. Built with Next.js, NestJS, and TypeScript.

## Key Features

- **Live Book Scraping**: Real-time data from World of Books
- **Advanced Search**: Filter by price, author, rating, availability
- **Responsive Design**: Mobile-first with accessibility support
- **Interactive API**: Complete Swagger documentation
- **Background Processing**: Queue-based scraping with caching
- **TypeScript**: Full type safety across the stack

## Prerequisites

- Node.js 
- Docker & Docker Compose
- Git
- Make (pre-installed on macOS/Linux, install via Chocolatey on Windows)

## Quick Start

```bash
# Clone the repository
git clone git@github.com:vinod8833/product-data-explorer.git
cd bookdata-hub

# Setup and start everything
make setup && make dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Documentation: http://localhost:3001/api/docs

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/product_explorer
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=product_explorer

# Redis
REDIS_URL=redis://localhost:6379

# Application
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=BookData Hub
```

## Main Commands

```bash
make setup         
make dev           
make stop          
make status        

make install       
make services      
make seed          

make clean         
make help          
```

## API Documentation

Interactive API documentation is available at:
**http://localhost:3001/api/docs** (when running locally)

Features:
- Complete endpoint reference
- Interactive testing interface
- Request/response schemas
- Authentication details

## License

MIT License - see [LICENSE](LICENSE) file for details.# product-data-explorer
