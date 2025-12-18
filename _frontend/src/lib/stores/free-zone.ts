// ============================================
// Free Zone Store - Re-exports from free-zone braid
// ============================================
// 
// Components should import from here:
//   import { freeZone, remainingExercises } from '$lib/stores/free-zone';
//

export {
	// Configuration
	FREE_ZONE_CONFIG,
	FREE_EXERCISES,
	
	// Store
	freeZone,
	
	// Derived
	completedCount,
	remainingExercises,
	hasReachedLimit,
	shouldShowSignupPrompt,
	canUseHint,
	
	// Functions
	isExerciseFree,
	hasCompletedExercise,
	
	// Types
	type FreeZoneState,
} from '@braids/free-zone/frontend/stores/free-zone';

