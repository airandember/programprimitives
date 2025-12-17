# EXERCISES Braid

## Purpose
Manages interactive coding exercises for practicing primitives. Each primitive has multiple exercises of varying difficulty that users complete to build mastery.

## Scope
- Exercise catalog by primitive
- Exercise workspace with code editor
- Progressive hint system
- Solution submission and validation
- Test case execution
- Exercise history and attempts

## Dependencies
- **External**: Monaco Editor (code editing)
- **Internal**: 
  - core (types)
  - auth (user context)
  - sandbox (code execution)
  - primitives (linked content)
  - progress (tracking completions)
  - gamification (XP rewards)

## Current Status
- [ ] Database schema
- [ ] Seed exercises
- [ ] Catalog API
- [ ] Detail API
- [ ] Submit API
- [ ] Hint API
- [ ] Frontend catalog
- [ ] Exercise workspace
- [ ] Test result display
- [ ] Success modal

## Strands

### 1. catalog
List exercises for a primitive
- Filter by difficulty
- Show completion status
- Show estimated time

### 2. workspace
Interactive coding environment
- Monaco Editor integration
- Language switcher
- Starter code loading
- Run code button
- Output display

### 3. hints
Progressive hint system
- Multiple hint levels
- Reveal on request
- Score penalty for using hints

### 4. submit
Solution submission
- Validate against test cases
- Calculate score
- Award XP
- Update mastery
- Check achievements

### 5. history
User's exercise history
- Previous attempts
- Best score
- Time spent
- Code snapshots

## API Endpoints

```
GET    /api/exercises                          - List all
GET    /api/exercises/:id                      - Get detail
GET    /api/exercises/primitive/:primitiveId   - By primitive
POST   /api/exercises/:id/start                - Start attempt
GET    /api/exercises/:id/hints/:level         - Get hint
POST   /api/exercises/:id/submit               - Submit solution
GET    /api/exercises/:id/history              - User history
```

## Database Schema

### exercises
```sql
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,
    primitive_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    hints TEXT NOT NULL,           -- JSON array
    difficulty INTEGER DEFAULT 1,
    estimated_minutes INTEGER DEFAULT 10,
    sequence_order INTEGER DEFAULT 0,
    is_premium INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id)
);
```

### exercise_starter_code
```sql
CREATE TABLE exercise_starter_code (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    language TEXT NOT NULL,
    starter_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    UNIQUE(exercise_id, language)
);
```

### exercise_test_cases
```sql
CREATE TABLE exercise_test_cases (
    id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    input TEXT NOT NULL,           -- JSON
    expected_output TEXT NOT NULL, -- JSON
    is_hidden INTEGER DEFAULT 0,
    timeout_ms INTEGER DEFAULT 5000,
    sequence_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
```

### exercise_submissions
```sql
CREATE TABLE exercise_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    language TEXT NOT NULL,
    submitted_code TEXT NOT NULL,
    status TEXT NOT NULL,          -- passed, failed, error
    score INTEGER,
    hints_used INTEGER DEFAULT 0,
    time_spent_seconds INTEGER,
    test_results TEXT,             -- JSON
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
```

## Exercise Workspace UI

```
┌─────────────────────────────────────────────────────────────┐
│  Exercise: Print Numbers 1-10                    [JS ▼]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Instructions                      │  Code Editor          │
│  ─────────────                     │  ────────────         │
│  Write a for loop that prints      │  function solution()  │
│  numbers from 1 to 10.             │  {                    │
│                                    │    // Your code here  │
│  Expected Output:                  │  }                    │
│  1                                 │                       │
│  2                                 │                       │
│  ...                               │                       │
│  10                                │                       │
│                                    │                       │
│  [💡 Hint 1] [💡 Hint 2]           │                       │
├────────────────────────────────────┼───────────────────────┤
│  Output                            │  Test Cases           │
│  ──────                            │  ──────────           │
│  > Ready to run...                 │  ○ Prints 1-10        │
│                                    │  ○ Uses for loop      │
│                                    │  ○ No hardcoding      │
├────────────────────────────────────┴───────────────────────┤
│                        [▶ Run Code]    [✓ Submit]          │
└─────────────────────────────────────────────────────────────┘
```

