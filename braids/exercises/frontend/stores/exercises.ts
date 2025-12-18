// ============================================
// Exercises Store - Svelte store for exercises
// ============================================

import { writable, derived, get } from 'svelte/store';
import type { Exercise, TestResult } from '@braids/core/types';
import { 
	ALL_EXERCISES,
	getExerciseById,
	getExercisesForPrimitive,
	getFreeExercises,
} from '../data/exercises';

// ============================================
// State
// ============================================

export const exercises = writable<Exercise[]>(ALL_EXERCISES);
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const selectedPrimitive = writable<string | null>(null);
export const selectedDifficulty = writable<number | null>(null);

// Current exercise state
export const currentExercise = writable<Exercise | null>(null);
export const currentCode = writable<string>('');
export const currentLanguage = writable<string>('javascript');
export const isRunning = writable(false);
export const testResults = writable<TestResult[]>([]);
export const runOutput = writable<string>('');
export const hintsRevealed = writable<number>(0);

// ============================================
// Derived Stores
// ============================================

/** Exercises filtered by primitive and difficulty */
export const filteredExercises = derived(
	[exercises, selectedPrimitive, selectedDifficulty],
	([$exercises, $primitive, $difficulty]) => {
		let result = $exercises;
		
		if ($primitive) {
			result = result.filter(e => e.primitiveId === $primitive);
		}
		
		if ($difficulty) {
			result = result.filter(e => e.difficulty === $difficulty);
		}
		
		return result;
	}
);

/** Exercises grouped by primitive */
export const exercisesByPrimitive = derived(exercises, ($exercises) => {
	const grouped: Record<string, Exercise[]> = {};
	
	for (const exercise of $exercises) {
		if (!grouped[exercise.primitiveId]) {
			grouped[exercise.primitiveId] = [];
		}
		grouped[exercise.primitiveId].push(exercise);
	}
	
	return grouped;
});

/** Free exercises only */
export const freeExercises = derived(exercises, ($exercises) => 
	$exercises.filter(e => !e.isPremium)
);

/** Current exercise hints (progressively revealed) */
export const visibleHints = derived(
	[currentExercise, hintsRevealed],
	([$exercise, $revealed]) => {
		if (!$exercise) return [];
		return $exercise.hints.slice(0, $revealed);
	}
);

/** Can reveal more hints? */
export const canRevealMoreHints = derived(
	[currentExercise, hintsRevealed],
	([$exercise, $revealed]) => {
		if (!$exercise) return false;
		return $revealed < $exercise.hints.length;
	}
);

/** All tests passed? */
export const allTestsPassed = derived(testResults, ($results) => {
	if ($results.length === 0) return false;
	return $results.every(r => r.passed);
});

// ============================================
// Actions
// ============================================

/**
 * Load an exercise into the workspace
 */
export function loadExercise(exerciseId: string): boolean {
	const exercise = getExerciseById(exerciseId);
	if (!exercise) {
		error.set(`Exercise ${exerciseId} not found`);
		return false;
	}
	
	currentExercise.set(exercise);
	currentLanguage.update($lang => {
		// Use starter code for current language, or default to javascript
		const lang = exercise.starterCode[$lang] ? $lang : 'javascript';
		currentCode.set(exercise.starterCode[lang] || '');
		return lang;
	});
	testResults.set([]);
	runOutput.set('');
	hintsRevealed.set(0);
	error.set(null);
	
	return true;
}

/**
 * Change the programming language
 */
export function setLanguage(language: string): void {
	const exercise = get(currentExercise);
	if (!exercise) return;
	
	const starterCode = exercise.starterCode[language];
	if (starterCode) {
		currentLanguage.set(language);
		currentCode.set(starterCode);
		// Reset results when changing language
		testResults.set([]);
		runOutput.set('');
	}
}

/**
 * Update the current code
 */
export function updateCode(code: string): void {
	currentCode.set(code);
}

/**
 * Reveal the next hint
 */
export function revealHint(): void {
	const exercise = get(currentExercise);
	if (!exercise) return;
	
	hintsRevealed.update(n => Math.min(n + 1, exercise.hints.length));
}

/**
 * Run the code using the sandbox
 */
export async function runCode(): Promise<void> {
	isRunning.set(true);
	runOutput.set('');
	testResults.set([]);
	
	const code = get(currentCode);
	const language = get(currentLanguage) as 'javascript' | 'python' | 'go';
	const exercise = get(currentExercise);
	
	if (!exercise) {
		isRunning.set(false);
		return;
	}
	
	// Use sandbox for execution
	const { sandbox } = await import('$lib/stores/sandbox');
	
	// Run tests against the code
	const sandboxTestCases = exercise.testCases
		.filter(tc => !tc.isHidden)
		.map(tc => ({
			id: tc.id,
			name: tc.name,
			input: tc.input,
			expected: tc.expected,
			hidden: tc.isHidden,
		}));
	
	const result = await sandbox.test(code, language, sandboxTestCases);
	
	// Convert sandbox results to our format
	const results: TestResult[] = result.results.map(r => ({
		testCaseId: r.id,
		name: r.name,
		passed: r.passed,
		expected: r.expected,
		actual: r.actual,
		executionTimeMs: Math.floor(result.executionMs / result.results.length),
	}));
	
	testResults.set(results);
	
	const passedCount = results.filter(r => r.passed).length;
	runOutput.set(`Ran ${results.length} tests: ${passedCount} passed, ${results.length - passedCount} failed\nExecution time: ${result.executionMs}ms`);
	
	isRunning.set(false);
}

/**
 * Submit solution using the sandbox
 */
export async function submitSolution(): Promise<{ success: boolean; score: number; xpEarned: number }> {
	isRunning.set(true);
	
	const code = get(currentCode);
	const language = get(currentLanguage) as 'javascript' | 'python' | 'go';
	const exercise = get(currentExercise);
	const hints = get(hintsRevealed);
	
	if (!exercise) {
		isRunning.set(false);
		return { success: false, score: 0, xpEarned: 0 };
	}
	
	// Use sandbox for submission
	const { sandbox } = await import('$lib/stores/sandbox');
	
	// All test cases including hidden
	const sandboxTestCases = exercise.testCases.map(tc => ({
		id: tc.id,
		name: tc.name,
		input: tc.input,
		expected: tc.expected,
		hidden: tc.isHidden,
	}));
	
	const result = await sandbox.submit({
		code,
		language,
		testCases: sandboxTestCases,
		hintsUsed: hints,
		timeSpentSeconds: 120, // TODO: Track actual time
		expectedMinutes: exercise.estimatedMinutes,
	});
	
	// Convert visible results
	const visibleResults: TestResult[] = result.testResults
		.filter(r => !r.hidden)
		.map(r => ({
			testCaseId: r.id,
			name: r.name,
			passed: r.passed,
			expected: r.expected,
			actual: r.actual,
			executionTimeMs: 0,
		}));
	
	testResults.set(visibleResults);
	runOutput.set(result.feedback || '');
	
	isRunning.set(false);
	
	return { 
		success: result.passed, 
		score: result.score, 
		xpEarned: result.xpEarned 
	};
}

/**
 * Reset the exercise to starter code
 */
export function resetExercise(): void {
	const exercise = get(currentExercise);
	const language = get(currentLanguage);
	
	if (exercise && exercise.starterCode[language]) {
		currentCode.set(exercise.starterCode[language]);
		testResults.set([]);
		runOutput.set('');
		hintsRevealed.set(0);
	}
}

/**
 * Get exercise by ID
 */
export function getExercise(id: string): Exercise | undefined {
	return getExerciseById(id);
}

/**
 * Get exercises for a primitive
 */
export function getPrimitiveExercises(primitiveId: string): Exercise[] {
	return getExercisesForPrimitive(primitiveId);
}

/**
 * Filter by primitive
 */
export function filterByPrimitive(primitiveId: string | null): void {
	selectedPrimitive.set(primitiveId);
}

/**
 * Filter by difficulty
 */
export function filterByDifficulty(difficulty: number | null): void {
	selectedDifficulty.set(difficulty);
}

/**
 * Clear all filters
 */
export function clearFilters(): void {
	selectedPrimitive.set(null);
	selectedDifficulty.set(null);
}

