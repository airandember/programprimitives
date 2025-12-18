// ============================================
// Subscription Store - Payment-agnostic tier system
// ============================================

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Types
// ============================================

export type SubscriptionTier = 'free' | 'premium' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';
export type BillingCycle = 'monthly' | 'yearly';

export interface TierFeatures {
	maxExercises: number;
	maxPrimitives: number;
	languages: string[];
	progressTracking: boolean;
	achievements: boolean;
	hintsPerExercise: number;
	speedBoards: boolean;
	leaderboards: boolean;
	aiFeedback: boolean;
}

export interface TierPricing {
	monthly: number;
	yearly: number;
	yearlySavings: number;
}

export interface UserSubscription {
	id: string;
	userId: string;
	tier: SubscriptionTier;
	status: SubscriptionStatus;
	billingCycle: BillingCycle;
	currentPeriodStart: string;
	currentPeriodEnd: string;
	provider: string;
	providerCustomerId?: string;
	providerSubscriptionId?: string;
	createdAt: string;
	updatedAt: string;
	cancelledAt?: string;
}

export interface SubscriptionState {
	subscription: UserSubscription | null;
	isLoading: boolean;
	error: string | null;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'pp_subscription';

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
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

export const TIER_PRICING: Record<Exclude<SubscriptionTier, 'free'>, TierPricing> = {
	premium: {
		monthly: 9,
		yearly: 79,
		yearlySavings: 29, // 9*12 - 79 = 29
	},
	pro: {
		monthly: 19,
		yearly: 159,
		yearlySavings: 69, // 19*12 - 159 = 69
	},
};

export const TIER_INFO: Record<SubscriptionTier, {
	name: string;
	description: string;
	badge: string;
	color: string;
	highlights: string[];
}> = {
	free: {
		name: 'Free',
		description: 'Get started with the basics',
		badge: '🆓',
		color: 'surface',
		highlights: [
			'3 free exercises',
			'5 primitives',
			'JavaScript only',
		],
	},
	premium: {
		name: 'Premium',
		description: 'Unlock your full potential',
		badge: '⭐',
		color: 'primary',
		highlights: [
			'Unlimited exercises',
			'All primitives',
			'3 languages (JS, Python, Go)',
			'Progress tracking',
			'All achievements',
			'Unlimited hints',
		],
	},
	pro: {
		name: 'Pro',
		description: 'For serious learners',
		badge: '👑',
		color: 'accent',
		highlights: [
			'Everything in Premium',
			'7+ languages',
			'Speed boards',
			'Leaderboard access',
			'AI-powered feedback',
			'Early access features',
		],
	},
};

// ============================================
// Default State
// ============================================

const defaultSubscription: UserSubscription = {
	id: 'free-default',
	userId: 'guest',
	tier: 'free',
	status: 'active',
	billingCycle: 'monthly',
	currentPeriodStart: new Date().toISOString(),
	currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
	provider: 'none',
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

// Mock premium for demo
const mockPremiumSubscription: UserSubscription = {
	id: 'demo-premium',
	userId: 'demo-user',
	tier: 'premium',
	status: 'active',
	billingCycle: 'yearly',
	currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
	currentPeriodEnd: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
	provider: 'mock',
	providerSubscriptionId: 'mock_sub_123',
	createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
	updatedAt: new Date().toISOString(),
};

const initialState: SubscriptionState = {
	subscription: null,
	isLoading: false,
	error: null,
};

// ============================================
// Storage
// ============================================

function loadSubscription(): SubscriptionState {
	if (!browser) return initialState;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.error('Failed to load subscription:', e);
	}
	
	// Return demo premium for testing
	return {
		subscription: mockPremiumSubscription,
		isLoading: false,
		error: null,
	};
}

function saveSubscription(state: SubscriptionState): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save subscription:', e);
	}
}

// ============================================
// Store
// ============================================

function createSubscriptionStore() {
	const { subscribe, set, update } = writable<SubscriptionState>(loadSubscription());
	
	subscribe(saveSubscription);
	
	return {
		subscribe,
		
		/**
		 * Load subscription from server
		 */
		load: async (userId: string) => {
			update(s => ({ ...s, isLoading: true, error: null }));
			
			try {
				// TODO: Fetch from API
				// const response = await fetch(`/api/subscription?userId=${userId}`);
				// const subscription = await response.json();
				
				// For now, use mock
				await new Promise(r => setTimeout(r, 500));
				
				update(s => ({
					...s,
					subscription: mockPremiumSubscription,
					isLoading: false,
				}));
			} catch (err) {
				update(s => ({
					...s,
					isLoading: false,
					error: err instanceof Error ? err.message : 'Failed to load subscription',
				}));
			}
		},
		
		/**
		 * Start checkout for a tier
		 */
		checkout: async (tier: Exclude<SubscriptionTier, 'free'>, cycle: BillingCycle): Promise<string | null> => {
			update(s => ({ ...s, isLoading: true, error: null }));
			
			try {
				// TODO: Call API to create checkout session
				// const response = await fetch('/api/subscription/checkout', {
				//   method: 'POST',
				//   body: JSON.stringify({ tier, cycle }),
				// });
				// const { checkoutUrl } = await response.json();
				// return checkoutUrl;
				
				// For now, simulate checkout
				await new Promise(r => setTimeout(r, 1000));
				
				// Mock: Directly upgrade (in real app, redirect to payment)
				const newSub: UserSubscription = {
					id: `sub_${Date.now()}`,
					userId: 'demo-user',
					tier,
					status: 'active',
					billingCycle: cycle,
					currentPeriodStart: new Date().toISOString(),
					currentPeriodEnd: new Date(
						Date.now() + (cycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
					).toISOString(),
					provider: 'mock',
					providerSubscriptionId: `mock_sub_${Date.now()}`,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				
				update(s => ({
					...s,
					subscription: newSub,
					isLoading: false,
				}));
				
				return null; // No redirect needed for mock
				
			} catch (err) {
				update(s => ({
					...s,
					isLoading: false,
					error: err instanceof Error ? err.message : 'Checkout failed',
				}));
				return null;
			}
		},
		
		/**
		 * Cancel subscription
		 */
		cancel: async () => {
			update(s => ({ ...s, isLoading: true, error: null }));
			
			try {
				// TODO: Call API
				await new Promise(r => setTimeout(r, 500));
				
				update(s => ({
					...s,
					subscription: s.subscription ? {
						...s.subscription,
						status: 'cancelled',
						cancelledAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					} : null,
					isLoading: false,
				}));
				
			} catch (err) {
				update(s => ({
					...s,
					isLoading: false,
					error: err instanceof Error ? err.message : 'Failed to cancel',
				}));
			}
		},
		
		/**
		 * Resume cancelled subscription
		 */
		resume: async () => {
			update(s => ({ ...s, isLoading: true, error: null }));
			
			try {
				// TODO: Call API
				await new Promise(r => setTimeout(r, 500));
				
				update(s => ({
					...s,
					subscription: s.subscription ? {
						...s.subscription,
						status: 'active',
						cancelledAt: undefined,
						updatedAt: new Date().toISOString(),
					} : null,
					isLoading: false,
				}));
				
			} catch (err) {
				update(s => ({
					...s,
					isLoading: false,
					error: err instanceof Error ? err.message : 'Failed to resume',
				}));
			}
		},
		
		/**
		 * Set to free tier (for testing)
		 */
		setFree: () => {
			set({
				subscription: defaultSubscription,
				isLoading: false,
				error: null,
			});
		},
		
		/**
		 * Reset (for testing)
		 */
		reset: () => {
			set(initialState);
		},
	};
}

export const subscription = createSubscriptionStore();

// ============================================
// Derived Stores
// ============================================

/** Current tier */
export const currentTier = derived(subscription, $s => 
	$s.subscription?.tier || 'free'
);

/** Current tier features */
export const currentFeatures = derived(currentTier, $tier => 
	TIER_FEATURES[$tier]
);

/** Is premium or higher */
export const isPremium = derived(currentTier, $tier => 
	$tier === 'premium' || $tier === 'pro'
);

/** Is pro */
export const isPro = derived(currentTier, $tier => 
	$tier === 'pro'
);

/** Is subscription active */
export const isActive = derived(subscription, $s => 
	$s.subscription?.status === 'active' || $s.subscription?.status === 'trialing'
);

/** Days until renewal */
export const daysUntilRenewal = derived(subscription, $s => {
	if (!$s.subscription) return null;
	const end = new Date($s.subscription.currentPeriodEnd);
	const now = new Date();
	return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
});

// ============================================
// Access Control Helpers
// ============================================

/**
 * Check if user can access a specific language
 */
export function canAccessLanguage(language: string): boolean {
	const features = get(currentFeatures);
	return features.languages.includes(language);
}

/**
 * Check if user can access speed boards
 */
export function canAccessSpeedBoards(): boolean {
	return get(currentFeatures).speedBoards;
}

/**
 * Check if user can access leaderboards
 */
export function canAccessLeaderboards(): boolean {
	return get(currentFeatures).leaderboards;
}

/**
 * Check if user has progress tracking
 */
export function hasProgressTracking(): boolean {
	return get(currentFeatures).progressTracking;
}

/**
 * Get hints allowed per exercise
 */
export function getHintsAllowed(): number {
	return get(currentFeatures).hintsPerExercise;
}

/**
 * Get tier required for a feature
 */
export function getTierForFeature(feature: keyof TierFeatures): SubscriptionTier {
	// Find the lowest tier that has this feature
	if (TIER_FEATURES.free[feature]) return 'free';
	if (TIER_FEATURES.premium[feature]) return 'premium';
	return 'pro';
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: string): string {
	const messages: Record<string, string> = {
		language: 'Unlock more languages with Premium',
		speedBoards: 'Access speed boards with Pro',
		leaderboards: 'Join the leaderboard with Pro',
		aiFeedback: 'Get AI feedback with Pro',
		progressTracking: 'Track your progress with Premium',
		achievements: 'Earn achievements with Premium',
		hints: 'Get unlimited hints with Premium',
	};
	return messages[feature] || 'Upgrade to unlock this feature';
}

