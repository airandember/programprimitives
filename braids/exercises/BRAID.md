# EXERCISES Braid

## Purpose
The practice engine - coding exercises for each primitive with multi-language support, test runners, and progressive difficulty.

## Scope
- Exercise definitions and starter code
- Multi-language starter templates
- Test cases and validation
- Hint system
- Code execution (sandbox)
- Solution submission and scoring

## Strands
1. **catalog** - List exercises by primitive
2. **detail** - Exercise instructions and workspace
3. **runner** - Code execution and testing
4. **submission** - Save and score solutions

## Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/exercises` | List exercises (with filtering) |
| `GET` | `/api/exercises/:id` | Get exercise detail |
| `POST` | `/api/exercises/:id/run` | Run code (no save) |
| `POST` | `/api/exercises/:id/submit` | Submit solution |
| `GET` | `/api/exercises/:id/hints` | Get hints (progressive) |

## Data Structure

### Exercise
```typescript
{
  id: string;              // "ex-for-001"
  primitiveId: string;     // "for-loop"
  title: string;
  slug: string;
  description: string;
  instructions: string;    // Markdown
  difficulty: 1-5;
  estimatedMinutes: number;
  hints: string[];
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  isPremium: boolean;
}
```

### TestCase
```typescript
{
  id: string;
  name: string;
  input: any;
  expected: any;
  isHidden: boolean;      // Hidden tests for anti-cheat
}
```

### Submission
```typescript
{
  exerciseId: string;
  userId: string;
  language: string;
  code: string;
  passed: boolean;
  score: number;          // 0-100
  xpEarned: number;
  executionTimeMs: number;
}
```

## Exercise Categories
- **Fundamentals**: Basic exercises for each primitive
- **Practice**: More exercises to build fluency
- **Challenge**: Harder problems combining concepts
- **Real-World**: Practical scenarios

## Current Status
- [x] Data model defined
- [x] Seed data created (20+ exercises)
- [x] Frontend stores
- [ ] Code editor integration
- [ ] Test runner (backend)
- [ ] Sandbox execution
- [ ] Solution persistence

## ✅ PILOT COMPLETE (Static Data + Mock Runner)
