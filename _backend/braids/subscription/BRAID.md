# Subscription Braid

## Purpose
Manages all subscription tiers, payment processing, and premium access control. This braid handles the monetization model that sustains ProgramPrimitives.com.

## Scope
- Subscription tier definitions
- Payment processing (Stripe integration)
- Access control for premium content
- Billing management
- Invoice generation
- Subscription lifecycle (trials, upgrades, cancellations)
- Usage metering for tiered limits

## Subscription Tiers
```
FREE TIER
├── Access to fundamental primitives (Variables, Operators, Basic Loops)
├── 3 exercises per primitive
├── 1 language (JavaScript)
├── Basic progress tracking
├── Community forums access
└── Ads displayed

LEARNER TIER ($9/month or $79/year)
├── All primitives unlocked
├── Unlimited exercises
├── 3 languages (Python, JavaScript, Go)
├── Full progress tracking
├── Email support
├── No ads
└── Downloadable certificates

PRO TIER ($19/month or $159/year)
├── Everything in Learner
├── All 7+ languages
├── Advanced primitives (concurrency, etc.)
├── AI-powered code review
├── Priority support
├── Team/classroom features
├── API access
└── Custom learning paths

TEAM TIER ($15/user/month)
├── Everything in Pro
├── Admin dashboard
├── Team progress analytics
├── Custom branding
├── SSO integration
├── Dedicated support
└── Bulk licensing
```

## Dependencies
- **External**: 
  - Stripe (payment processing)
  - Email service (receipts, notifications)
- **Internal**: 
  - Authentication Braid (user identity)
  - Primitives Braid (content gating)
  - Exercises Braid (usage metering)

## Current Status
- [ ] Persistence Layer
- [ ] Data Access Layer
- [ ] Business Logic Layer
- [ ] Application Layer
- [ ] Frontend Integration
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **tier-management** - Subscription tier definitions and rules
2. **payment-processing** - Stripe integration and webhooks
3. **access-control** - Feature gating based on tier
4. **billing-portal** - Self-service billing management
5. **usage-metering** - Track limits for free tier

## Payment Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│  Checkout   │────▶│   Stripe    │
│   Selects   │     │   Session   │     │   Payment   │
│   Plan      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                    ┌─────────────┐            │
                    │  Update     │◀───────────┘
                    │  User Tier  │   Webhook
                    │             │
                    └─────────────┘
```

## Data Model
```
Subscription
├── id
├── user_id
├── tier (free/learner/pro/team)
├── status (active/canceled/past_due/trialing)
├── stripe_subscription_id
├── stripe_customer_id
├── current_period_start
├── current_period_end
├── cancel_at_period_end
├── created_at
└── updated_at

PaymentHistory
├── id
├── user_id
├── stripe_payment_id
├── amount
├── currency
├── status
├── receipt_url
└── created_at

UsageRecord
├── user_id
├── date
├── exercises_run
├── languages_used[]
└── primitives_accessed[]
```

## API Endpoints (Planned)
```
GET    /api/subscription                  - Current subscription info
GET    /api/subscription/tiers            - Available tiers
POST   /api/subscription/checkout         - Create checkout session
POST   /api/subscription/portal           - Billing portal session
POST   /api/subscription/webhook          - Stripe webhook handler
GET    /api/subscription/usage            - Current usage stats
POST   /api/subscription/cancel           - Cancel subscription
```

