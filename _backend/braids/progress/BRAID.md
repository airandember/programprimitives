# Progress Braid

## Purpose
Tracks and manages all user learning progress, including exercise completions, primitive mastery levels, streaks, and learning analytics. This braid powers the personalized learning experience.

## Scope
- Exercise completion tracking
- Primitive mastery calculation
- Learning streaks and consistency
- Time spent metrics
- Skill assessments
- Learning path recommendations
- Progress analytics and insights
- Achievement triggers (feeds Gamification)

## Dependencies
- **External**: None
- **Internal**: 
  - Authentication Braid (user identity)
  - Primitives Braid (mastery subjects)
  - Exercises Braid (completion events)
  - Gamification Braid (achievement triggers)

## Current Status
- [ ] Persistence Layer
- [ ] Data Access Layer
- [ ] Business Logic Layer
- [ ] Application Layer
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **completion-tracking** - Record exercise completions
2. **mastery-calculation** - Compute skill levels per primitive
3. **streak-management** - Daily/weekly streak logic
4. **analytics-engine** - Learning insights and stats
5. **recommendations** - Suggested next steps

## Mastery System
```
MASTERY LEVELS (per primitive, per language)
├── Level 0: Unexplored    - Not started
├── Level 1: Introduced    - Completed tutorial
├── Level 2: Practicing    - 1-3 exercises done
├── Level 3: Familiar      - 4-7 exercises done
├── Level 4: Proficient    - 8+ exercises, good scores
└── Level 5: Mastered      - All exercises, excellent scores

SCORING FACTORS
├── Completion rate
├── Attempt count (fewer = better)
├── Time efficiency
├── Code quality score
└── Recency (skills decay over time)
```

## Streak System
```
STREAK TYPES
├── Daily Streak     - Days in a row with activity
├── Weekly Streak    - Weeks with 3+ active days
├── Primitive Streak - Consecutive exercises in same primitive
└── Perfect Streak   - Exercises completed on first try

STREAK BONUSES
├── 7-day streak  → Bronze milestone
├── 30-day streak → Silver milestone
├── 100-day streak → Gold milestone
└── 365-day streak → Legendary milestone
```

## Data Model
```
UserProgress
├── user_id
├── total_exercises_completed
├── total_time_spent
├── current_daily_streak
├── longest_daily_streak
├── last_activity_date
└── created_at

PrimitiveMastery
├── user_id
├── primitive_id
├── language
├── mastery_level (0-5)
├── exercises_completed
├── total_attempts
├── average_score
├── last_practiced
└── updated_at

ExerciseCompletion
├── user_id
├── exercise_id
├── language
├── completed_at
├── attempts
├── time_spent
├── score
├── code_submitted
└── feedback_given
```

## API Endpoints (Planned)
```
GET    /api/progress                      - User's overall progress
GET    /api/progress/primitives           - Mastery per primitive
GET    /api/progress/primitives/:id       - Specific primitive progress
GET    /api/progress/streak               - Current streak info
GET    /api/progress/history              - Activity history
GET    /api/progress/analytics            - Learning insights
GET    /api/progress/recommendations      - Suggested next steps
```

