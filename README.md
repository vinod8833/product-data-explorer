# BookData Hub

A modern full-stack web application for exploring book data from World of Books with real-time scraping capabilities. Built with Next.js, NestJS, and TypeScript.

##  Quick Start

**Get up and running in one command:**

```bash
# Clone the repository
git clone git@github.com:vinod8833/product-data-explorer.git
cd bookdata-hub

# Complete setup and start development (single command)
make setup && make dev
```

**Alternative one-liner:**
```bash
make start  
```

**Access the application:**
-  Frontend: http://localhost:3000
-  Backend API: http://localhost:3001/api
-  API Documentation: http://localhost:3001/api/docs

## Key Features

- **Live Book Scraping**: Real-time data from World of Books
- **Advanced Search**: Filter by price, author, rating, availability
- **Responsive Design**: Mobile-first with accessibility support
- **Interactive API**: Complete Swagger documentation
- **Background Processing**: Queue-based scraping with caching
- **TypeScript**: Full type safety across the stack

## Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git
- Make (pre-installed on macOS/Linux, install via Chocolatey on Windows)

## What `make setup && make dev` Does

1. **Dependency Check**: Verifies Docker, Node.js, and npm are installed
2. **Environment Setup**: Creates `.env` files from examples if they don't exist
3. **Install Dependencies**: Runs `npm install` for both backend  frontend
4. **Start Services**: Launches PostgreSQL and Redis via Docker Compose
5. **Wait for Services**: Ensures databases are ready before proceeding
6. **Seed Database**: Populates initial data and schema
7. **Start Development**: Launches both backend and frontend servers

## Development 

```bash
# Complete setup and development
make setup && make dev    
make start               

# Individual 
make setup              
make dev               
make stop              
make status            
make health            

# Utilities
make clean             
make logs              
make help              
```

## Environment Variables

The setup process automatically creates environment files from examples. You can customize them if needed:

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/product_explorer
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=product_explorer

REDIS_URL=redis://localhost:6379

NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=BookData Hub
```

## Troubleshooting

### Common Issues

**Docker services not starting:**
```bash
make stop && make clean  
make setup              
```

**Port conflicts:**
- Frontend (3000), Backend (3001), PostgreSQL (5432), Redis (6379)
- Stop conflicting services or change ports in docker-compose.yml

**Database connection issues:**
```bash
make health            
make logs-db          
```

**Permission issues:**
```bash
sudo chown -R $USER:$USER .  
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

MIT License - see [LICENSE](LICENSE) file for details.

##  Deployment

### Vercel Deployment (Frontend)

The frontend is configured for automatic deployment to Vercel:

**Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app) *(Update with your actual URL)*

**Quick Deploy:**
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Import the project with these settings:
   - **Root Directory:** `frontend`
   - **Framework:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

**Environment Variables for Vercel:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
NEXT_PUBLIC_APP_NAME=Product Data Explorer
NEXT_TELEMETRY_DISABLED=1
```

**CI/CD:** Every push to `main` automatically deploys to production. Pull requests get preview deployments.

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Backend Deployment

The backend can be deployed to various platforms:
- **Railway:** Connect GitHub repository, set root directory to `backend`
- **Heroku:** Use the included `Dockerfile` in the backend directory
- **DigitalOcean App Platform:** Configure with `backend` as the source directory
- **AWS/GCP:** Use Docker deployment with the provided `docker-compose.prod.yml`
