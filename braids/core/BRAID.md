# CORE Braid

## Purpose
Provides shared types, utilities, API contracts, and validation schemas used across all other braids. This is the foundation that ensures frontend and backend speak the same language.

## Scope
- TypeScript type definitions (shared between FE/BE)
- API response/request contracts
- Validation schemas (Zod)
- Error types and handling
- Constants and configuration
- Utility functions

## Dependencies
- **External**: Zod (validation)
- **Internal**: None (foundational braid)

## Current Status
- [x] Shared types defined
- [x] API client wrapper
- [x] Validation schemas
- [x] Error handling
- [x] Constants
- [x] Utility functions

## ✅ PILOT COMPLETE

## Strands
1. **types** - Shared TypeScript interfaces
2. **api-client** - HTTP client with auth, errors
3. **validation** - Zod schemas for all entities
4. **constants** - Enums, config values

## File Organization

```
braids/core/
├── BRAID.md
├── types/
│   ├── index.ts          # Re-exports all types
│   ├── user.ts           # User, Session types
│   ├── primitive.ts      # Primitive, Syntax types
│   ├── exercise.ts       # Exercise, TestCase types
│   ├── progress.ts       # Mastery, Streak types
│   ├── gamification.ts   # XP, Achievement types
│   ├── subscription.ts   # Tier, Payment types
│   └── api.ts            # Request/Response wrappers
│
├── validation/
│   ├── index.ts          # Re-exports all schemas
│   ├── user.ts           # User validation
│   ├── exercise.ts       # Exercise validation
│   └── ...
│
├── constants/
│   ├── index.ts
│   ├── languages.ts      # Supported languages
│   ├── tiers.ts          # Subscription tiers
│   └── mastery.ts        # Mastery levels
│
└── errors/
    ├── index.ts
    ├── api-error.ts      # API error class
    └── codes.ts          # Error codes
```

## Usage

Types are imported from `@/braids/core/types`:
```typescript
import type { User, Primitive, Exercise } from '@/braids/core/types';
```

Validation schemas from `@/braids/core/validation`:
```typescript
import { userSchema, exerciseSchema } from '@/braids/core/validation';
```

