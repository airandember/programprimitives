# Subscription Braid (Frontend)

## Purpose
Handles all subscription-related UI including pricing display, checkout flow, and billing management.

## Scope
- Pricing page
- Tier comparison
- Checkout flow
- Billing portal access
- Usage display (for free tier limits)
- Upgrade prompts
- Subscription status display

## Dependencies
- **External**: Stripe.js (for checkout)
- **Internal (Backend)**: Subscription Braid API
- **Internal (Frontend)**: Authentication Braid (user state)

## Current Status
- [ ] Presentation Layer
- [ ] Application Layer
- [ ] Testing
- [ ] Documentation

## Related Strands
1. **pricing-page** - Tier comparison and selection
2. **checkout-flow** - Stripe checkout integration
3. **billing-portal** - Self-service billing
4. **upgrade-prompts** - Contextual upgrade CTAs
5. **usage-display** - Show limits and usage

## Pages & Routes
```
/pricing              - Pricing page
/checkout/:tier       - Checkout flow
/account/billing      - Billing management
/account/subscription - Subscription details
```

## Components
```
src/lib/components/subscription/
├── PricingTable.svelte      - Tier comparison table
├── PricingCard.svelte       - Individual tier card
├── CheckoutButton.svelte    - Stripe checkout trigger
├── BillingPortal.svelte     - Portal link/iframe
├── CurrentPlan.svelte       - Show current subscription
├── UsageBar.svelte          - Usage limits indicator
├── UpgradePrompt.svelte     - Contextual upgrade CTA
├── FeatureGate.svelte       - Locks premium features
└── PlanBadge.svelte         - User's plan badge
```

## State Management
```typescript
// src/lib/stores/subscription.ts
export const subscription = writable<Subscription | null>(null);
export const usage = writable<Usage | null>(null);

// Derived
export const currentTier = derived(subscription, ...);
export const isPremium = derived(subscription, ...);
export const canAccessFeature = (feature: string) => derived(...);

// Actions
export async function createCheckout(tier: string): Promise<void>;
export async function openBillingPortal(): Promise<void>;
```

## UI/UX Guidelines
- Clear tier differentiation
- Annual discount prominently shown
- Feature checkmarks/X marks
- "Most Popular" badge on recommended tier
- Smooth checkout transition
- Loading states during payment
- Success/failure feedback
- No-pressure free tier messaging

