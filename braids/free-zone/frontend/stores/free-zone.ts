// ============================================
// Free Zone Store - Track anonymous user progress
// ============================================

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Configuration
// ============================================

export const FREE_ZONE_CONFIG = {
	maxFreeExercises: 3,        // Total free exercises allowed
	maxHintsPerExercise: 1,     // Hints allowed per exercise in free mode
	showSignupAfter: 1,         // Show signup prompt after N completions
	premiumPreviewCount: 2,     // Show this many premium exercises (locked)
	storageKey: 'pp_free_zone', // localStorage key
};

// ============================================
// Types
// ============================================

export interface FreeZoneState {
	exercisesCompleted: string[];  // Exercise IDs completed
	exercisesStarted: string[];    // Exercise IDs started
	hintsUsed: number;             // Total hints used
	firstVisit: string;            // ISO timestamp
	lastVisit: string;             // ISO timestamp
	signupPromptsSeen: number;     // How many times prompted
	signupDismissedAt?: string;    // When they dismissed
}

// ============================================
// Default State
// ============================================

const defaultState: FreeZoneState = {
	exercisesCompleted: [],
	exercisesStarted: [],
	hintsUsed: 0,
	firstVisit: new Date().toISOString(),
	lastVisit: new Date().toISOString(),
	signupPromptsSeen: 0,
};

// ============================================
// Load/Save from localStorage
// ============================================

function loadState(): FreeZoneState {
	if (!browser) return defaultState;
	
	try {
		const stored = localStorage.getItem(FREE_ZONE_CONFIG.storageKey);
		if (stored) {
			const parsed = JSON.parse(stored) as FreeZoneState;
			// Update last visit
			parsed.lastVisit = new Date().toISOString();
			return parsed;
		}
	} catch (e) {
		console.error('Failed to load free zone state:', e);
	}
	
	return { ...defaultState };
}

function saveState(state: FreeZoneState): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(FREE_ZONE_CONFIG.storageKey, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to save free zone state:', e);
	}
}

// ============================================
// Store
// ============================================

function createFreeZoneStore() {
	const { subscribe, set, update } = writable<FreeZoneState>(loadState());
	
	// Auto-save on changes
	subscribe((state) => {
		saveState(state);
	});
	
	return {
		subscribe,
		set,
		update,
		
		/**
		 * Mark an exercise as started
		 */
		startExercise: (exerciseId: string) => {
			update(state => {
				if (!state.exercisesStarted.includes(exerciseId)) {
					return {
						...state,
						exercisesStarted: [...state.exercisesStarted, exerciseId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Mark an exercise as completed
		 */
		completeExercise: (exerciseId: string) => {
			update(state => {
				if (!state.exercisesCompleted.includes(exerciseId)) {
					return {
						...state,
						exercisesCompleted: [...state.exercisesCompleted, exerciseId],
						lastVisit: new Date().toISOString(),
					};
				}
				return state;
			});
		},
		
		/**
		 * Use a hint
		 */
		useHint: () => {
			update(state => ({
				...state,
				hintsUsed: state.hintsUsed + 1,
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Record that user saw signup prompt
		 */
		sawSignupPrompt: () => {
			update(state => ({
				...state,
				signupPromptsSeen: state.signupPromptsSeen + 1,
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Record that user dismissed signup
		 */
		dismissedSignup: () => {
			update(state => ({
				...state,
				signupDismissedAt: new Date().toISOString(),
				lastVisit: new Date().toISOString(),
			}));
		},
		
		/**
		 * Reset all progress (for testing)
		 */
		reset: () => {
			set({ ...defaultState, firstVisit: new Date().toISOString() });
		},
	};
}

export const freeZone = createFreeZoneStore();

// ============================================
// Derived Stores
// ============================================

/** Number of exercises completed */
export const completedCount = derived(freeZone, $state => 
	$state.exercisesCompleted.length
);

/** Number of exercises remaining */
export const remainingExercises = derived(freeZone, $state => 
	Math.max(0, FREE_ZONE_CONFIG.maxFreeExercises - $state.exercisesCompleted.length)
);

/** Has reached the free limit? */
export const hasReachedLimit = derived(freeZone, $state => 
	$state.exercisesCompleted.length >= FREE_ZONE_CONFIG.maxFreeExercises
);

/** Should show signup prompt? */
export const shouldShowSignupPrompt = derived(freeZone, $state => {
	// Show after completing showSignupAfter exercises
	if ($state.exercisesCompleted.length >= FREE_ZONE_CONFIG.showSignupAfter) {
		// But not if they just dismissed it recently (within 5 min)
		if ($state.signupDismissedAt) {
			const dismissedAt = new Date($state.signupDismissedAt);
			const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
			if (dismissedAt > fiveMinAgo) {
				return false;
			}
		}
		return true;
	}
	return false;
});

/** Can use hint in current exercise? */
export const canUseHint = derived(freeZone, $state => 
	$state.hintsUsed < FREE_ZONE_CONFIG.maxHintsPerExercise * ($state.exercisesStarted.length || 1)
);

/** Is this exercise available for free? */
export function isExerciseFree(exerciseId: string): boolean {
	const state = get(freeZone);
	// Already started or completed = free
	if (state.exercisesStarted.includes(exerciseId) || 
	    state.exercisesCompleted.includes(exerciseId)) {
		return true;
	}
	// Under limit = free
	return state.exercisesCompleted.length < FREE_ZONE_CONFIG.maxFreeExercises;
}

/** Check if user has completed this exercise */
export function hasCompletedExercise(exerciseId: string): boolean {
	const state = get(freeZone);
	return state.exercisesCompleted.includes(exerciseId);
}

// ============================================
// Free Exercises Selection
// ============================================

/** Get IDs of exercises available in free zone */
export const FREE_EXERCISES = [
	'ex-var-001',    // Variable Swap
	'ex-cond-001',   // Grade Calculator
	'ex-for-001',    // Sum to N
	'ex-for-003',    // FizzBuzz
	'ex-arr-001',    // Find Maximum
];

