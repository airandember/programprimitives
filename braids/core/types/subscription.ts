// ============================================
// Subscription Types
// ============================================

/**
 * Subscription tiers
 */
export type SubscriptionTier = 'free' | 'learner' | 'pro' | 'team';

/**
 * Subscription status
 */
export type SubscriptionStatus = 
	| 'active'
	| 'trialing'
	| 'past_due'
	| 'canceled'
	| 'incomplete';

/**
 * Tier feature limits
 */
export interface TierLimits {
	primitives: 'basic' | 'all';
	languages: number;
	exercisesPerDay: number | 'unlimited';
	codeReview: boolean;
	prioritySupport: boolean;
	teamFeatures: boolean;
	apiAccess: boolean;
}

/**
 * Tier definition
 */
export interface TierInfo {
	id: SubscriptionTier;
	name: string;
	description: string;
	
	// Pricing
	priceMonthly: number;           // In cents
	priceYearly: number;            // In cents
	
	// Features
	limits: TierLimits;
	features: string[];             // Feature bullet points
	
	// Display
	isPopular: boolean;
	badge?: string;
}

/**
 * All tier definitions
 */
export const Tiers: Record<SubscriptionTier, TierInfo> = {
	free: {
		id: 'free',
		name: 'Free',
		description: 'Get started with the basics',
		priceMonthly: 0,
		priceYearly: 0,
		limits: {
			primitives: 'basic',
			languages: 1,
			exercisesPerDay: 5,
			codeReview: false,
			prioritySupport: false,
			teamFeatures: false,
			apiAccess: false,
		},
		features: [
			'Basic primitives (Variables, Operators, Loops)',
			'JavaScript only',
			'5 exercises per day',
			'Basic progress tracking',
			'Community forums',
		],
		isPopular: false,
	},
	learner: {
		id: 'learner',
		name: 'Learner',
		description: 'Unlock your full potential',
		priceMonthly: 900,           // $9
		priceYearly: 7900,           // $79
		limits: {
			primitives: 'all',
			languages: 3,
			exercisesPerDay: 'unlimited',
			codeReview: false,
			prioritySupport: false,
			teamFeatures: false,
			apiAccess: false,
		},
		features: [
			'All primitives',
			'Python, JavaScript, Go',
			'Unlimited exercises',
			'Full progress tracking',
			'Email support',
			'No ads',
			'Certificates',
		],
		isPopular: true,
		badge: 'Most Popular',
	},
	pro: {
		id: 'pro',
		name: 'Pro',
		description: 'For serious developers',
		priceMonthly: 1900,          // $19
		priceYearly: 15900,          // $159
		limits: {
			primitives: 'all',
			languages: 7,
			exercisesPerDay: 'unlimited',
			codeReview: true,
			prioritySupport: true,
			teamFeatures: false,
			apiAccess: true,
		},
		features: [
			'Everything in Learner',
			'All 7+ languages',
			'Advanced primitives',
			'AI-powered code review',
			'Priority support',
			'API access',
			'Custom learning paths',
		],
		isPopular: false,
	},
	team: {
		id: 'team',
		name: 'Team',
		description: 'For teams and classrooms',
		priceMonthly: 1500,          // $15/user
		priceYearly: 14400,          // $144/user
		limits: {
			primitives: 'all',
			languages: 7,
			exercisesPerDay: 'unlimited',
			codeReview: true,
			prioritySupport: true,
			teamFeatures: true,
			apiAccess: true,
		},
		features: [
			'Everything in Pro',
			'Admin dashboard',
			'Team analytics',
			'Custom branding',
			'SSO integration',
			'Dedicated support',
			'Bulk licensing',
		],
		isPopular: false,
	},
};

/**
 * User subscription
 */
export interface Subscription {
	id: string;
	userId: string;
	tier: SubscriptionTier;
	status: SubscriptionStatus;
	
	// Stripe
	stripeSubscriptionId?: string;
	stripeCustomerId?: string;
	
	// Billing period
	currentPeriodStart: string;
	currentPeriodEnd: string;
	cancelAtPeriodEnd: boolean;
	
	// Timestamps
	createdAt: string;
	updatedAt: string;
}

/**
 * Payment history entry
 */
export interface PaymentRecord {
	id: string;
	userId: string;
	stripePaymentId: string;
	
	amount: number;                 // In cents
	currency: string;
	status: 'succeeded' | 'failed' | 'refunded';
	receiptUrl?: string;
	
	createdAt: string;
}

/**
 * Usage for free tier limits
 */
export interface UsageRecord {
	userId: string;
	date: string;
	
	exercisesRun: number;
	languagesUsed: string[];
	primitivesAccessed: string[];
}

// ============================================
// Checkout Types
// ============================================

export interface CheckoutRequest {
	tier: SubscriptionTier;
	interval: 'month' | 'year';
	successUrl: string;
	cancelUrl: string;
}

export interface CheckoutResponse {
	checkoutUrl: string;
	sessionId: string;
}

export interface PortalResponse {
	portalUrl: string;
}

