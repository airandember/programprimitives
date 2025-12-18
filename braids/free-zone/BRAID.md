# FREE-ZONE Braid

## Purpose
The conversion funnel - allow visitors to try exercises without signing up, then prompt them to subscribe after exhausting free attempts.

## Scope
- Free exercise attempts (limited quantity)
- localStorage tracking of attempts
- Sign-up prompts after limit reached
- Seamless transition to authenticated experience
- Preview of premium features

## User Journey
1. **Discovery**: User lands on homepage, sees "Try Free" CTA
2. **First Try**: Complete first exercise, see success + "X tries remaining"
3. **Engagement**: Complete more exercises, see prompts to sign up
4. **Conversion**: After limit, soft-block with sign-up modal
5. **Upgrade**: After sign-up, full access unlocked

## Configuration
```typescript
const FREE_ZONE_CONFIG = {
  maxFreeExercises: 3,        // Total free exercises allowed
  maxHintsPerExercise: 1,     // Hints allowed in free mode
  showSignupAfter: 1,         // Show prompt after N completions
  premiumPreviewCount: 2,     // Preview premium exercises (locked)
};
```

## Strands
1. **tracking** - localStorage attempt tracking
2. **prompts** - Sign-up prompts and modals
3. **try-routes** - `/try/*` routes for anonymous users
4. **migration** - Transfer progress after sign-up

## Routes
| Route | Description |
|-------|-------------|
| `/try` | Free zone landing page |
| `/try/:primitive` | Free primitive info |
| `/try/:primitive/:exercise` | Free exercise workspace |

## Data Structure (localStorage)

```typescript
interface FreeZoneState {
  exercisesCompleted: string[];  // Exercise IDs completed
  exercisesStarted: string[];    // Exercise IDs started
  hintsUsed: number;             // Total hints used
  firstVisit: string;            // ISO timestamp
  lastVisit: string;             // ISO timestamp
  signupPromptsSeen: number;     // How many times prompted
  signupDismissedAt?: string;    // When they dismissed
}
```

## Current Status
- [x] Data model defined
- [x] localStorage store
- [x] Try routes
- [x] Sign-up prompts
- [x] Remaining attempts display
- [ ] Progress migration after signup
- [ ] Analytics tracking

## ✅ PILOT COMPLETE
