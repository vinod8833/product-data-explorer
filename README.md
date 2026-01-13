# BookData Hub

A full-stack book data exploration platform built with **Next.js**, **NestJS**, and **TypeScript**. Features background scraping, caching, and a fully documented API with production-ready architecture.

## One-Command Setup

Get the entire project running locally in minutes:

```bash
git clone https://github.com/vinod8833/product-data-explorer.git
cd product-data-explorer
make start
```

## Requirements

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **Git**
- **Make**

## Local URLs

Once running, access these services:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **API Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

## Project Output / Screenshots

### Homepage - Book Discovery
![Homepage](./images/Screenshot%20from%202026-01-14%2001-13-03.png)
*Clean, responsive homepage showcasing featured books with search and navigation*

### Product Catalog
![Product Catalog](./images/Screenshot%20from%202026-01-14%2001-13-17.png)
*Browse books with filtering, sorting, and pagination capabilities*

### Book Details Page
![Book Details](./images/Screenshot%20from%202026-01-14%2001-13-38.png)
*Detailed book information with ratings, descriptions, and purchase options*

### Search Results
![Search Results](./images/Screenshot%20from%202026-01-14%2001-14-01.png)
*Real-time search functionality with relevant book suggestions*

### Category Navigation
![Categories](./images/Screenshot%20from%202026-01-14%2001-14-32.png)
*Organized book categories for easy browsing and discovery*

### API Documentation
![API Docs](./images/Screenshot%20from%202026-01-14%2001-14-45.png)
*Interactive Swagger documentation for all API endpoints*

### Mobile Responsive Design
![Mobile View](./images/Screenshot%20from%202026-01-14%2001-14-54.png)
*Fully responsive design optimized for mobile devices*

### Admin Dashboard
![Admin Dashboard](./images/Screenshot%20from%202026-01-14%2001-15-07.png)
*Backend management interface for content and data administration*

## ⚡ Key Features

- **Background Scraping**: Queue-based workers for data collection
- **Database & Caching**: PostgreSQL with Redis for optimal performance
- **Type-Safe API**: Fully typed NestJS backend with Swagger documentation
- **Responsive Frontend**: Modern Next.js interface with accessibility features
- **One-Command Setup**: Complete local development environment via Makefile
- **Production Ready**: Containerized architecture with deployment configs

## Development Commands

### Essential Commands
```bash
make start        # Complete setup and start (recommended)
make dev          # Start development after initial setup
make stop         # Stop all services
make clean        # Clean up containers and dependencies
```

### Useful Commands
```bash
make status       # Check service status
make health       # Run health checks
make urls         # Show all service URLs
make logs         # View all service logs
make db-reset     # Reset database with fresh data
```

<details>
<summary>View all available commands</summary>

### Setup and Run
```bash
make setup        # Install dependencies, create env files, start DB/Redis
make dev          # Start frontend and backend in development mode
make start        # Complete setup and start (recommended)
```

### Stop and Clean
```bash
make stop         # Stop all running services
make clean        # Remove containers, volumes, and node_modules
```

### Status and Health
```bash
make status       # Show status of all services
make health       # Run health checks
make urls         # Print all local service URLs
```

### Docker Services
```bash
make services     # Start PostgreSQL and Redis only
make logs         # Show all Docker logs
make logs-db      # PostgreSQL logs
make logs-redis   # Redis logs
```

### Database
```bash
make migrate      # Run database migrations
make seed         # Seed initial data
make db-reset     # Drop, recreate, migrate, and seed database
make db-shell     # Open PostgreSQL shell
```

### Tests and Code Quality
```bash
make test         # Run all tests
make test-backend # Run backend tests
make test-frontend # Run frontend tests
make lint         # Lint all code
make format       # Format all code
```

### Individual Services
```bash
make dev-backend  # Start backend only
make dev-frontend # Start frontend only
```

### Help
```bash
make help         # Show all available commands
```

</details>

## API Documentation

Interactive Swagger documentation is available at: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## Deployment

- **Frontend**: Vercel (automatic deployments)
- **Backend**: Railway or Docker-compatible platforms
- **Database**: PostgreSQL with Redis caching

##  License

MIT License - see [LICENSE](LICENSE) file for details.