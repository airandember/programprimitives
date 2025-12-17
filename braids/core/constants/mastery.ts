// ============================================
// Mastery & XP Constants
// ============================================

import type { MasteryLevel } from '../types/progress';

/**
 * Mastery level requirements
 */
export const MasteryRequirements: Record<MasteryLevel, {
	exercisesCompleted: number;
	averageScore: number;
	successRate: number;
}> = {
	0: { exercisesCompleted: 0, averageScore: 0, successRate: 0 },
	1: { exercisesCompleted: 1, averageScore: 0, successRate: 0 },
	2: { exercisesCompleted: 3, averageScore: 50, successRate: 0 },
	3: { exercisesCompleted: 5, averageScore: 70, successRate: 0 },
	4: { exercisesCompleted: 8, averageScore: 80, successRate: 0.7 },
	5: { exercisesCompleted: Infinity, averageScore: 90, successRate: 0.85 }, // All exercises
};

/**
 * XP rewards
 */
export const XPRewards = {
	// Exercise completion
	exerciseComplete: {
		base: 10,
		perDifficulty: 10,           // +10 per difficulty level
		firstAttemptBonus: 25,
		noHintsBonus: 15,
	},
	
	// Daily activity
	dailyLogin: 5,
	streakMaintain: 10,              // Per day
	
	// Achievements
	achievementUnlock: {
		common: 50,
		rare: 150,
		epic: 300,
		legendary: 500,
	},
	
	// Challenges
	dailyChallenge: 100,
	weeklyChallenge: 250,
};

/**
 * Level XP thresholds (cumulative)
 */
export function xpForLevel(level: number): number {
	if (level <= 1) return 0;
	// Quadratic growth: 50 * (level - 1)^2
	return Math.floor(50 * Math.pow(level - 1, 2));
}

/**
 * Calculate level from total XP
 */
export function levelFromXp(totalXp: number): number {
	// Inverse of xpForLevel: level = sqrt(xp/50) + 1
	return Math.floor(Math.sqrt(totalXp / 50) + 1);
}

/**
 * Streak milestones
 */
export const StreakMilestones = [7, 14, 30, 60, 100, 200, 365];

/**
 * Mastery decay rate (per week of inactivity)
 */
export const MasteryDecay = {
	ratePerWeek: 0.1,                // 10% decay per week
	minFactor: 0.5,                  // Minimum 50% of mastery retained
	gracePeriodDays: 7,              // No decay for first week
};

