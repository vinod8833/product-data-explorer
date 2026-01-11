.PHONY: help dev stop clean install setup seed test logs status health check-deps setup-env start

.DEFAULT_GOAL := help

GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m 

help: ## Show this help message
	@echo "$(GREEN)Product Data Explorer - Development Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(NC)"
	@echo "  make setup && make dev    # Complete setup and start development"
	@echo "  make start                # One-command setup and start (alias for setup && dev)"      
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-deps: ## Check if all required dependencies are installed
	@echo "$(YELLOW)Checking dependencies...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Error: docker is required but not installed$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "$(RED)Error: docker-compose is required but not installed$(NC)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Error: node is required but not installed$(NC)"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)Error: npm is required but not installed$(NC)"; exit 1; }
	@echo "$(GREEN)All dependencies are installed$(NC)"

setup-env: ## Create environment files from examples
	@echo "$(YELLOW)Setting up environment files...$(NC)"
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "$(GREEN)Created backend/.env from example$(NC)"; \
	else \
		echo "$(GREEN)Backend .env already exists$(NC)"; \
	fi
	@if [ ! -f frontend/.env.local ]; then \
		cp frontend/.env.example frontend/.env.local; \
		echo "$(GREEN)Created frontend/.env.local from example$(NC)"; \
	else \
		echo "$(GREEN)Frontend .env.local already exists$(NC)"; \
	fi

install: check-deps ## Install all dependencies
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	@cd backend && npm install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)Dependencies installed$(NC)"

services: ## Start Docker services (PostgreSQL and Redis)
	@echo "$(YELLOW)Starting Docker services...$(NC)"
	@docker-compose up -d postgres redis
	@echo "$(GREEN)Docker services started$(NC)"

wait-services: ## Wait for Docker services to be ready
	@echo "$(YELLOW)Waiting for services to be ready...$(NC)"
	@echo "Waiting for PostgreSQL..."
	@for i in $$(seq 1 60); do \
		if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then \
			echo "$(GREEN)PostgreSQL is ready$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 60 ]; then \
			echo "$(RED)PostgreSQL failed to start after 60 seconds$(NC)"; \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@echo "Waiting for Redis..."
	@for i in $$(seq 1 30); do \
		if docker-compose exec -T redis redis-cli ping 2>/dev/null | grep -q PONG; then \
			echo "$(GREEN)Redis is ready$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "$(RED)Redis failed to start after 30 seconds$(NC)"; \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@echo "$(GREEN)All services are ready$(NC)"

build-backend: ## Build the backend application
	@echo "$(YELLOW)Building backend...$(NC)"
	@cd backend && npm run build
	@echo "$(GREEN)Backend built successfully$(NC)"

migrate: ## Run database migrations
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@cd backend && npm run migration:run || echo "$(YELLOW)No migrations to run or migration failed$(NC)"
	@echo "$(GREEN)Migrations completed$(NC)"

seed: ## Seed the database with initial data
	@echo "$(YELLOW)Seeding database...$(NC)"
	@cd backend && npm run seed
	@echo "$(GREEN)Database seeded$(NC)"

setup: check-deps setup-env install services wait-services build-backend migrate seed ## Complete project setup
	@echo ""
	@echo "$(GREEN)Setup complete!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  Run 'make dev' to start development environment"
	@echo "  Or run 'make start' to setup and start in one command"
	@echo ""
	@echo "$(YELLOW)Service URLs:$(NC)"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:3001/api"
	@echo "  API Docs:     http://localhost:3001/api/docs"
	@echo "  Health Check: http://localhost:3001/health"

dev: ## Start development environment (backend and frontend)
	@echo "$(GREEN)Starting Product Data Explorer development environment...$(NC)"
	@echo "$(YELLOW)Ensuring services are running...$(NC)"
	@docker-compose up -d postgres redis
	@$(MAKE) wait-services
	@echo ""
	@echo "$(YELLOW)Services will be available at:$(NC)"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:3001/api"
	@echo "  API Docs:     http://localhost:3001/api/docs"
	@echo "  Health Check: http://localhost:3001/health"
	@echo ""
	@echo "$(YELLOW)Starting backend and frontend...$(NC)"
	@echo "$(RED)Press Ctrl+C to stop all services$(NC)"
	@echo ""
	@trap 'make stop-dev' INT; \
	(cd backend && npm run start:dev) & \
	BACKEND_PID=$$!; \
	sleep 8; \
	(cd frontend && npm run dev) & \
	FRONTEND_PID=$$!; \
	wait $$BACKEND_PID $$FRONTEND_PID

dev-backend: services wait-services ## Start backend only
	@echo "$(YELLOW)Starting backend only...$(NC)"
	@cd backend && npm run start:dev

dev-frontend: ## Start frontend only
	@echo "$(YELLOW)Starting frontend only...$(NC)"
	@cd frontend && npm run dev

stop-dev: ## Stop development processes (not Docker services)
	@echo "$(YELLOW)Stopping development processes...$(NC)"
	@pkill -f "npm run start:dev" || true
	@pkill -f "npm run dev" || true
	@pkill -f "nest start" || true
	@pkill -f "next dev" || true
	@echo "$(GREEN)Development processes stopped$(NC)"

stop: ## Stop all services and processes
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@docker-compose down
	@$(MAKE) stop-dev
	@echo "$(GREEN)All services stopped$(NC)"

clean: stop ## Clean up everything (containers, volumes, node_modules)
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@rm -rf backend/node_modules frontend/node_modules
	@rm -rf backend/dist frontend/.next
	@echo "$(GREEN)Cleanup complete$(NC)"

logs: ## Show logs from all Docker services
	@docker-compose logs -f

logs-db: ## Show PostgreSQL logs
	@docker-compose logs -f postgres

logs-redis: ## Show Redis logs
	@docker-compose logs -f redis

status: ## Show status of all services
	@echo "$(YELLOW)Service Status:$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Services:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(YELLOW)Node Processes:$(NC)"
	@pgrep -f "npm run start:dev" >/dev/null && echo "$(GREEN)Backend running$(NC)" || echo "$(RED)Backend not running$(NC)"
	@pgrep -f "npm run dev" >/dev/null && echo "$(GREEN)Frontend running$(NC)" || echo "$(RED)Frontend not running$(NC)"

health: ## Check health of all services
	@echo "$(YELLOW)Health Check:$(NC)"
	@echo ""
	@echo "$(YELLOW)PostgreSQL:$(NC)"
	@docker-compose exec -T postgres pg_isready -U postgres && echo "$(GREEN)PostgreSQL healthy$(NC)" || echo "$(RED)PostgreSQL unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@docker-compose exec -T redis redis-cli ping | grep -q PONG && echo "$(GREEN)Redis healthy$(NC)" || echo "$(RED)Redis unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend API:$(NC)"
	@curl -s http://localhost:3001/health >/dev/null && echo "$(GREEN)Backend API healthy$(NC)" || echo "$(RED)Backend API unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s http://localhost:3000 >/dev/null && echo "$(GREEN)Frontend healthy$(NC)" || echo "$(RED)Frontend unhealthy$(NC)"

test: ## Run all tests
	@echo "$(YELLOW)Running tests...$(NC)"
	@cd backend && npm test
	@cd frontend && npm test

test-backend: ## Run backend tests only
	@echo "$(YELLOW)Running backend tests...$(NC)"
	@cd backend && npm test

test-frontend: ## Run frontend tests only
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	@cd frontend && npm test

db-reset: ## Reset database (drop, create, seed)
	@echo "$(YELLOW)Resetting database...$(NC)"
	@docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS product_explorer;"
	@docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE product_explorer;"
	@$(MAKE) migrate
	@$(MAKE) seed
	@echo "$(GREEN)Database reset complete$(NC)"

db-shell: ## Open PostgreSQL shell
	@docker-compose exec postgres psql -U postgres -d product_explorer

redis-shell: ## Open Redis CLI
	@docker-compose exec redis redis-cli

format: ## Format code (backend and frontend)
	@echo "$(YELLOW)Formatting code...$(NC)"
	@cd backend && npm run format || true
	@cd frontend && npm run format || true
	@echo "$(GREEN)Code formatted$(NC)"

lint: ## Lint code (backend and frontend)
	@echo "$(YELLOW)Linting code...$(NC)"
	@cd backend && npm run lint || true
	@cd frontend && npm run lint || true
	@echo "$(GREEN)Code linted$(NC)"

build: ## Build for production
	@echo "$(YELLOW)Building for production...$(NC)"
	@cd backend && npm run build
	@cd frontend && npm run build
	@echo "$(GREEN)Production build complete$(NC)"

urls: ## Show all service URLs
	@echo "$(GREEN)Service URLs:$(NC)"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:3001/api"
	@echo "  API Docs:     http://localhost:3001/api/docs"
	@echo "  Health Check: http://localhost:3001/health"
	@echo ""
	@echo "$(GREEN)Database Connections:$(NC)"
	@echo "  PostgreSQL:   localhost:5432 (user: postgres, db: product_explorer)"
	@echo "  Redis:        localhost:6379"

start: ## One-command setup and start (complete setup + dev)
	@echo "$(GREEN)Starting Product Data Explorer from scratch...$(NC)"
	@$(MAKE) setup
	@echo ""
	@echo "$(GREEN)Setup complete! Starting development environment...$(NC)"
	@$(MAKE) dev