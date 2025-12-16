# Gamification Braid

## Purpose
Drives user engagement through achievements, badges, challenges, and leaderboards. This braid makes learning addictive and rewarding.

## Scope
- Achievement definitions and triggers
- Badge system and display
- Timed challenges and puzzles
- Leaderboards (global, friends, weekly)
- XP and leveling system
- Daily/weekly challenges
- Social features (optional sharing)

## Dependencies
- **External**: None
- **Internal**: 
  - Authentication Braid (user identity)
  - Progress Braid (achievement triggers)
  - Exercises Braid (challenge content)

## Current Status
- [ ] Persistence Layer
- [ ] Data Access Layer
- [ ] Business Logic Layer
- [ ] Application Layer
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **achievements** - Badge definitions and unlock logic
2. **xp-system** - Points and leveling mechanics
3. **challenges** - Timed coding challenges
4. **leaderboards** - Rankings and competition
5. **daily-quests** - Rotating daily objectives

## Achievement Categories
```
LEARNING MILESTONES
├── First Steps         - Complete first exercise
├── Primitive Pioneer   - Master first primitive
├── Polyglot Beginner   - Use 3 different languages
├── Loop Legend         - Master all loop types
├── Function Fanatic    - Master all function concepts
└── Full Stack          - Master primitives across all categories

CONSISTENCY ACHIEVEMENTS
├── Early Bird          - Practice before 8 AM
├── Night Owl           - Practice after 10 PM
├── Weekend Warrior     - Practice on weekend
├── Streak Starter      - 7-day streak
├── Streak Master       - 30-day streak
├── Streak Legend       - 100-day streak
└── Year of Code        - 365-day streak

SKILL ACHIEVEMENTS
├── Speed Demon         - Complete exercise in under 1 minute
├── Perfect Score       - 100% on first attempt
├── No Hints Needed     - Complete without hints
├── Bug Squasher        - Fix 10 intentional bugs
├── Code Golfer         - Solve with minimum characters
└── Efficiency Expert   - Beat time estimates consistently

SOCIAL ACHIEVEMENTS
├── Helpful Hand        - Help in community forums
├── Top 100             - Reach global top 100
├── Challenge Champion  - Win weekly challenge
└── Referral Rockstar   - Refer 5 friends
```

## XP System
```
XP SOURCES
├── Exercise completion      +10-50 XP (based on difficulty)
├── First attempt success    +25 XP bonus
├── No hints used            +15 XP bonus
├── Daily login              +5 XP
├── Streak maintenance       +10 XP per day
├── Achievement unlock       +50-500 XP
└── Challenge completion     +100-250 XP

LEVEL THRESHOLDS
├── Level 1:    0 XP       (Beginner)
├── Level 5:    500 XP     (Learner)
├── Level 10:   2,000 XP   (Practitioner)
├── Level 20:   8,000 XP   (Developer)
├── Level 35:   25,000 XP  (Expert)
├── Level 50:   60,000 XP  (Master)
└── Level 100:  200,000 XP (Legend)
```

## Challenge Types
```
DAILY CHALLENGES
├── Random primitive, specific language
├── Time-boxed (15 minutes)
├── Bonus XP for completion
└── Refreshes at midnight UTC

WEEKLY CHALLENGES
├── Themed (e.g., "Loop Week")
├── Multiple exercises
├── Leaderboard ranking
└── Special badge for top performers

SPECIAL EVENTS
├── Seasonal challenges (Hacktoberfest, etc.)
├── New language launches
├── Community milestones
└── Holiday specials
```

## Data Model
```
Achievement
├── id
├── name
├── description
├── category
├── icon
├── xp_reward
├── rarity (common/rare/epic/legendary)
├── trigger_condition (JSON)
└── created_at

UserAchievement
├── user_id
├── achievement_id
├── unlocked_at
└── notified

UserXP
├── user_id
├── total_xp
├── current_level
├── xp_to_next_level
└── updated_at

LeaderboardEntry
├── user_id
├── period (daily/weekly/monthly/alltime)
├── score
├── rank
└── updated_at

Challenge
├── id
├── type (daily/weekly/special)
├── title
├── description
├── exercise_ids[]
├── time_limit
├── xp_reward
├── badge_id (optional)
├── start_date
└── end_date
```

## API Endpoints (Planned)
```
GET    /api/achievements                  - All achievements
GET    /api/achievements/user             - User's unlocked achievements
GET    /api/xp                            - User's XP and level
GET    /api/leaderboard/:period           - Leaderboard rankings
GET    /api/challenges/daily              - Today's daily challenge
GET    /api/challenges/weekly             - Current weekly challenge
POST   /api/challenges/:id/submit         - Submit challenge solution
```

