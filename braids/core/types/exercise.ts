// ============================================
// Exercise Types
// ============================================

import type { Language } from './user';

/**
 * Exercise entity (full)
 */
export interface Exercise {
	id: string;
	primitiveId: string;
	
	// Basic info
	title: string;
	slug: string;
	description: string;
	
	// Difficulty
	difficulty: 1 | 2 | 3 | 4 | 5;
	estimatedMinutes: number;
	
	// Content
	instructions: string;                     // Markdown
	hints: string[];                          // Progressive hints
	starterCode: Record<string, string>;      // Code per language
	testCases: TestCase[];                    // Validation tests
	
	// Access
	isPremium: boolean;
}

/**
 * Exercise for list view
 */
export interface ExerciseListItem {
	id: string;
	primitiveId: string;
	title: string;
	description: string;
	difficulty: 1 | 2 | 3 | 4 | 5;
	estimatedMinutes: number;
	isPremium: boolean;
	
	// User progress (if authenticated)
	userProgress?: {
		isCompleted: boolean;
		bestScore?: number;
		attempts: number;
	};
}

/**
 * Test case for validation
 */
export interface TestCase {
	id: string;
	name: string;
	description?: string;
	input: unknown;                 // JSON input
	expected: unknown;              // JSON expected result
	isHidden: boolean;              // Hidden from user
}

/**
 * Test result after execution
 */
export interface TestResult {
	testCaseId: string;
	name: string;
	passed: boolean;
	expected: string;
	actual: string;
	executionTimeMs: number;
	error?: string;
}

// ============================================
// Execution Types
// ============================================

/**
 * Code execution request
 */
export interface RunCodeRequest {
	exerciseId: string;
	language: Language;
	code: string;
}

/**
 * Code execution response
 */
export interface RunCodeResponse {
	output: string;
	error?: string;
	executionTimeMs: number;
}

/**
 * Solution submission request
 */
export interface SubmitSolutionRequest {
	exerciseId: string;
	language: Language;
	code: string;
	hintsUsed: number;
	timeSpentSeconds: number;
}

/**
 * Solution submission response
 */
export interface SubmitSolutionResponse {
	passed: boolean;
	score: number;                  // 0-100
	testResults: TestResult[];
	xpEarned: number;
	achievements?: string[];        // Newly unlocked achievement IDs
	
	// If first completion
	isFirstCompletion: boolean;
}

// ============================================
// Query Types
// ============================================

export interface ExerciseQuery {
	primitiveId?: string;
	difficulty?: number;
	completed?: boolean;
}
