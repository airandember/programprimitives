# ProgramPrimitives - Full-Stack BRAID Architecture

## 🧬 Overview

This document defines our complete BRAID architecture, connecting frontend and backend through unified naming conventions, shared types, and coordinated strands.

---

## 📦 Core Braids (Development Order)

### Phase 1: Foundation

| # | Braid | Purpose | Priority |
|---|-------|---------|----------|
| 1 | **core** | Shared types, API contracts, utilities | 🔴 Critical |
| 2 | **auth** | Authentication, sessions, users | 🔴 Critical |

### Phase 2: Content & Learning

| # | Braid | Purpose | Priority |
|---|-------|---------|----------|
| 3 | **primitives** | Educational content, syntax, explanations | 🔴 Critical |
| 4 | **exercises** | Interactive coding challenges | 🔴 Critical |
| 5 | **sandbox** | Secure code execution engine | 🔴 Critical |

### Phase 3: Engagement

| # | Braid | Purpose | Priority |
|---|-------|---------|----------|
| 6 | **progress** | Learning tracking, mastery, streaks | 🟡 High |
| 7 | **gamification** | XP, achievements, leaderboards | 🟡 High |

### Phase 4: Conversion & Monetization

| # | Braid | Purpose | Priority |
|---|-------|---------|----------|
| 8 | **free-zone** | No-auth try-it-now experience, conversion funnel | 🔴 Critical |
| 9 | **subscription** | Billing, tiers, access control | 🟡 High |

---

## 🔗 Braid Structure (Full-Stack)

Each braid follows this unified structure:

```
braids/{braid-name}/
├── BRAID.md                    # Overview, scope, dependencies
├── types.ts                    # Shared TypeScript types (copied to both ends)
│
├── backend/
│   ├── handlers/               # API route handlers
│   ├── services/               # Business logic
│   ├── repositories/           # Data access
│   └── schema/                 # Database schema docs
│
├── frontend/
│   ├── stores/                 # Svelte stores
│   ├── components/             # UI components
│   ├── pages/                  # Route pages
│   └── api/                    # API client functions
│
└── strands/
    ├── {strand-name}/
    │   ├── STRAND.md           # Strand documentation
    │   ├── backend.md          # Backend implementation notes
    │   └── frontend.md         # Frontend implementation notes
    └── ...
```

---

## 📋 Braid Definitions

### 1. CORE Braid
> Shared foundation for all other braids

**Strands:**
- `types` - Shared TypeScript interfaces/types
- `api-client` - HTTP client wrapper with error handling
- `validation` - Shared validation schemas (Zod)
- `constants` - Shared constants, enums, config

**Endpoints:** None (utility braid)

---

### 2. AUTH Braid
> User identity and access management

**Strands:**
- `register` - User registration flow
- `login` - Email/password authentication
- `logout` - Session termination
- `session` - JWT token management
- `oauth` - Google/GitHub social login
- `password-reset` - Forgot password flow
- `email-verify` - Email verification

**Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
GET    /api/auth/oauth/:provider
GET    /api/auth/oauth/:provider/callback
GET    /api/auth/me
```

**Database Tables:**
- `users`
- `sessions`
- `password_resets`
- `oauth_accounts`

---

### 3. PRIMITIVES Braid
> Educational content management

**Strands:**
- `catalog` - List and filter primitives
- `detail` - Individual primitive view
- `syntax` - Language-specific syntax examples
- `content` - Best practices, pitfalls, explanations
- `search` - Full-text search

**Endpoints:**
```
GET    /api/primitives
GET    /api/primitives/:id
GET    /api/primitives/:id/syntax/:language
GET    /api/primitives/categories
GET    /api/primitives/search?q=
```

**Database Tables:**
- `primitives`
- `primitive_syntax`
- `primitive_categories`

---

### 4. EXERCISES Braid
> Interactive coding challenges

**Strands:**
- `catalog` - List exercises by primitive
- `detail` - Exercise instructions, starter code
- `hints` - Progressive hint system
- `submit` - Solution submission
- `history` - User's exercise history

**Endpoints:**
```
GET    /api/exercises
GET    /api/exercises/:id
GET    /api/exercises/primitive/:primitiveId
POST   /api/exercises/:id/start
GET    /api/exercises/:id/hints/:level
POST   /api/exercises/:id/submit
GET    /api/exercises/:id/history
```

**Database Tables:**
- `exercises`
- `exercise_starter_code`
- `exercise_test_cases`
- `exercise_submissions`

---

### 5. SANDBOX Braid
> Secure code execution

**Strands:**
- `runner` - Code execution engine
- `languages` - Language runtime configs
- `security` - Sandboxing, limits, validation
- `output` - Output parsing, formatting

**Endpoints:**
```
POST   /api/sandbox/run
GET    /api/sandbox/languages
GET    /api/sandbox/status
```

**No database tables** (stateless execution)

---

### 6. PROGRESS Braid
> Learning analytics and tracking

**Strands:**
- `overview` - Dashboard summary stats
- `mastery` - Primitive mastery levels
- `streaks` - Daily/weekly streak tracking
- `history` - Activity timeline
- `analytics` - Learning insights

**Endpoints:**
```
GET    /api/progress
GET    /api/progress/mastery
GET    /api/progress/mastery/:primitiveId
GET    /api/progress/streaks
GET    /api/progress/history
GET    /api/progress/analytics
```

**Database Tables:**
- `user_progress`
- `primitive_mastery`
- `activity_log`

---

### 7. GAMIFICATION Braid
> Engagement and motivation

**Strands:**
- `xp` - Experience points system
- `levels` - User leveling
- `achievements` - Badges and unlocks
- `leaderboard` - Rankings
- `challenges` - Daily/weekly challenges

**Endpoints:**
```
GET    /api/gamification/xp
GET    /api/gamification/level
GET    /api/gamification/achievements
GET    /api/gamification/achievements/available
POST   /api/gamification/achievements/:id/claim
GET    /api/gamification/leaderboard/:period
GET    /api/gamification/challenges/daily
GET    /api/gamification/challenges/weekly
POST   /api/gamification/challenges/:id/submit
```

**Database Tables:**
- `user_xp`
- `achievements`
- `user_achievements`
- `challenges`
- `challenge_submissions`

---

### 8. FREE-ZONE Braid
> Standalone conversion funnel (no auth required)

**Strands:**
- `landing` - Entry point, "Try Now" experience
- `exercises` - Curated subset of exercises
- `prompts` - Signup CTAs after completion
- `tracking` - Conversion analytics

**Routes:**
```
/try                      - Free zone landing
/try/:primitive           - Primitive preview
/try/:primitive/:exercise - Exercise workspace
```

**Key Features:**
- No authentication required
- 3 curated primitives (Variables, For Loop, Conditionals)
- 2 exercises per primitive (6 total)
- Full exercise experience (same quality as paid)
- Signup prompt after each completion
- localStorage progress (not synced)
- Conversion tracking for analytics

**No database tables** (all localStorage)

---

### 9. SUBSCRIPTION Braid
> Monetization and access

**Strands:**
- `tiers` - Subscription tier definitions
- `checkout` - Stripe payment flow
- `portal` - Billing management
- `access` - Feature gating
- `usage` - Usage tracking for limits

**Endpoints:**
```
GET    /api/subscription
GET    /api/subscription/tiers
POST   /api/subscription/checkout
POST   /api/subscription/portal
POST   /api/subscription/webhook
GET    /api/subscription/usage
POST   /api/subscription/cancel
```

**Database Tables:**
- `subscriptions`
- `payment_history`
- `usage_records`

---

## 🏷️ Naming Conventions

### API Endpoints
- Lowercase, kebab-case
- Plural nouns for collections: `/api/primitives`
- Singular with ID for items: `/api/primitives/:id`
- Verbs for actions: `/api/auth/login`

### Database Tables
- Lowercase, snake_case
- Plural: `users`, `exercises`, `achievements`
- Junction tables: `user_achievements`, `primitive_mastery`

### TypeScript Types
- PascalCase: `User`, `Primitive`, `Exercise`
- Suffixes: `CreateUserRequest`, `UserResponse`, `ExerciseListItem`

### Svelte Stores
- camelCase: `currentUser`, `primitives`, `exerciseProgress`
- Actions as functions: `loadPrimitives()`, `submitExercise()`

### Components
- PascalCase: `PrimitiveCard.svelte`, `ExerciseWorkspace.svelte`
- Prefixed by braid: `AuthLoginForm.svelte`, `ProgressMasteryMap.svelte`

### Files & Directories
- kebab-case: `exercise-workspace.svelte`, `user-repository.go`

---

## 🚀 Development Order

```
Week 1-2: Foundation
├── [1] core braid - types, API client, validation
└── [2] auth braid - registration, login, sessions

Week 3-4: Content
├── [3] primitives braid - catalog, detail, syntax
└── [4] exercises braid - catalog, detail, hints

Week 5-6: Execution
├── [5] sandbox braid - code runner, security
└── [4] exercises braid - submit, validation (continued)

Week 7-8: Tracking
├── [6] progress braid - mastery, streaks, history
└── [7] gamification braid - XP, achievements

Week 9-10: Conversion & Monetize
├── [8] free-zone braid - try-it-now, conversion funnel
├── [9] subscription braid - tiers, checkout, access
└── Polish, testing, documentation
```

---

## ✅ Completed Braids

| Braid | Status | Frontend | Backend |
|-------|--------|----------|---------|
| **CORE** | ✅ Complete | Types, API client, validation, utils | Shared types |
| **AUTH** | ✅ Complete | Login/Register forms, store | Go handlers, bcrypt |
| **PRIMITIVES** | ✅ Complete | Catalog, detail pages, syntax | Data structures |
| **EXERCISES** | ✅ Complete | Practice hub, workspace, tests | Data structures |
| **FREE-ZONE** | ✅ Complete | /try routes, signup prompts | localStorage tracking |
| **PROGRESS** | ✅ Complete | Dashboard, mastery, errors | - |
| **GAMIFICATION** | ✅ Complete | Achievements, XP, badges | - |
| **SANDBOX** | ✅ Complete | Client-side JS execution | Go handlers, security |
| **SUBSCRIPTION** | ✅ Complete | Pricing, tiers, access control | Provider interface |

---

## 🎯 What's Built

### User Flows
- ✅ Homepage with "Try Free" CTA
- ✅ Free zone with limited exercises
- ✅ Learn catalog with primitives
- ✅ Primitive detail with syntax examples
- ✅ Practice hub with exercises
- ✅ Exercise workspace with code editor
- ✅ Dashboard with progress tracking
- ✅ Achievements page with badges
- ✅ Login/Register with auth modal

### Key Features
- ✅ 13 primitives with full content
- ✅ 20 exercises with test cases
- ✅ Multi-language syntax (JS, Python, Go)
- ✅ Error pattern detection & insights
- ✅ XP system with levels
- ✅ Achievement badges (17 total)
- ✅ Daily challenges
- ✅ Streak tracking
- ✅ Mastery levels (0-5)
- ✅ Secure code execution sandbox
- ✅ Real JavaScript execution in browser
- ✅ Security patterns blocking dangerous code
- ✅ Payment-agnostic subscription system
- ✅ Free/Premium/Pro tiers with feature gating
- ✅ Pricing page with comparison table

---

*Remember: Each strand should be fully functional end-to-end (API → Database → Store → UI) before moving to the next.*

