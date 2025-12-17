// ============================================
// Free Zone Types
// ============================================

/**
 * Free zone local progress (stored in localStorage)
 */
export interface FreeZoneProgress {
	completedExercises: string[];
	currentStreak: number;
	lastVisit: string;
	promptsShown: number;
	dismissedAt?: string;
}

/**
 * Free zone exercise (curated subset)
 */
export interface FreeZoneExercise {
	id: string;
	primitiveId: string;
	primitiveName: string;
	title: string;
	description: string;
	difficulty: 1 | 2 | 3;
	estimatedMinutes: number;
}

/**
 * Free zone primitive (curated)
 */
export interface FreeZonePrimitive {
	id: string;
	name: string;
	description: string;
	icon: string;
	exercises: FreeZoneExercise[];
}

/**
 * Signup prompt variant (for A/B testing)
 */
export interface SignupPromptVariant {
	id: string;
	title: string;
	subtitle: string;
	benefits: string[];
	primaryCta: string;
	secondaryCta: string;
	showSocialProof: boolean;
}

/**
 * Analytics event for free zone
 */
export interface FreeZoneEvent {
	type: FreeZoneEventType;
	timestamp: string;
	data?: Record<string, unknown>;
}

export type FreeZoneEventType =
	| 'free_zone_visit'
	| 'free_zone_primitive_view'
	| 'free_zone_exercise_start'
	| 'free_zone_exercise_complete'
	| 'free_zone_prompt_shown'
	| 'free_zone_prompt_dismiss'
	| 'free_zone_signup_click'
	| 'free_zone_gate_reached';

// ============================================
// Constants
// ============================================

/**
 * LocalStorage key for free zone progress
 */
export const FREE_ZONE_STORAGE_KEY = 'pp_free_zone';

/**
 * Maximum exercises before hard gate
 */
export const FREE_ZONE_MAX_EXERCISES = 6;

/**
 * Primitives available in free zone
 */
export const FREE_ZONE_PRIMITIVES = ['variables', 'for-loop', 'conditionals'] as const;

/**
 * Default signup prompt
 */
export const DEFAULT_SIGNUP_PROMPT: SignupPromptVariant = {
	id: 'default',
	title: 'Nice work! 🎉',
	subtitle: 'You just completed your first exercise!',
	benefits: [
		'50+ programming primitives',
		'7 programming languages',
		'Progress tracking & streaks',
		'Achievements & leaderboards',
		'Certificates of completion',
	],
	primaryCta: 'Create Free Account',
	secondaryCta: 'Try Another Exercise',
	showSocialProof: true,
};

