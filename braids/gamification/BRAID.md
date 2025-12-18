# GAMIFICATION Braid

## Purpose
Make learning addictive (in a good way). Reward consistency, celebrate achievements, and create healthy competition through future leaderboards.

## Core Philosophy
> **Progress should feel rewarding.**
> 
> Every action earns something. Every milestone is celebrated. Every streak matters.

## Scope
- XP system with levels
- Achievement badges
- Daily/weekly challenges
- Streak rewards
- Future: Speed boards (fastest completions)
- Future: Leaderboards (top learners)
- Future: Social challenges

## XP System

### Earning XP
| Action | Base XP | Bonus |
|--------|---------|-------|
| Complete exercise | 50 | +5 per 10% score |
| Attempt exercise | 10 | - |
| Perfect score | 50 | 100 bonus |
| First completion | 50 | 25 bonus |
| Daily streak (7+) | - | 50 bonus |
| Master primitive | - | 250 bonus |

### Level Thresholds
| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Novice |
| 2 | 500 | Learner |
| 3 | 1,000 | Practitioner |
| 4 | 2,000 | Developer |
| 5 | 3,500 | Skilled |
| 6 | 5,500 | Advanced |
| 7 | 8,000 | Expert |
| 8 | 11,000 | Master |
| 9 | 15,000 | Grandmaster |
| 10 | 20,000 | Legend |

## Achievements

### Completion Badges
- 🎯 **First Steps** - Complete first exercise
- 🔥 **On Fire** - 5 exercises in one day
- 🚀 **Speed Run** - 10 exercises in one day
- 🏆 **Completionist** - All exercises in a primitive
- 👑 **Master** - Level 5 mastery on any primitive
- 🌟 **Polyglot** - Exercise in 3+ languages
- 💎 **Perfectionist** - 5 perfect scores in a row

### Streak Badges
- 📆 **Week Warrior** - 7 day streak
- 🗓️ **Monthly Master** - 30 day streak
- 📅 **Century Club** - 100 day streak

### Mastery Badges
- 📚 **Scholar** - Master 3 primitives
- 🎓 **Professor** - Master 6 primitives
- 🧙 **Wizard** - Master 10 primitives

### Special Badges
- 🌅 **Early Bird** - Practice before 7am
- 🦉 **Night Owl** - Practice after midnight
- 💪 **Comeback Kid** - Return after 7+ day break
- 🎭 **Versatile** - Practice in all categories

## Future: Speed Boards

Track fastest completion times:
- Per exercise
- Per primitive (all exercises)
- Per category
- Overall speedrun

### Speed Tiers
| Tier | Requirement |
|------|-------------|
| 🥉 Bronze | Top 50% |
| 🥈 Silver | Top 25% |
| 🥇 Gold | Top 10% |
| 💎 Diamond | Top 1% |

## Future: Leaderboards

### Types
- **Weekly** - Reset every Monday
- **Monthly** - Reset on 1st
- **All-Time** - Permanent rankings

### Categories
- Most XP earned
- Highest accuracy
- Longest streak
- Most primitives mastered
- Speed champions

## Data Structure

### Achievement
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'streak' | 'mastery' | 'special';
  requirement: {
    type: string;
    value: number;
  };
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
```

### UserAchievement
```typescript
{
  achievementId: string;
  unlockedAt: string;
  progress: number;      // 0-100
  isUnlocked: boolean;
}
```

## Current Status
- [x] Data model defined
- [x] Achievement catalog
- [x] XP calculation
- [x] Level system
- [x] Achievement tracking store
- [x] Badge display components
- [ ] Speed tracking
- [ ] Leaderboard backend
- [ ] Social features

## ✅ PILOT COMPLETE (Core Features)
