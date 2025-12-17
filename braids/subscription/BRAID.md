# SUBSCRIPTION Braid

## Purpose
Handles monetization through subscription tiers, payment processing, and feature access control. Integrates with Stripe for payment handling.

## Scope
- Subscription tier definitions
- Stripe checkout integration
- Customer portal
- Webhook handling
- Feature gating
- Usage tracking (free tier limits)

## Dependencies
- **External**: 
  - Stripe (payments)
  - Stripe CLI (webhook testing)
- **Internal**: 
  - core (types)
  - auth (user context)

## Current Status
- [ ] Tier definitions
- [ ] Stripe integration
- [ ] Checkout flow
- [ ] Customer portal
- [ ] Webhook handling
- [ ] Feature gating middleware
- [ ] Usage tracking
- [ ] Frontend pricing page
- [ ] Account settings

## Strands

### 1. tiers
Subscription tier management
- Define tier features
- Price configuration
- Limit definitions

### 2. checkout
Payment flow
- Create checkout session
- Handle success/cancel
- Apply subscription

### 3. portal
Customer self-service
- View invoices
- Update payment method
- Cancel subscription
- Change plan

### 4. access
Feature gating
- Check tier on protected routes
- Enforce daily limits
- Premium content access

### 5. usage
Free tier tracking
- Count daily exercises
- Track language usage
- Show limit warnings

## API Endpoints

```
GET    /api/subscription                - Current subscription
GET    /api/subscription/tiers          - Available tiers
POST   /api/subscription/checkout       - Create checkout
POST   /api/subscription/portal         - Create portal session
POST   /api/subscription/webhook        - Stripe webhook
GET    /api/subscription/usage          - Usage stats
POST   /api/subscription/cancel         - Cancel subscription
```

## Database Schema

### subscriptions
```sql
CREATE TABLE subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### payment_history
```sql
CREATE TABLE payment_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    stripe_payment_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    receipt_url TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### usage_records
```sql
CREATE TABLE usage_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    exercises_run INTEGER DEFAULT 0,
    languages_used TEXT,           -- JSON array
    primitives_accessed TEXT,      -- JSON array
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
);
```

## Stripe Integration

### Environment Variables
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_LEARNER_MONTHLY=price_...
STRIPE_PRICE_LEARNER_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
```

### Checkout Flow
```
User clicks "Upgrade"
        │
        ▼
┌───────────────┐
│ POST /checkout│
│               │
│ - Create      │
│   Stripe      │
│   Session     │
└───────┬───────┘
        │
        ▼
Redirect to Stripe Checkout
        │
        ▼
User completes payment
        │
        ▼
┌───────────────┐
│ Stripe sends  │
│ webhook       │
│               │
│ checkout.     │
│ session.      │
│ completed     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Update user   │
│ subscription  │
│ tier          │
└───────────────┘
```

## Feature Gating

### Middleware Example
```typescript
async function requireTier(requiredTier: SubscriptionTier) {
    return async (ctx: Context, next: Next) => {
        const user = ctx.get('user');
        const userTier = user?.subscriptionTier || 'free';
        
        const tierRank = { free: 0, learner: 1, pro: 2, team: 3 };
        
        if (tierRank[userTier] < tierRank[requiredTier]) {
            return ctx.json({
                success: false,
                error: { code: 'TIER_REQUIRED', message: `Requires ${requiredTier} tier` }
            }, 403);
        }
        
        return next();
    };
}
```

### Usage Check (Free Tier)
```typescript
async function checkDailyLimit(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const usage = await getUsage(userId, today);
    
    const user = await getUser(userId);
    const limit = Tiers[user.subscriptionTier].limits.exercisesPerDay;
    
    if (limit === 'unlimited') return true;
    return usage.exercisesRun < limit;
}
```

## Pricing Page UI

```
┌─────────────────────────────────────────────────────────────┐
│                Choose Your Plan                              │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    FREE     │  │   LEARNER   │  │     PRO     │         │
│  │             │  │  ★ Popular  │  │             │         │
│  │    $0/mo    │  │   $9/mo     │  │   $19/mo    │         │
│  │             │  │  $79/year   │  │  $159/year  │         │
│  │             │  │             │  │             │         │
│  │ ✓ Basics    │  │ ✓ All      │  │ ✓ Everything│         │
│  │ ✓ 1 lang    │  │ ✓ 3 langs   │  │ ✓ 7 langs   │         │
│  │ ✓ 5/day     │  │ ✓ Unlimited │  │ ✓ AI Review │         │
│  │             │  │ ✓ Certs     │  │ ✓ Priority  │         │
│  │             │  │             │  │ ✓ API       │         │
│  │             │  │             │  │             │         │
│  │ [Current]   │  │ [Upgrade]   │  │ [Upgrade]   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  All plans include: Progress tracking, Achievements, Forum  │
└─────────────────────────────────────────────────────────────┘
```

