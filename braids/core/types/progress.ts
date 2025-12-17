// ============================================
// Progress Types
// ============================================

import type { Language } from './user';

/**
 * User's overall progress
 */
export interface UserProgress {
	userId: string;
	
	// Aggregate stats
	totalExercisesCompleted: number;
	totalPrimitivesMastered: number;
	totalTimeSpentMinutes: number;
	totalXp: number;
	currentLevel: number;
	
	// Streaks
	currentDailyStreak: number;
	longestDailyStreak: number;
	streakLastDate?: string;
	
	// Timestamps
	lastActivityAt?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Mastery level (0-5)
 */
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Mastery level names
 */
export const MasteryLevelNames: Record<MasteryLevel, string> = {
	0: 'Unexplored',
	1: 'Introduced',
	2: 'Practicing',
	3: 'Familiar',
	4: 'Proficient',
	5: 'Mastered',
};

/**
 * User's mastery for a primitive in a specific language
 */
export interface PrimitiveMastery {
	userId: string;
	primitiveId: string;
	primitiveName: string;
	language: Language;
	
	// Mastery data
	masteryLevel: MasteryLevel;
	exercisesCompleted: number;
	exercisesAvailable: number;
	totalAttempts: number;
	successfulAttempts: number;
	averageScore: number;           // 0-100
	
	// Time tracking
	totalTimeMinutes: number;
	
	// Decay (skills fade without practice)
	lastPracticedAt?: string;
	decayFactor: number;            // 0.5-1.0 multiplier
	
	// Timestamps
	createdAt: string;
	updatedAt: string;
}

/**
 * Mastery for display (simpler)
 */
export interface MasteryDisplay {
	primitiveId: string;
	primitiveName: string;
	primitiveIcon: string;
	language: Language;
	level: MasteryLevel;
	progress: number;               // 0-100 percentage to next level
}

/**
 * Streak info
 */
export interface StreakInfo {
	currentStreak: number;
	longestStreak: number;
	lastActivityDate?: string;
	isActiveToday: boolean;
	
	// Milestones
	nextMilestone: number;          // e.g., 7, 30, 100, 365
	daysToMilestone: number;
}

/**
 * Activity log entry
 */
export interface ActivityEntry {
	id: string;
	userId: string;
	
	type: ActivityType;
	data: Record<string, unknown>;
	xpEarned: number;
	
	createdAt: string;
}

export type ActivityType =
	| 'exercise_complete'
	| 'exercise_attempt'
	| 'achievement_unlock'
	| 'level_up'
	| 'streak_milestone'
	| 'login';

/**
 * Exercise completion record
 */
export interface ExerciseCompletion {
	id: string;
	userId: string;
	exerciseId: string;
	language: Language;
	
	// Completion data
	status: 'completed' | 'attempted' | 'skipped';
	attempts: number;
	hintsUsed: number;
	score: number;
	timeSpentSeconds: number;
	
	// Code
	submittedCode: string;
	
	// Timestamps
	startedAt: string;
	completedAt?: string;
	createdAt: string;
}

// ============================================
// Analytics Types
// ============================================

export interface ProgressAnalytics {
	// Time-based
	weeklyActivity: DailyActivity[];
	monthlyProgress: number;        // % improvement
	
	// Skill-based
	strongestPrimitives: string[];
	weakestPrimitives: string[];
	recommendedNext: string[];
	
	// Engagement
	averageSessionMinutes: number;
	completionRate: number;
}

export interface DailyActivity {
	date: string;
	exercisesCompleted: number;
	xpEarned: number;
	timeSpentMinutes: number;
}

