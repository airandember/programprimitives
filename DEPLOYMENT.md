# ProgramPrimitives - Fly.io Deployment Guide

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Fly.io                           │
│  ┌─────────────────────────────────────────────┐   │
│  │              Go Server (:8080)              │   │
│  │  ┌─────────────────┬────────────────────┐   │   │
│  │  │   API Routes    │   Static Files     │   │   │
│  │  │   /api/*        │   /* (SvelteKit)   │   │   │
│  │  └─────────────────┴────────────────────┘   │   │
│  │                     │                       │   │
│  │              ┌──────┴──────┐               │   │
│  │              │   LiteFS    │               │   │
│  │              │   SQLite    │               │   │
│  │              └─────────────┘               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

1. **Fly.io CLI**: Install from https://fly.io/docs/hands-on/install-flyctl/
2. **Fly.io Account**: Sign up at https://fly.io
3. **Go 1.21+**: For local development
4. **Node.js 20+**: For frontend build

## 🚀 First-Time Setup

### 1. Login to Fly.io

```bash
fly auth login
```

### 2. Create the App

```bash
fly apps create programprimitives
```

### 3. Create Storage Volume

```bash
fly volumes create data --region ord --size 1
```

### 4. Set Secrets

```bash
fly secrets set JWT_SECRET="your-secure-secret-here"
fly secrets set ENVIRONMENT="production"
```

### 5. Deploy

```bash
fly deploy
```

## 🛠️ Local Development

### Run Backend Only

```bash
cd _backend
mkdir -p data

ENVIRONMENT=development \
DATABASE_PATH=./data/programprimitives.db \
CORS_ORIGIN="http://localhost:5173" \
go run ./cmd/api
```

### Run Frontend Only

```bash
cd _frontend
npm run dev
```

### Run Both (Two Terminals)

**Terminal 1 (Backend):**
```bash
make dev-backend
```

**Terminal 2 (Frontend):**
```bash
make dev-frontend
```

## 📦 Building

### Build Everything

```bash
make build
```

### Build Frontend Only

```bash
cd _frontend && npm run build
```

### Build Backend Only

```bash
cd _backend && CGO_ENABLED=1 go build -o ../bin/server ./cmd/api
```

## 🗄️ Database

### Run Migrations Locally

```bash
sqlite3 _backend/data/programprimitives.db < _backend/migrations/001_initial.sql
sqlite3 _backend/data/programprimitives.db < _backend/migrations/002_seed_primitives.sql
```

### Access Production Database

```bash
fly ssh console
sqlite3 /data/programprimitives.db
```

## 📊 Monitoring

### View Logs

```bash
fly logs
```

### Check Status

```bash
fly status
```

### SSH into Container

```bash
fly ssh console
```

## 🔄 Updating

### Deploy New Version

```bash
fly deploy
```

### Scale Up/Down

```bash
# Scale to 2 machines
fly scale count 2

# Scale memory
fly scale memory 512
```

## 🌍 Custom Domain

### Add Domain

```bash
fly certs add yourdomain.com
```

### Check Certificate Status

```bash
fly certs show yourdomain.com
```

## 💰 Cost Estimate

| Component | Free Tier | After Free |
|-----------|-----------|------------|
| 1 VM (shared, 256MB) | ✅ Included | ~$2/month |
| 1 VM (shared, 512MB) | - | ~$4/month |
| 1GB Volume | ✅ 3GB free | $0.15/GB/month |
| Bandwidth | 160GB/month | $0.02/GB |

**Estimated Monthly Cost**: $0-5 for small apps

## 🔧 Troubleshooting

### App Won't Start

Check logs:
```bash
fly logs
```

### Database Issues

SSH in and check:
```bash
fly ssh console
ls -la /data/
sqlite3 /data/programprimitives.db ".tables"
```

### Health Check Failing

Test locally:
```bash
curl http://localhost:8080/api/health
```

## 📁 Project Structure

```
programprimitives/
├── _backend/
│   ├── cmd/api/main.go      # Entry point
│   ├── internal/            # Business logic
│   ├── migrations/          # SQL migrations
│   └── go.mod
├── _frontend/
│   ├── src/                 # SvelteKit app
│   ├── static/              # Static assets
│   └── package.json
├── braids/                  # BRAID documentation
├── Dockerfile               # Multi-stage build
├── fly.toml                 # Fly.io config
├── litefs.yml               # LiteFS config
└── Makefile                 # Dev commands
```

