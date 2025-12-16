# Progress Tables Schema

## Purpose
Tracks all user learning progress including exercise completions, primitive mastery, and streaks.

## User Progress Table

```sql
CREATE TABLE user_progress (
    user_id TEXT PRIMARY KEY,               -- Foreign key to users
    
    -- Aggregate Stats
    total_exercises_completed INTEGER DEFAULT 0,
    total_primitives_mastered INTEGER DEFAULT 0,
    total_time_spent_minutes INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    
    -- Streaks
    current_daily_streak INTEGER DEFAULT 0,
    longest_daily_streak INTEGER DEFAULT 0,
    streak_last_date TEXT,                  -- Last activity date for streak
    
    -- Timestamps
    last_activity_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Primitive Mastery Table

```sql
CREATE TABLE primitive_mastery (
    id TEXT PRIMARY KEY,                    -- UUID
    user_id TEXT NOT NULL,                  -- Foreign key to users
    primitive_id TEXT NOT NULL,             -- Foreign key to primitives
    language TEXT NOT NULL,                 -- Language context
    
    -- Mastery Data
    mastery_level INTEGER DEFAULT 0,        -- 0-5 scale
    exercises_completed INTEGER DEFAULT 0,
    exercises_available INTEGER DEFAULT 0,  -- Cached count
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,           -- 0-100 percentage
    
    -- Time Tracking
    total_time_minutes INTEGER DEFAULT 0,
    
    -- Decay (skills fade without practice)
    last_practiced_at TEXT,
    decay_factor REAL DEFAULT 1.0,          -- Multiplier for effective mastery
    
    -- Timestamps
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(user_id, primitive_id, language)
);

CREATE INDEX idx_mastery_user ON primitive_mastery(user_id);
CREATE INDEX idx_mastery_primitive ON primitive_mastery(primitive_id);
CREATE INDEX idx_mastery_language ON primitive_mastery(language);
CREATE INDEX idx_mastery_level ON primitive_mastery(mastery_level);
```

## Exercise Completion Table

```sql
CREATE TABLE exercise_completions (
    id TEXT PRIMARY KEY,                    -- UUID
    user_id TEXT NOT NULL,                  -- Foreign key to users
    exercise_id TEXT NOT NULL,              -- Foreign key to exercises
    language TEXT NOT NULL,                 -- Language used
    
    -- Completion Data
    status TEXT NOT NULL,                   -- 'completed', 'attempted', 'skipped'
    attempts INTEGER DEFAULT 1,
    hints_used INTEGER DEFAULT 0,
    
    -- Scoring
    score INTEGER,                          -- 0-100 percentage
    time_spent_seconds INTEGER,             -- Time to complete
    
    -- Code
    submitted_code TEXT,                    -- Final submitted solution
    
    -- Feedback
    feedback_given TEXT,                    -- Any AI/system feedback
    
    -- Timestamps
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    UNIQUE(user_id, exercise_id, language)
);

CREATE INDEX idx_completions_user ON exercise_completions(user_id);
CREATE INDEX idx_completions_exercise ON exercise_completions(exercise_id);
CREATE INDEX idx_completions_status ON exercise_completions(status);
CREATE INDEX idx_completions_date ON exercise_completions(completed_at);
```

## Activity Log Table

```sql
CREATE TABLE activity_log (
    id TEXT PRIMARY KEY,                    -- UUID
    user_id TEXT NOT NULL,                  -- Foreign key to users
    
    -- Activity Data
    activity_type TEXT NOT NULL,            -- 'exercise_complete', 'login', 'achievement', etc.
    activity_data TEXT,                     -- JSON with activity details
    
    -- XP
    xp_earned INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TEXT NOT NULL,
    
    -- Constraints
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_date ON activity_log(created_at);
```

## Mastery Level Calculation

```
LEVEL 0: Unexplored
  - exercises_completed = 0

LEVEL 1: Introduced
  - exercises_completed >= 1
  - Completed tutorial/intro exercise

LEVEL 2: Practicing
  - exercises_completed >= 3
  - average_score >= 50

LEVEL 3: Familiar
  - exercises_completed >= 5
  - average_score >= 70

LEVEL 4: Proficient
  - exercises_completed >= 8
  - average_score >= 80
  - successful_attempts / total_attempts >= 0.7

LEVEL 5: Mastered
  - exercises_completed = exercises_available (all done)
  - average_score >= 90
  - successful_attempts / total_attempts >= 0.85
  - Practiced within last 30 days (no decay)
```

## Streak Logic

```sql
-- Check if streak continues (called on activity)
-- streak_last_date is the previous activity date

-- If today's date - streak_last_date = 1 day:
--   current_daily_streak += 1
--   streak_last_date = today

-- If today's date - streak_last_date > 1 day:
--   current_daily_streak = 1
--   streak_last_date = today

-- If today's date = streak_last_date:
--   No change (already active today)

-- Update longest if current exceeds it:
-- IF current_daily_streak > longest_daily_streak:
--   longest_daily_streak = current_daily_streak
```

## Notes

- All timestamps are ISO 8601 format
- Mastery decay: decay_factor reduces by 0.1 per week of inactivity (min 0.5)
- XP totals are stored redundantly for fast access
- Activity log is append-only for audit trail
- Score is 0-100 based on: test pass rate, attempts, hints used, time

