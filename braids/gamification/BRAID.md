# GAMIFICATION Braid

## Purpose
Drives user engagement through XP, levels, achievements, leaderboards, and challenges. Makes learning addictive and rewarding.

## Scope
- XP and leveling system
- Achievement unlocks
- Daily/weekly challenges
- Leaderboards
- Notifications

## Dependencies
- **External**: None
- **Internal**: 
  - core (types)
  - auth (user context)
  - progress (activity triggers)
  - exercises (completion triggers)

## Current Status
- [ ] Database schema
- [ ] XP calculation
- [ ] Level system
- [ ] Achievement definitions
- [ ] Achievement triggers
- [ ] Leaderboard queries
- [ ] Challenge system
- [ ] Frontend achievements page
- [ ] Notification system

## Strands

### 1. xp
Experience point system
- XP for completions
- Bonus multipliers
- Level thresholds

### 2. achievements
Badge and unlock system
- Define achievements
- Check trigger conditions
- Award on unlock
- Notify user

### 3. leaderboard
Competitive rankings
- Daily/weekly/monthly/all-time
- By XP earned
- Filter by friends (Phase 2)

### 4. challenges
Time-limited challenges
- Daily challenge
- Weekly challenge
- Special events

## API Endpoints

```
GET    /api/gamification/xp                       - XP info
GET    /api/gamification/level                    - Level info
GET    /api/gamification/achievements             - User achievements
GET    /api/gamification/achievements/available   - Locked achievements
POST   /api/gamification/achievements/:id/claim   - Claim reward
GET    /api/gamification/leaderboard/:period      - Rankings
GET    /api/gamification/challenges/daily         - Today's challenge
GET    /api/gamification/challenges/weekly        - This week's
POST   /api/gamification/challenges/:id/submit    - Submit entry
```

## Database Schema

### achievements
```sql
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    rarity TEXT NOT NULL,
    trigger_condition TEXT NOT NULL,  -- JSON
    is_secret INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
);
```

### user_achievements
```sql
CREATE TABLE user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    notified INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);
```

### challenges
```sql
CREATE TABLE challenges (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,              -- daily, weekly, special
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    exercise_ids TEXT NOT NULL,      -- JSON array
    primitive_id TEXT,
    xp_reward INTEGER NOT NULL,
    badge_id TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    time_limit_minutes INTEGER,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
);
```

### user_challenges
```sql
CREATE TABLE user_challenges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    status TEXT NOT NULL,
    exercises_completed TEXT,        -- JSON array
    score INTEGER,
    started_at TEXT,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    UNIQUE(user_id, challenge_id)
);
```

## Achievement Definitions

### Milestone Achievements
| ID | Name | Condition | XP | Rarity |
|----|------|-----------|-----|--------|
| first-blood | First Blood | Complete 1 exercise | 25 | Common |
| getting-started | Getting Started | Complete 10 exercises | 100 | Common |
| on-a-roll | On a Roll | Complete 50 exercises | 250 | Rare |
| centurion | Centurion | Complete 100 exercises | 500 | Epic |
| exercise-master | Exercise Master | Complete 500 exercises | 1000 | Legendary |

### Consistency Achievements
| ID | Name | Condition | XP | Rarity |
|----|------|-----------|-----|--------|
| first-week | First Week | 7-day streak | 100 | Common |
| two-weeks | Two Weeks | 14-day streak | 200 | Rare |
| monthly | Monthly | 30-day streak | 500 | Epic |
| quarterly | Quarterly | 100-day streak | 1000 | Legendary |
| yearly | Yearly | 365-day streak | 2500 | Legendary |

### Skill Achievements
| ID | Name | Condition | XP | Rarity |
|----|------|-----------|-----|--------|
| loop-master | Loop Master | Master all loop primitives | 300 | Rare |
| array-wizard | Array Wizard | Master array operations | 300 | Rare |
| polyglot | Polyglot | Use 3 languages | 200 | Rare |
| hyperglot | Hyperglot | Use all languages | 500 | Epic |
| perfectionist | Perfectionist | 5 perfect scores | 250 | Epic |
| no-hints-hero | No Hints Hero | 10 exercises without hints | 300 | Epic |

## Achievement Unlock Flow

```
Exercise Complete
      │
      ▼
┌─────────────┐
│ Check All   │
│ Conditions  │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
   ▼       ▼
  No      Yes
  │        │
  │   ┌────┴────┐
  │   │ Insert  │
  │   │ Unlock  │
  │   └────┬────┘
  │        │
  │   ┌────┴────┐
  │   │ Award   │
  │   │ XP      │
  │   └────┬────┘
  │        │
  │   ┌────┴────┐
  │   │ Notify  │
  │   │ User    │
  │   └─────────┘
  │
  ▼
Done
```

## Achievements UI

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 Achievements                              12/42 Unlocked│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Milestones                                     5/10 ━━━━━░ │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   ⭐    │ │   🎯    │ │   🔒    │ │   🔒    │           │
│  │ First   │ │ Getting │ │ On a   │ │ Cent-  │           │
│  │ Blood   │ │ Started │ │ Roll   │ │ urion  │           │
│  │ ✓ Done  │ │ ✓ Done  │ │ 23/50  │ │ 23/100 │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│  Consistency                                    2/5 ━━━░░░░ │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   🔥    │ │   📅    │ │   🔒    │ │   🔒    │           │
│  │ First   │ │ Two     │ │ Monthly │ │ Quar-  │           │
│  │ Week    │ │ Weeks   │ │         │ │ terly  │           │
│  │ ✓ Done  │ │ ✓ Done  │ │ 14/30  │ │ 14/100 │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

