# ProgramPrimitives - Development & Deployment Makefile
# Fly.io deployment with Go backend + SvelteKit frontend

.PHONY: help dev dev-backend dev-frontend build build-frontend build-backend deploy db-migrate db-seed clean

# Default target
help:
	@echo "ProgramPrimitives Development Commands"
	@echo "======================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Run both frontend and backend (requires 2 terminals)"
	@echo "  make dev-backend   - Run Go backend only (port 8080)"
	@echo "  make dev-frontend  - Run SvelteKit frontend only (port 5173)"
	@echo ""
	@echo "Building:"
	@echo "  make build         - Build both frontend and backend"
	@echo "  make build-frontend - Build SvelteKit static files"
	@echo "  make build-backend  - Build Go binary"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-seed       - Seed initial data"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy        - Deploy to Fly.io"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean         - Remove build artifacts"

# ============================================
# Development
# ============================================

dev-backend:
	@echo "🚀 Starting Go backend on http://localhost:8080"
	@mkdir -p _backend/data
	cd _backend && \
		ENVIRONMENT=development \
		DATABASE_PATH=./data/programprimitives.db \
		CORS_ORIGIN="http://localhost:5173" \
		STATIC_DIR=../_frontend/build \
		go run ./cmd/api

dev-frontend:
	@echo "🚀 Starting SvelteKit frontend on http://localhost:5173"
	cd _frontend && npm run dev

# For Windows, run these in separate terminals
dev:
	@echo "Run these in separate terminals:"
	@echo "  Terminal 1: make dev-backend"
	@echo "  Terminal 2: make dev-frontend"

# ============================================
# Building
# ============================================

build: build-frontend build-backend
	@echo "✅ Build complete!"

build-frontend:
	@echo "📦 Building SvelteKit frontend..."
	cd _frontend && npm run build
	@echo "✅ Frontend build complete: _frontend/build/"

build-backend:
	@echo "📦 Building Go backend..."
	cd _backend && CGO_ENABLED=1 go build -o ../bin/server ./cmd/api
	@echo "✅ Backend build complete: bin/server"

# ============================================
# Database
# ============================================

db-migrate:
	@echo "📦 Running database migrations..."
	@mkdir -p _backend/data
	cd _backend && \
		DATABASE_PATH=./data/programprimitives.db \
		go run ./cmd/api -migrate

db-seed:
	@echo "🌱 Seeding database..."
	@sqlite3 _backend/data/programprimitives.db < _backend/migrations/002_seed_primitives.sql
	@echo "✅ Database seeded!"

# ============================================
# Deployment
# ============================================

deploy:
	@echo "🚀 Deploying to Fly.io..."
	fly deploy
	@echo "✅ Deployment complete!"

deploy-staging:
	@echo "🚀 Deploying to Fly.io (staging)..."
	fly deploy --config fly.staging.toml
	@echo "✅ Staging deployment complete!"

# ============================================
# Cleanup
# ============================================

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf _frontend/build
	rm -rf _frontend/.svelte-kit
	rm -rf bin/
	rm -rf _backend/data/*.db
	@echo "✅ Clean complete!"

# ============================================
# Fly.io Setup
# ============================================

fly-setup:
	@echo "Setting up Fly.io app..."
	fly apps create programprimitives
	fly volumes create data --region ord --size 1
	@echo "✅ Fly.io setup complete!"

fly-secrets:
	@echo "Set your secrets:"
	@echo "  fly secrets set JWT_SECRET=your-secret-here"
	@echo "  fly secrets set ENVIRONMENT=production"

fly-logs:
	fly logs

fly-ssh:
	fly ssh console

