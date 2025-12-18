// ============================================
// Exercises Store - Re-exports from exercises braid
// ============================================
// 
// Components should import from here:
//   import { exercises, loadExercise, runCode } from '$lib/stores/exercises';
//

export {
	// State
	exercises,
	isLoading,
	error,
	selectedPrimitive,
	selectedDifficulty,
	currentExercise,
	currentCode,
	currentLanguage,
	isRunning,
	testResults,
	runOutput,
	hintsRevealed,
	
	// Derived
	filteredExercises,
	exercisesByPrimitive,
	freeExercises,
	visibleHints,
	canRevealMoreHints,
	allTestsPassed,
	
	// Actions
	loadExercise,
	setLanguage,
	updateCode,
	revealHint,
	runCode,
	submitSolution,
	resetExercise,
	getExercise,
	getPrimitiveExercises,
	filterByPrimitive,
	filterByDifficulty,
	clearFilters,
} from '@braids/exercises/frontend/stores/exercises';
