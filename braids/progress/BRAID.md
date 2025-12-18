# PROGRESS Braid

## Purpose
Track user learning progress with intelligent error pattern detection. Not just "what did you complete" but "where are you struggling and why."

## Core Philosophy
> **Learn from mistakes, not just successes.**
> 
> When a user makes the same type of error repeatedly, we detect the pattern and suggest principles to review. This turns failures into targeted learning opportunities.

## Scope
- Mastery tracking per primitive per language
- Exercise completion & scoring history
- Error pattern detection & analysis
- Learning insights & recommendations
- Streak tracking
- Time spent analytics

## Key Features

### 1. Tool Aptitudes (Mastery)
Track proficiency for each primitive:
- **Level 0**: Unexplored
- **Level 1**: Introduced (attempted)
- **Level 2**: Practicing (some correct)
- **Level 3**: Familiar (mostly correct)
- **Level 4**: Proficient (consistent)
- **Level 5**: Mastered (perfect)

### 2. Error Pattern Detection
Categorize and track common errors:
- **Syntax Errors**: Typos, missing brackets, semicolons
- **Logic Errors**: Off-by-one, infinite loops, wrong conditions
- **Conceptual Errors**: Misunderstanding the primitive
- **Edge Cases**: Not handling nulls, empty arrays, bounds

### 3. Learning Insights
When patterns emerge, suggest:
- Related primitives to review
- Best practices to remember
- Common pitfalls to avoid
- Specific exercises to retry

## Data Structure

### UserProgress
```typescript
{
  userId: string;
  
  // Overall stats
  totalExercisesCompleted: number;
  totalExercisesAttempted: number;
  totalTimeSpentMinutes: number;
  totalXp: number;
  currentLevel: number;
  
  // Streaks
  currentDailyStreak: number;
  longestDailyStreak: number;
  lastActivityAt: string;
  
  // Per-primitive mastery
  mastery: PrimitiveMastery[];
  
  // Error tracking
  errorPatterns: ErrorPattern[];
  
  // Activity log
  recentActivity: ActivityEntry[];
}
```

### PrimitiveMastery
```typescript
{
  primitiveId: string;
  language: string;
  
  // Mastery level (0-5)
  level: number;
  
  // Stats
  exercisesCompleted: number;
  exercisesAvailable: number;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  
  // Error insights
  commonErrors: string[];
  suggestedReview?: string;
}
```

### ErrorPattern
```typescript
{
  errorType: ErrorType;           // 'syntax' | 'logic' | 'conceptual' | 'edge-case'
  primitiveId: string;
  occurrences: number;
  lastOccurred: string;
  
  // What to show user
  description: string;
  suggestion: string;
  relatedPrinciple?: string;
}
```

## Error Types & Principles

### Syntax Errors → Principle: "Precision"
- Missing semicolons
- Mismatched brackets
- Typos in keywords
> "Code is unforgiving. Double-check syntax before logic."

### Logic Errors → Principle: "Think Step-by-Step"
- Off-by-one in loops
- Infinite loops
- Wrong comparison operators
> "Walk through your code line by line. What happens on each iteration?"

### Conceptual Errors → Principle: "Understand Before Coding"
- Using wrong primitive for the task
- Misunderstanding how the primitive works
> "Re-read the primitive explanation. Try explaining it in your own words."

### Edge Case Errors → Principle: "Expect the Unexpected"
- Not handling empty arrays
- Not checking for null/undefined
- Not handling negative numbers
> "What's the simplest input? The weirdest? What if it's empty?"

## Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/progress` | Get user's full progress |
| `GET` | `/api/progress/mastery` | Get mastery per primitive |
| `GET` | `/api/progress/insights` | Get learning insights |
| `POST` | `/api/progress/record` | Record exercise attempt |
| `GET` | `/api/progress/streak` | Get streak info |

## Current Status
- [x] Data model defined
- [x] Frontend stores
- [x] Mastery tracking
- [x] Error pattern detection
- [x] Dashboard components
- [ ] Backend API
- [ ] D1 database integration

## ✅ PILOT COMPLETE (Frontend)
