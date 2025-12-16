# Progress Braid (Frontend)

## Purpose
Displays user learning progress, statistics, and achievements. Provides motivation through visualizations of growth and mastery.

## Scope
- Dashboard with progress overview
- Mastery visualization per primitive
- Streak display and calendar
- Activity history
- Learning statistics
- Skill radar charts
- Time spent tracking

## Dependencies
- **External**: Chart library (Chart.js or D3)
- **Internal (Backend)**: Progress Braid API
- **Internal (Frontend)**: Gamification Braid (achievements display)

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **dashboard** - Main progress overview
2. **mastery-map** - Visual primitive mastery
3. **streak-calendar** - Activity calendar
4. **statistics** - Learning metrics
5. **activity-feed** - Recent activity

## Pages & Routes
```
/dashboard              - Main progress dashboard
/dashboard/primitives   - Detailed primitive progress
/dashboard/activity     - Activity history
/dashboard/stats        - Detailed statistics
```

## Components
```
src/lib/components/progress/
├── Dashboard.svelte          - Main dashboard layout
├── ProgressOverview.svelte   - Summary cards
├── MasteryMap.svelte         - Primitive mastery grid
├── StreakCalendar.svelte     - GitHub-style calendar
├── StreakCounter.svelte      - Current streak display
├── SkillRadar.svelte         - Radar chart of skills
├── ActivityFeed.svelte       - Recent activity list
├── TimeStats.svelte          - Time spent metrics
├── LanguageBreakdown.svelte  - Usage per language
└── ProgressChart.svelte      - Progress over time
```

## State Management
```typescript
// src/lib/stores/progress.ts
export const userProgress = writable<UserProgress | null>(null);
export const masteryLevels = writable<MasteryLevel[]>([]);
export const streakInfo = writable<StreakInfo | null>(null);
export const activityHistory = writable<Activity[]>([]);
export const statistics = writable<Stats | null>(null);

// Derived
export const currentStreak = derived(streakInfo, ...);
export const masteryPercentage = derived(masteryLevels, ...);
```

## Visualizations
```
MASTERY MAP
┌─────┬─────┬─────┬─────┬─────┐
│ ███ │ ██░ │ █░░ │ ░░░ │ ███ │  Variables
├─────┼─────┼─────┼─────┼─────┤
│ ██░ │ ███ │ ██░ │ █░░ │ ██░ │  Loops
├─────┼─────┼─────┼─────┼─────┤
│ █░░ │ ██░ │ ░░░ │ ░░░ │ █░░ │  Functions
└─────┴─────┴─────┴─────┴─────┘
  JS    Py    Go    C++   TS

STREAK CALENDAR (GitHub-style)
┌─┬─┬─┬─┬─┬─┬─┐
│░│░│█│█│█│░│░│ This week
├─┼─┼─┼─┼─┼─┼─┤
│█│█│█│█│░│█│█│ Last week
└─┴─┴─┴─┴─┴─┴─┘

SKILL RADAR
        Loops
          ▲
         /|\
        / | \
Arrays ◀──┼──▶ Functions
        \ | /
         \|/
          ▼
      Conditionals
```

## UI/UX Guidelines
- Celebration animations on milestones
- Color-coded mastery levels
- Interactive hover states on charts
- Mobile-first responsive design
- Exportable/shareable progress cards
- Weekly email digest option
- Goal setting interface

