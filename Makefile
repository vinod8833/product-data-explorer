.PHONY: help dev stop clean install setup seed test logs status health check-deps setup-env start

.DEFAULT_GOAL := help

GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m 

help: 
	@echo "$(GREEN)Product Data Explorer - Development Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(NC)"
	@echo "  make setup && make dev    # Complete setup and start development"
	@echo "  make start                # One-command setup and start (alias for setup && dev)"      
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-12s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

check-deps: 
	@echo "$(YELLOW)Checking dependencies...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Error: docker is required but not installed$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "$(RED)Error: docker-compose is required but not installed$(NC)"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Error: node is required but not installed$(NC)"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)Error: npm is required but not installed$(NC)"; exit 1; }
	@echo "$(GREEN)✓ All dependencies are installed$(NC)"

install: check-deps 
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	@cd backend && npm install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

services: 
	@echo "$(YELLOW)Starting Docker services...$(NC)"
	@docker-compose up -d postgres redis
	@echo "$(GREEN)✓ Docker services started$(NC)"

wait-services: 
	@echo "$(YELLOW)Waiting for services to be ready...$(NC)"
	@echo "Waiting for PostgreSQL..."
	@for i in $$(seq 1 60); do \
		if docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then \
			echo "$(GREEN)✓ PostgreSQL is ready$(NC)"; \
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
			echo "$(GREEN)✓ Redis is ready$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "$(RED)Redis failed to start after 30 seconds$(NC)"; \
			exit 1; \
		fi; \
		sleep 1; \
	done
	@echo "$(GREEN)✓ All services are ready$(NC)"

seed: 
	@echo "$(YELLOW)Seeding database...$(NC)"
	@cd backend && npm run seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

setup-env: 
	@echo "$(YELLOW)Setting up environment files...$(NC)"
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "$(GREEN)✓ Created backend/.env from example$(NC)"; \
	else \
		echo "$(GREEN)✓ Backend .env already exists$(NC)"; \
	fi
	@if [ ! -f frontend/.env.local ]; then \
		cp frontend/.env.example frontend/.env.local; \
		echo "$(GREEN)✓ Created frontend/.env.local from example$(NC)"; \
	else \
		echo "$(GREEN)✓ Frontend .env.local already exists$(NC)"; \
	fi

setup: check-deps setup-env install services wait-services seed ## Complete project setup (dependencies, services, database)
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start development$(NC)"

dev: 
	@echo "$(GREEN)Starting Product Data Explorer development environment...$(NC)"
	@echo "$(YELLOW)Ensuring services are running...$(NC)"
	@docker-compose up -d postgres redis
	@$(MAKE) wait-services
	@echo "$(YELLOW)Services will be available at:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"
	@echo "  API Docs: http://localhost:3001/api"
	@echo ""
	@echo "$(YELLOW)Starting backend and frontend...$(NC)"
	@echo "Press Ctrl+C to stop all services"
	@trap 'make stop' INT; \
	(cd backend && npm run start:dev) & \
	BACKEND_PID=$$!; \
	sleep 5; \
	(cd frontend && npm run dev) & \
	FRONTEND_PID=$$!; \
	wait $$BACKEND_PID $$FRONTEND_PID 
	@echo "$(GREEN)Starting Product Data Explorer development environment...$(NC)"
	@echo "$(YELLOW)Services will be available at:$(NC)"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"
	@echo "  API Docs: http://localhost:3001/api"
	@echo ""
	@echo "$(YELLOW)Starting backend and frontend...$(NC)"
	@echo "Press Ctrl+C to stop all services"
	@trap 'make stop' INT; \
	(cd backend && npm run start:dev) & \
	BACKEND_PID=$$!; \
	sleep 5; \
	(cd frontend && npm run dev) & \
	FRONTEND_PID=$$!; \
	wait $$BACKEND_PID $$FRONTEND_PID

dev-backend: services wait-services 
	@echo "$(YELLOW)Starting backend only...$(NC)"
	@cd backend && npm run start:dev

dev-frontend: 
	@echo "$(YELLOW)Starting frontend only...$(NC)"
	@cd frontend && npm run dev

stop: 
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@docker-compose down
	@pkill -f "npm run start:dev" || true
	@pkill -f "npm run dev" || true
	@pkill -f "nest start" || true
	@pkill -f "next dev" || true
	@echo "$(GREEN)✓ All services stopped$(NC)"

clean: stop 
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@docker-compose down -v --remove-orphans
	@docker system prune -f
	@rm -rf backend/node_modules frontend/node_modules
	@rm -rf backend/dist frontend/.next
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

logs: 
	@docker-compose logs -f

logs-db: 
	@docker-compose logs -f postgres

logs-redis: 
	@docker-compose logs -f redis

status: 
	@echo "$(YELLOW)Service Status:$(NC)"
	@echo ""
	@echo "$(YELLOW)Docker Services:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(YELLOW)Node Processes:$(NC)"
	@pgrep -f "npm run start:dev" >/dev/null && echo "$(GREEN)✓ Backend running$(NC)" || echo "$(RED)✗ Backend not running$(NC)"
	@pgrep -f "npm run dev" >/dev/null && echo "$(GREEN)✓ Frontend running$(NC)" || echo "$(RED)✗ Frontend not running$(NC)"

health: 
	@echo "$(YELLOW)Health Check:$(NC)"
	@echo ""
	@echo "$(YELLOW)PostgreSQL:$(NC)"
	@docker-compose exec -T postgres pg_isready -U postgres && echo "$(GREEN)✓ PostgreSQL healthy$(NC)" || echo "$(RED)✗ PostgreSQL unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Redis:$(NC)"
	@docker-compose exec -T redis redis-cli ping | grep -q PONG && echo "$(GREEN)✓ Redis healthy$(NC)" || echo "$(RED)✗ Redis unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend API:$(NC)"
	@curl -s http://localhost:3001/api/health >/dev/null && echo "$(GREEN)✓ Backend API healthy$(NC)" || echo "$(RED)✗ Backend API unhealthy$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s http://localhost:3000 >/dev/null && echo "$(GREEN)✓ Frontend healthy$(NC)" || echo "$(RED)✗ Frontend unhealthy$(NC)"

test: 
	@echo "$(YELLOW)Running tests...$(NC)"
	@cd backend && npm test
	@cd frontend && npm test

test-backend: 
	@echo "$(YELLOW)Running backend tests...$(NC)"
	@cd backend && npm test

test-frontend: 
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	@cd frontend && npm test

db-reset: 
	@echo "$(YELLOW)Resetting database...$(NC)"
	@docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS product_explorer;"
	@docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE product_explorer;"
	@cd backend && npm run seed
	@echo "$(GREEN)✓ Database reset complete$(NC)"

db-shell: 
	@docker-compose exec postgres psql -U postgres -d product_explorer

redis-shell: 
	@docker-compose exec redis redis-cli

format: 
	@echo "$(YELLOW)Formatting code...$(NC)"
	@cd backend && npm run format || true
	@cd frontend && npm run format || true
	@echo "$(GREEN)✓ Code formatted$(NC)"

lint: 
	@echo "$(YELLOW)Linting code...$(NC)"
	@cd backend && npm run lint || true
	@cd frontend && npm run lint || true
	@echo "$(GREEN)✓ Code linted$(NC)"

build:
	@echo "$(YELLOW)Building for production...$(NC)"
	@cd backend && npm run build
	@cd frontend && npm run build
	@echo "$(GREEN)✓ Production build complete$(NC)"

quick: services 
	@echo "$(GREEN)Quick starting development environment...$(NC)"
	@sleep 3
	@trap 'make stop' INT; \
	(cd backend && npm run start:dev) & \
	BACKEND_PID=$$!; \
	sleep 5; \
	(cd frontend && npm run dev) & \
	FRONTEND_PID=$$!; \
	wait $$BACKEND_PID $$FRONTEND_PID

urls: 
	@echo "$(GREEN)Service URLs:$(NC)"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Backend API:  http://localhost:3001/api"
	@echo "  API Docs:     http://localhost:3001/api"
	@echo "  Health Check: http://localhost:3001/api/health"
	@echo ""
	@echo "$(GREEN)Database Connections:$(NC)"
	@echo "  PostgreSQL:   localhost:5432 (user: postgres, db: product_explorer)"
	@echo "  Redis:        localhost:6379"
start: 
	@echo "$(GREEN) Starting Product Data Explorer from scratch...$(NC)"
	@$(MAKE) setup
	@echo ""
	@echo "$(GREEN) Setup complete! Starting development environment...$(NC)"
	@$(MAKE) dev