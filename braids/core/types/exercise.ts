// ============================================
// Exercise Types
// ============================================

import type { Language } from './user';

/**
 * Exercise entity
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
	instructions: string;                // Markdown
	hints: string[];                     // Progressive hints
	
	// Ordering
	sequenceOrder: number;
	
	// Access
	isPremium: boolean;
	isPublished: boolean;
	
	// Timestamps
	createdAt: string;
	updatedAt: string;
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
 * Exercise with full content for workspace
 */
export interface ExerciseDetail extends Exercise {
	starterCode: Record<Language, string>;
	testCases: TestCase[];
}

/**
 * Starter code for a specific language
 */
export interface ExerciseStarterCode {
	exerciseId: string;
	language: Language;
	starterCode: string;
	solutionCode: string;          // Hidden from users
}

/**
 * Test case for validation
 */
export interface TestCase {
	id: string;
	name: string;
	description?: string;
	input: unknown;                 // JSON input
	expectedOutput: unknown;        // JSON expected result
	isHidden: boolean;              // Hidden from user
	timeoutMs: number;
}

/**
 * Test result after execution
 */
export interface TestResult {
	testCaseId: string;
	name: string;
	passed: boolean;
	message?: string;
	actualOutput?: unknown;
	executionTimeMs?: number;
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

