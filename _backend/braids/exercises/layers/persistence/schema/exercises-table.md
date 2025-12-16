# Exercises Table Schema

## Purpose
Stores interactive coding exercise definitions, including instructions, test cases, and solutions.

## Table Definition

```sql
CREATE TABLE exercises (
    id TEXT PRIMARY KEY,                    -- UUID v4
    primitive_id TEXT NOT NULL,             -- Foreign key to primitives
    
    -- Basic Info
    title TEXT NOT NULL,                    -- Exercise title
    slug TEXT NOT NULL,                     -- URL-safe identifier
    description TEXT NOT NULL,              -- What the user needs to accomplish
    
    -- Difficulty
    difficulty INTEGER NOT NULL,            -- 1-5 scale
    estimated_minutes INTEGER DEFAULT 5,    -- Expected completion time
    
    -- Content
    instructions TEXT NOT NULL,             -- Detailed step-by-step instructions (Markdown)
    hints TEXT,                             -- JSON array of progressive hints
    
    -- Ordering
    sequence_order INTEGER DEFAULT 0,       -- Order within primitive
    
    -- Status
    is_premium INTEGER DEFAULT 0,           -- Requires paid subscription
    is_published INTEGER DEFAULT 1,         -- Visible to users
    
    -- Timestamps
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(primitive_id, slug)
);

-- Indexes
CREATE INDEX idx_exercises_primitive ON exercises(primitive_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_published ON exercises(is_published);
```

## Exercise Starter Code Table

```sql
CREATE TABLE exercise_starter_code (
    id TEXT PRIMARY KEY,                    -- UUID
    exercise_id TEXT NOT NULL,              -- Foreign key to exercises
    language TEXT NOT NULL,                 -- 'javascript', 'python', etc.
    
    -- Code
    starter_code TEXT NOT NULL,             -- Template code user starts with
    solution_code TEXT NOT NULL,            -- Reference solution (hidden)
    
    -- Timestamps
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    UNIQUE(exercise_id, language)
);

CREATE INDEX idx_starter_exercise ON exercise_starter_code(exercise_id);
CREATE INDEX idx_starter_language ON exercise_starter_code(language);
```

## Exercise Test Cases Table

```sql
CREATE TABLE exercise_test_cases (
    id TEXT PRIMARY KEY,                    -- UUID
    exercise_id TEXT NOT NULL,              -- Foreign key to exercises
    
    -- Test Definition
    name TEXT NOT NULL,                     -- Test case name
    description TEXT,                       -- What this test verifies
    
    -- Test Data (language-agnostic)
    input TEXT NOT NULL,                    -- JSON input data
    expected_output TEXT NOT NULL,          -- JSON expected result
    
    -- Configuration
    is_hidden INTEGER DEFAULT 0,            -- Hidden from user (anti-cheat)
    timeout_ms INTEGER DEFAULT 5000,        -- Execution timeout
    
    -- Ordering
    sequence_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE INDEX idx_tests_exercise ON exercise_test_cases(exercise_id);
```

## Example Data

```json
{
  "exercise": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "primitive_id": "for-loop",
    "title": "Sum of Numbers",
    "slug": "sum-of-numbers",
    "description": "Write a function that calculates the sum of all numbers from 1 to n using a for loop.",
    "difficulty": 2,
    "estimated_minutes": 5,
    "instructions": "## Your Task\n\nCreate a function `sumToN(n)` that returns the sum of all integers from 1 to n.\n\n### Requirements\n- Use a for loop (not a formula)\n- Handle edge cases (n < 1 should return 0)\n\n### Example\n```\nsumToN(5) → 15  // 1+2+3+4+5 = 15\nsumToN(10) → 55\nsumToN(0) → 0\n```",
    "hints": [
      "Start with a variable to store your running total",
      "Loop from 1 to n (inclusive)",
      "Add each number to your total inside the loop"
    ],
    "sequence_order": 1
  },
  "starter_code_javascript": {
    "starter_code": "function sumToN(n) {\n  // Your code here\n  \n}",
    "solution_code": "function sumToN(n) {\n  if (n < 1) return 0;\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}"
  },
  "test_cases": [
    {
      "name": "Basic case",
      "input": {"n": 5},
      "expected_output": 15,
      "is_hidden": false
    },
    {
      "name": "Larger number",
      "input": {"n": 10},
      "expected_output": 55,
      "is_hidden": false
    },
    {
      "name": "Edge case: zero",
      "input": {"n": 0},
      "expected_output": 0,
      "is_hidden": false
    },
    {
      "name": "Edge case: negative",
      "input": {"n": -5},
      "expected_output": 0,
      "is_hidden": true
    }
  ]
}
```

## Notes

- Instructions support Markdown formatting
- Hints are revealed progressively (one at a time)
- Hidden test cases prevent hardcoded solutions
- Each exercise has starter code per language
- Solution code is never exposed to users
- Test input/output is JSON for language-agnostic validation

