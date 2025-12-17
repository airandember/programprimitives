# FREE-ZONE Braid

## Purpose
Provides a standalone, no-auth-required experience where anyone can try the platform. After completing each exercise, users are prompted to sign up. This is our primary conversion funnel.

## Scope
- Standalone try-it-now experience
- No authentication required
- Limited curated content (3-5 primitives)
- Full exercise experience (editor, run, submit)
- Post-completion signup prompts
- Local progress tracking (localStorage)
- Conversion analytics

## Dependencies
- **External**: None (intentionally minimal)
- **Internal**: 
  - core (types, shared components)
  - sandbox (code execution)

## Current Status
- [ ] Route structure (`/try`)
- [ ] Curated primitive selection
- [ ] Exercise workspace (reused)
- [ ] Signup prompt modal
- [ ] Local progress storage
- [ ] Conversion tracking
- [ ] A/B test variants

## Strands

### 1. landing
Entry point for free zone
- Hero with "Try Now" CTA
- Preview of available content
- No signup wall

### 2. exercises
Curated exercise experience
- Full workspace (same as paid)
- Limited primitive set
- Limited exercises per primitive

### 3. prompts
Conversion prompts
- After exercise completion
- Show what they'd unlock
- Social proof (user count, testimonials)
- Clear value proposition

### 4. tracking
Conversion analytics
- Track funnel steps
- A/B test variants
- Completion rates
- Signup conversion

## Route Structure

```
/try                      - Free zone landing
/try/:primitive           - Primitive preview
/try/:primitive/:exercise - Exercise workspace
```

## Free Zone Content (Curated)

### Available Primitives
| Primitive | Exercises | Why Included |
|-----------|-----------|--------------|
| Variables | 2 | Foundation, easy win |
| For Loop | 2 | Core primitive, satisfying |
| Conditionals | 2 | Decision logic |

### Exercise Selection Criteria
1. **Quick wins** - Completable in 5-10 min
2. **Satisfying** - Clear "aha!" moment
3. **Representative** - Shows platform quality
4. **Progressive** - Easy → Medium difficulty

## Signup Prompt Modal

```
┌─────────────────────────────────────────────────────────────┐
│                         🎉                                  │
│              Nice work! You just completed                  │
│                  "Print Numbers 1-10"                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  You've mastered 1 exercise.                        │   │
│  │  Unlock 200+ more to become a coding expert!        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  What you'll get:                                           │
│  ✓ 50+ programming primitives                              │
│  ✓ 7 programming languages                                 │
│  ✓ Progress tracking & streaks                             │
│  ✓ Achievements & leaderboards                             │
│  ✓ Certificates of completion                              │
│                                                             │
│  ┌───────────────────┐  ┌───────────────────┐              │
│  │  Create Account   │  │  Try Another      │              │
│  │  (FREE)           │  │  Exercise         │              │
│  └───────────────────┘  └───────────────────┘              │
│                                                             │
│  Already have an account? Log in                           │
└─────────────────────────────────────────────────────────────┘
```

## Local Storage Schema

```typescript
interface FreeZoneProgress {
    completedExercises: string[];
    currentStreak: number;
    lastVisit: string;
    promptsShown: number;
    dismissedAt?: string;
}

// Key: 'pp_free_zone'
```

## Conversion Funnel

```
Landing Page
    │
    ▼
/try (Free Zone Landing)
    │
    ▼
Select Primitive
    │
    ▼
Start Exercise
    │
    ▼
Complete Exercise ───────────► Signup Prompt
    │                               │
    │                               ▼
    │                         [Create Account]
    │                               │
    ▼                               ▼
Try Another ◄──────────────── /register
    │
    ▼
(max 3-5 exercises)
    │
    ▼
Soft Gate: "You've completed all free exercises!"
    │
    ▼
[Create Account to Continue]
```

## Analytics Events

```typescript
// Track these events
'free_zone_visit'           // Landed on /try
'free_zone_primitive_view'  // Viewed a primitive
'free_zone_exercise_start'  // Started an exercise
'free_zone_exercise_complete' // Completed exercise
'free_zone_prompt_shown'    // Signup prompt displayed
'free_zone_prompt_dismiss'  // Dismissed prompt
'free_zone_signup_click'    // Clicked signup CTA
'free_zone_gate_reached'    // Hit the limit
```

## Implementation Notes

### Reuse Components
- Exercise workspace from `exercises` braid
- Code editor (Monaco)
- Test result display
- Primitive content display

### Differences from Main App
- No auth check
- No progress sync to server
- Limited content
- Prompt after each completion
- No XP/achievements

### A/B Test Ideas
1. Prompt timing (after 1st vs 2nd exercise)
2. CTA copy ("Create Account" vs "Start Learning")
3. Value prop emphasis (features vs social proof)
4. Modal vs inline prompt

