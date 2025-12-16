# Gamification Braid (Frontend)

## Purpose
Displays achievements, badges, XP, leaderboards, and challenges. Creates engagement through game-like elements.

## Scope
- Achievement showcase
- XP bar and leveling display
- Leaderboard views
- Challenge participation UI
- Badge collection
- Unlock notifications
- Profile achievements display

## Dependencies
- **External**: Animation library (GSAP or Framer Motion)
- **Internal (Backend)**: Gamification Braid API
- **Internal (Frontend)**: Progress Braid (triggers)

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **achievements-page** - Full achievement gallery
2. **xp-display** - XP bar and level indicator
3. **leaderboard-page** - Rankings display
4. **challenges-page** - Active challenges
5. **unlock-notifications** - Achievement popups

## Pages & Routes
```
/achievements            - Achievement gallery
/leaderboard            - Global leaderboard
/leaderboard/:period    - Filtered leaderboard
/challenges             - Active challenges
/challenges/:id         - Challenge detail
/profile/:user/badges   - User's badge collection
```

## Components
```
src/lib/components/gamification/
├── XPBar.svelte              - Experience bar
├── LevelBadge.svelte         - Current level display
├── AchievementCard.svelte    - Single achievement
├── AchievementGrid.svelte    - Achievement collection
├── BadgeShowcase.svelte      - Earned badges display
├── LeaderboardTable.svelte   - Rankings table
├── LeaderboardFilters.svelte - Period/category filters
├── ChallengeCard.svelte      - Challenge preview
├── ChallengeDetail.svelte    - Full challenge view
├── UnlockToast.svelte        - Achievement unlock popup
├── LevelUpModal.svelte       - Level up celebration
└── StreakFlame.svelte        - Animated streak icon
```

## State Management
```typescript
// src/lib/stores/gamification.ts
export const achievements = writable<Achievement[]>([]);
export const userAchievements = writable<UserAchievement[]>([]);
export const xp = writable<XPInfo | null>(null);
export const leaderboard = writable<LeaderboardEntry[]>([]);
export const challenges = writable<Challenge[]>([]);
export const pendingUnlocks = writable<Achievement[]>([]);

// Derived
export const unlockedAchievements = derived(...);
export const lockedAchievements = derived(...);
export const userRank = derived(...);
export const xpProgress = derived(...);
```

## Animations & Effects
```
ACHIEVEMENT UNLOCK
├── Toast slides in from top
├── Badge icon scales up with bounce
├── Particles/confetti effect
├── Sound effect (optional, user pref)
└── Auto-dismiss after 5 seconds

LEVEL UP
├── Full-screen modal
├── Number counter animation
├── New level badge reveal
├── XP bar fill animation
└── Share button

XP GAIN
├── Floating +XP indicator
├── Bar fill animation
├── Pulse effect on level badge
└── Sound effect (optional)
```

## UI/UX Guidelines
- Achievements show locked/unlocked states clearly
- Rarity indicators (common, rare, epic, legendary colors)
- Progress bars for partial achievements
- Leaderboard with "You" row highlighted
- Time-remaining countdown for challenges
- Satisfying animations on all unlocks
- Achievement sharing to social media
- Mobile-optimized touch interactions

