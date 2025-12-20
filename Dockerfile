# ProgramPrimitives - Multi-stage Dockerfile
# Stage 1: Build SvelteKit frontend
# Stage 2: Build Go backend
# Stage 3: Production runtime with LiteFS

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY _frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY _frontend/ ./

# Build static files
RUN npm run build

# ============================================
# Stage 2: Build Go Backend
# ============================================
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Copy go mod files
COPY _backend/go.mod _backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy backend source
COPY _backend/ ./

# Build the binary (CGO enabled for SQLite)
RUN CGO_ENABLED=1 GOOS=linux go build -o /app/server ./cmd/api

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    fuse3 \
    sqlite

# Install LiteFS
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Create app directory
WORKDIR /app

# Copy Go binary
COPY --from=backend-builder /app/server /app/server

# Copy frontend static files
COPY --from=frontend-builder /app/frontend/build /app/static

# Copy migrations
COPY _backend/migrations /app/migrations

# Copy LiteFS config
COPY litefs.yml /etc/litefs.yml

# Create data directory
RUN mkdir -p /data

# Expose port
EXPOSE 8080

# Run with LiteFS (handles SQLite replication)
CMD ["litefs", "mount"]

