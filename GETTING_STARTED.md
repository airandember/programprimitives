# Getting Started with ProgramPrimitives.com

Welcome to ProgramPrimitives.com development! This guide will help you set up your environment and understand the project structure.

## 🧬 Architecture Overview

This project uses the **BRAID Methodology** - see `_BRAID/_BRAID_METHODOLOGY.md` for details.

```
programprimitives/
├── _BRAID/                    # BRAID methodology documentation
├── _backend/                  # Go/Cloudflare Workers backend
│   ├── braids/               # Domain-driven modules
│   │   ├── authentication/   # User auth & sessions
│   │   ├── primitives/       # Educational content
│   │   ├── exercises/        # Interactive exercises
│   │   ├── progress/         # Learning tracking
│   │   ├── subscription/     # Billing & tiers
│   │   └── gamification/     # Achievements & XP
│   ├── cmd/                  # Entry points
│   ├── internal/             # Shared internal packages
│   └── pkg/                  # Public packages
├── _frontend/                 # Svelte frontend
│   ├── braids/               # Domain-driven modules
│   ├── src/
│   │   ├── lib/              # Shared components & stores
│   │   └── routes/           # SvelteKit routes
│   └── static/               # Static assets
└── docs/                      # Additional documentation
```

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.21+
- **Platform**: Cloudflare Workers (via Workers for Platforms or traditional deployment)
- **Database**: Cloudflare D1 (SQLite) + Workers KV
- **Auth**: JWT tokens with refresh rotation

### Frontend
- **Framework**: SvelteKit 2.x
- **Styling**: TailwindCSS 3.x
- **Editor**: Monaco Editor (VS Code's editor)
- **State**: Svelte Stores
- **Build**: Vite

### Infrastructure
- **CDN**: Cloudflare
- **Payments**: Stripe
- **Email**: SendGrid/Postmark
- **Monitoring**: Cloudflare Analytics + custom metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Go 1.21+
- Wrangler CLI (`npm install -g wrangler`)
- A Cloudflare account

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/programprimitives.git
cd programprimitives

# Install frontend dependencies
cd _frontend
npm install

# Install backend dependencies
cd ../_backend
go mod download
```

### 2. Environment Setup

```bash
# Copy environment templates
cp _frontend/.env.example _frontend/.env
cp _backend/.env.example _backend/.env

# Configure your environment variables
# See each .env file for required values
```

### 3. Database Setup

```bash
# Create D1 database
wrangler d1 create programprimitives-db

# Run migrations
cd _backend
wrangler d1 execute programprimitives-db --file=./migrations/001_initial.sql
```

### 4. Start Development

```bash
# Terminal 1: Start backend
cd _backend
wrangler dev

# Terminal 2: Start frontend
cd _frontend
npm run dev
```

### 5. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:8787

## 📚 Core Concepts

### Primitives
The building blocks of programming - loops, conditionals, functions, etc. See `_backend/braids/primitives/BRAID.md`.

### Exercises
Interactive coding challenges tied to primitives. Users write code that's executed in a secure sandbox.

### Mastery System
Users progress through mastery levels (0-5) per primitive, per language. See `_backend/braids/progress/BRAID.md`.

### Subscription Tiers
- **Free**: Basic primitives, 1 language, limited exercises
- **Learner** ($9/mo): All primitives, 3 languages
- **Pro** ($19/mo): Everything + advanced features
- **Team** ($15/user/mo): Team management features

## 🔧 Development Commands

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run tests
npm run lint       # Run linter
```

### Backend
```bash
go run cmd/api/main.go    # Run locally (without Wrangler)
wrangler dev              # Run with Wrangler
go test ./...             # Run tests
go build ./...            # Build all packages
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `_BRAID/_BRAID_METHODOLOGY.md` | BRAID methodology guide |
| `_backend/braids/*/BRAID.md` | Backend domain documentation |
| `_frontend/braids/*/BRAID.md` | Frontend domain documentation |
| `_backend/wrangler.toml` | Cloudflare Workers config |
| `_frontend/svelte.config.js` | SvelteKit configuration |

## 🧪 Testing

```bash
# Backend tests
cd _backend && go test ./...

# Frontend tests
cd _frontend && npm test

# E2E tests
cd _frontend && npm run test:e2e
```

## 🚢 Deployment

### Staging
```bash
wrangler publish --env staging
```

### Production
```bash
wrangler publish --env production
```

## 🤝 Contributing

1. Read `_BRAID/_BRAID_METHODOLOGY.md`
2. Find the relevant braid for your work
3. Check the braid's `BRAID.md` for context
4. Create a feature branch
5. Update documentation as you code
6. Submit a PR

## ❓ Need Help?

- Check the braid's `BRAID.md` file
- Look at existing strands for patterns
- Ask in the team Discord/Slack

