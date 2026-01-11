# BookData Hub

BookData Hub is a full-stack book data exploration platform built with **Next.js**, **NestJS**, and **TypeScript**. It supports background scraping, caching, and a fully documented API, with a strong focus on production parity and developer experience.


## Quick Start

Run the entire project locally with a single command:

```bash
git clone git@github.com:vinod8833/product-data-explorer.git
cd bookdata-hub
make setup && make dev
```

This command installs dependencies, starts PostgreSQL and Redis, runs migrations and seeds, builds the backend, and launches both frontend and backend services.

---

## Local URLs

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:3001/api](http://localhost:3001/api)
* Swagger API Docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
* Health Check: [http://localhost:3001/health](http://localhost:3001/health)

---

## Requirements

* Node.js 18+
* Docker & Docker Compose
* Git
* Make

---

## Make Commands

### Setup and Run

```bash
make setup        # Install dependencies, create env files, start DB/Redis
make dev          # Start frontend and backend in development mode
make start        # Alias for: make setup && make dev
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
make test         
make test-backend   # Run backend tests
make test-frontend  # Run frontend tests
make lint           # Lint all code
make format         # Format all code
```

### Individual Services

```bash
make dev-backend  
make dev-frontend 
```

### Help

```bash
make help         
```

---

## Key Features

* Background scraping with queue-based workers
* PostgreSQL and Redis caching
* Fully typed API with Swagger documentation
* Responsive, accessible frontend
* One-command local setup via Makefile
* Production-ready architecture

---

## API Documentation

Swagger UI is available locally at:

[http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## Deployment

* Frontend: Vercel
* Backend: Railway or Docker-based platforms

---

### Backend (Railway/Heroku)
The backend can be deployed to various platforms with the included configuration files.

## License

MIT License - see [LICENSE](LICENSE) file for details.