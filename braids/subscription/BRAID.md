# SUBSCRIPTION Braid

## Purpose
Payment-agnostic subscription system that controls access to premium features. Designed to work with any payment processor (Stripe, Paddle, LemonSqueezy, etc.).

## Core Philosophy
> **Flexible billing, strict access control.**
> 
> The subscription system is decoupled from payment providers. Switch processors without changing access logic.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 SUBSCRIPTION SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   TIERS      │    │   ACCESS     │    │   BILLING    │  │
│  │   Free       │    │   Control    │    │   Provider   │  │
│  │   Premium    │    │   Middleware │    │   Interface  │  │
│  │   Pro        │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                              │                    │         │
│                              ▼                    ▼         │
│                      ┌──────────────────────────────┐      │
│                      │     Payment Providers        │      │
│                      │  Stripe │ Paddle │ Lemon...  │      │
│                      └──────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Subscription Tiers

### Free Tier
- ✅ 3 free exercises (via free-zone)
- ✅ Access to 5 primitives
- ✅ JavaScript only
- ❌ No progress tracking (localStorage only)
- ❌ No achievements
- ❌ Limited hints

### Premium Tier ($9/month or $79/year)
- ✅ Unlimited exercises
- ✅ All 13+ primitives
- ✅ JavaScript + Python + Go
- ✅ Full progress tracking
- ✅ All achievements
- ✅ Unlimited hints
- ✅ Priority support
- ❌ No speed boards

### Pro Tier ($19/month or $159/year)
- ✅ Everything in Premium
- ✅ All 7+ languages
- ✅ Speed boards access
- ✅ Leaderboard participation
- ✅ AI-powered feedback
- ✅ Early access to new primitives
- ✅ Team features (future)

## Feature Gating

```typescript
const TIER_FEATURES: Record<Tier, TierFeatures> = {
  free: {
    maxExercises: 3,
    maxPrimitives: 5,
    languages: ['javascript'],
    progressTracking: false,
    achievements: false,
    hintsPerExercise: 1,
    speedBoards: false,
    leaderboards: false,
    aiFeedback: false,
  },
  premium: {
    maxExercises: Infinity,
    maxPrimitives: Infinity,
    languages: ['javascript', 'python', 'go'],
    progressTracking: true,
    achievements: true,
    hintsPerExercise: Infinity,
    speedBoards: false,
    leaderboards: false,
    aiFeedback: false,
  },
  pro: {
    maxExercises: Infinity,
    maxPrimitives: Infinity,
    languages: ['javascript', 'python', 'go', 'typescript', 'rust', 'java', 'csharp'],
    progressTracking: true,
    achievements: true,
    hintsPerExercise: Infinity,
    speedBoards: true,
    leaderboards: true,
    aiFeedback: true,
  },
};
```

## Payment Provider Interface

```typescript
interface PaymentProvider {
  name: string;
  
  // Checkout
  createCheckoutSession(params: CheckoutParams): Promise<CheckoutSession>;
  
  // Subscription management
  getSubscription(subscriptionId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  resumeSubscription(subscriptionId: string): Promise<void>;
  
  // Webhooks
  verifyWebhook(payload: string, signature: string): boolean;
  handleWebhook(event: WebhookEvent): Promise<void>;
  
  // Customer portal
  createPortalSession(customerId: string): Promise<PortalSession>;
}
```

## Supported Providers (Planned)

| Provider | Status | Notes |
|----------|--------|-------|
| **Mock** | ✅ Ready | For development/testing |
| Stripe | 📋 Planned | Most popular |
| Paddle | 📋 Planned | EU-friendly, handles tax |
| LemonSqueezy | 📋 Planned | Simple, indie-friendly |
| Gumroad | 📋 Planned | Creator-focused |

## Data Model

### UserSubscription
```typescript
interface UserSubscription {
  id: string;
  userId: string;
  
  // Tier info
  tier: 'free' | 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  
  // Billing cycle
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  
  // Provider info (flexible)
  provider: string;              // 'stripe' | 'paddle' | etc
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
}
```

### BillingEvent
```typescript
interface BillingEvent {
  id: string;
  userId: string;
  
  type: 'payment_succeeded' | 'payment_failed' | 'subscription_created' | 
        'subscription_updated' | 'subscription_cancelled';
  
  provider: string;
  providerEventId: string;
  
  amount?: number;
  currency?: string;
  
  metadata: Record<string, unknown>;
  createdAt: string;
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/subscription` | Get current subscription |
| `POST` | `/api/subscription/checkout` | Create checkout session |
| `POST` | `/api/subscription/cancel` | Cancel subscription |
| `POST` | `/api/subscription/resume` | Resume cancelled subscription |
| `GET` | `/api/subscription/portal` | Get billing portal URL |
| `POST` | `/api/webhooks/:provider` | Handle provider webhooks |

## Access Control Middleware

```typescript
// Check if user can access a feature
function canAccess(user: User, feature: Feature): boolean {
  const tier = user.subscription?.tier || 'free';
  const features = TIER_FEATURES[tier];
  
  switch (feature) {
    case 'exercise':
      return features.maxExercises > user.exercisesAccessed;
    case 'primitive':
      return features.maxPrimitives > user.primitivesAccessed;
    case 'language':
      return features.languages.includes(requestedLanguage);
    case 'speedBoards':
      return features.speedBoards;
    // etc
  }
}

// Middleware
function requireTier(minTier: Tier) {
  return (req, res, next) => {
    const userTier = req.user?.subscription?.tier || 'free';
    if (tierRank(userTier) >= tierRank(minTier)) {
      next();
    } else {
      res.status(403).json({ 
        error: 'Upgrade required',
        requiredTier: minTier,
        currentTier: userTier,
      });
    }
  };
}
```

## Frontend Integration

### Upgrade Prompts
Show contextual upgrade prompts when users hit limits:
- "Unlock all primitives with Premium"
- "Practice in Python with Premium"
- "Join the leaderboard with Pro"

### Pricing Page
- Clear tier comparison
- Monthly/yearly toggle (save 30% yearly)
- FAQ section
- Money-back guarantee

### Subscription Management
- View current plan
- Upgrade/downgrade
- Cancel/resume
- Billing history
- Update payment method (via provider portal)

## Current Status
- [x] Tier definitions
- [x] Feature gating logic
- [x] Frontend subscription store
- [x] Access control helpers
- [x] Pricing page UI
- [x] Upgrade prompts
- [ ] Backend webhook handlers
- [ ] Stripe integration
- [ ] Paddle integration

## ✅ PILOT COMPLETE (Frontend + Mock Provider)
