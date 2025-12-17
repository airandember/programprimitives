# PROGRESS Braid

## Purpose
Tracks user learning progress, mastery levels, streaks, and activity history. This braid powers the dashboard and analytics.

## Scope
- Exercise completion tracking
- Primitive mastery levels
- Daily/weekly streaks
- Activity timeline
- Learning analytics
- Skill decay (optional)

## Dependencies
- **External**: None
- **Internal**: 
  - core (types)
  - auth (user context)
  - exercises (completion events)
  - primitives (mastery tracking)

## Current Status
- [ ] Database schema
- [ ] Progress tracking
- [ ] Mastery calculations
- [ ] Streak tracking
- [ ] Activity logging
- [ ] Dashboard API
- [ ] Analytics API
- [ ] Frontend dashboard
- [ ] Mastery visualization

## Strands

### 1. mastery
Primitive mastery tracking
- Calculate mastery level (0-5)
- Track per language
- Handle decay over time

### 2. streaks
Daily activity streaks
- Check daily activity
- Update streak count
- Track milestones
- Notify achievements

### 3. history
Activity timeline
- Log all activities
- Filter by type
- Paginated results

### 4. analytics
Learning insights
- Strong/weak areas
- Time patterns
- Recommendations

## API Endpoints

```
GET    /api/progress                      - Overview
GET    /api/progress/mastery              - All mastery
GET    /api/progress/mastery/:primitiveId - Single
GET    /api/progress/streaks              - Streak info
GET    /api/progress/history              - Activity log
GET    /api/progress/analytics            - Insights
```

## Database Schema

### user_progress
```sql
CREATE TABLE user_progress (
    user_id TEXT PRIMARY KEY,
    total_exercises_completed INTEGER DEFAULT 0,
    total_primitives_mastered INTEGER DEFAULT 0,
    total_time_spent_minutes INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_daily_streak INTEGER DEFAULT 0,
    longest_daily_streak INTEGER DEFAULT 0,
    streak_last_date TEXT,
    last_activity_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### primitive_mastery
```sql
CREATE TABLE primitive_mastery (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    primitive_id TEXT NOT NULL,
    language TEXT NOT NULL,
    mastery_level INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    average_score REAL DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    last_practiced_at TEXT,
    decay_factor REAL DEFAULT 1.0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (primitive_id) REFERENCES primitives(id),
    UNIQUE(user_id, primitive_id, language)
);
```

### activity_log
```sql
CREATE TABLE activity_log (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    data TEXT,                 -- JSON
    xp_earned INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_activity_user_date ON activity_log(user_id, created_at);
```

## Mastery Calculation

```typescript
function calculateMastery(stats: {
    exercisesCompleted: number;
    totalExercises: number;
    averageScore: number;
    successRate: number;
}): MasteryLevel {
    const { exercisesCompleted, totalExercises, averageScore, successRate } = stats;
    
    // Level 5: All exercises, 90%+ avg, 85%+ success
    if (exercisesCompleted >= totalExercises && 
        averageScore >= 90 && successRate >= 0.85) return 5;
    
    // Level 4: 8+ exercises, 80%+ avg, 70%+ success
    if (exercisesCompleted >= 8 && 
        averageScore >= 80 && successRate >= 0.7) return 4;
    
    // Level 3: 5+ exercises, 70%+ avg
    if (exercisesCompleted >= 5 && averageScore >= 70) return 3;
    
    // Level 2: 3+ exercises, 50%+ avg
    if (exercisesCompleted >= 3 && averageScore >= 50) return 2;
    
    // Level 1: 1+ exercise
    if (exercisesCompleted >= 1) return 1;
    
    // Level 0: Not started
    return 0;
}
```

## Dashboard UI

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, [User]!                           Level 12  │
│  ───────────────────                          ████████░░   │
│                                               340/500 XP   │
├──────────────────────┬──────────────────────────────────────┤
│  🔥 Streak: 7 days   │  This Week                          │
│  ━━━━━━━━━━━━━━━━━   │  ▁▃▅▇▅▃▁                            │
│  Best: 14 days       │  M T W T F S S                      │
├──────────────────────┼──────────────────────────────────────┤
│  Exercises: 47       │  Mastery Map                        │
│  Time: 12h 30m       │  ┌─────────────────────────────┐    │
│  This week: +8       │  │ ⬤ Loops (JS)     ████░ L4  │    │
│                      │  │ ⬤ Arrays (JS)    ███░░ L3  │    │
│                      │  │ ⬤ Functions (JS) ██░░░ L2  │    │
│                      │  │ ○ Objects (JS)   ░░░░░ L0  │    │
│                      │  └─────────────────────────────┘    │
├──────────────────────┴──────────────────────────────────────┤
│  Continue Learning                                         │
│  [For Loops: Exercise 5/8] [Arrays: Exercise 2/6]          │
└─────────────────────────────────────────────────────────────┘
```

