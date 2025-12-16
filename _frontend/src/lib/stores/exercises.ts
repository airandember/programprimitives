import { writable, derived, get } from 'svelte/store';
import { mockExercises, getExercisesForPrimitive } from '$lib/mock-data';
import type { Exercise, TestResult } from '$lib/types';

// Stores
export const currentExercise = writable<Exercise | null>(null);
export const exercises = writable<Exercise[]>(mockExercises);
export const userCode = writable<string>('');
export const output = writable<string>('');
export const testResults = writable<TestResult[]>([]);
export const isRunning = writable<boolean>(false);
export const isSubmitting = writable<boolean>(false);
export const hintsUsed = writable<number>(0);
export const currentHint = writable<string | null>(null);
export const startTime = writable<Date | null>(null);
export const showSuccess = writable<boolean>(false);

// Derived
export const hasCompleted = derived(testResults, ($results) =>
	$results.length > 0 && $results.every((r) => r.passed)
);

export const availableHints = derived(
	[currentExercise, hintsUsed],
	([$exercise, $used]) => {
		if (!$exercise) return 0;
		return Math.max(0, $exercise.hints.length - $used);
	}
);

// Actions
export function loadExercise(id: string): void {
	const found = mockExercises.find(e => e.id === id);
	if (found) {
		currentExercise.set(found);
		userCode.set(found.starterCode);
		output.set('');
		testResults.set([]);
		hintsUsed.set(0);
		currentHint.set(null);
		startTime.set(new Date());
		showSuccess.set(false);
	}
}

export function loadExercisesForPrimitive(primitiveId: string): void {
	const filtered = getExercisesForPrimitive(primitiveId);
	exercises.set(filtered);
}

export async function runCode(): Promise<void> {
	isRunning.set(true);
	output.set('Running...\n');

	// Simulate execution delay
	await new Promise(resolve => setTimeout(resolve, 500));

	const code = get(userCode);
	
	try {
		// Create a safe evaluation context
		const logs: string[] = [];
		const mockConsole = {
			log: (...args: unknown[]) => logs.push(args.map(String).join(' '))
		};

		// Try to execute the code (simplified - real implementation would use sandbox)
		const wrappedCode = `
			const console = mockConsole;
			${code}
		`;
		
		// For demo purposes, just show the code was "run"
		output.set(`> Code executed\n\nOutput:\n${logs.join('\n') || '(no output)'}\n\n✓ Completed in 23ms`);
	} catch (error) {
		output.set(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
	} finally {
		isRunning.set(false);
	}
}

export async function submitSolution(): Promise<void> {
	isSubmitting.set(true);
	output.set('Evaluating solution...\n');

	// Simulate test execution
	await new Promise(resolve => setTimeout(resolve, 800));

	const exercise = get(currentExercise);
	if (!exercise) {
		isSubmitting.set(false);
		return;
	}

	// Simulate test results (in real app, this would come from sandbox)
	const mockResults: TestResult[] = [
		{ name: 'Basic case', passed: true, message: 'Expected 15, got 15' },
		{ name: 'Edge case: zero', passed: true, message: 'Expected 0, got 0' },
		{ name: 'Larger number', passed: true, message: 'Expected 55, got 55' },
		{ name: 'Negative input', passed: Math.random() > 0.3, message: 'Expected 0' }
	];

	testResults.set(mockResults);

	const allPassed = mockResults.every(r => r.passed);
	
	if (allPassed) {
		const hints = get(hintsUsed);
		const score = Math.max(60, 100 - (hints * 10));
		output.set(`🎉 All tests passed!\n\nScore: ${score}%\nXP Earned: +${25 + (score > 90 ? 10 : 0)} XP\n\nGreat job!`);
		showSuccess.set(true);
	} else {
		const failed = mockResults.filter(r => !r.passed);
		output.set(`❌ ${failed.length} test(s) failed\n\nCheck your solution and try again.`);
	}

	isSubmitting.set(false);
}

export function getHint(): string | null {
	const exercise = get(currentExercise);
	const used = get(hintsUsed);

	if (!exercise || used >= exercise.hints.length) {
		return null;
	}

	const hint = exercise.hints[used];
	hintsUsed.set(used + 1);
	currentHint.set(hint);
	return hint;
}

export function resetExercise(): void {
	const exercise = get(currentExercise);
	if (exercise) {
		userCode.set(exercise.starterCode);
		output.set('');
		testResults.set([]);
		currentHint.set(null);
		startTime.set(new Date());
		showSuccess.set(false);
	}
}

export function updateCode(code: string): void {
	userCode.set(code);
}
