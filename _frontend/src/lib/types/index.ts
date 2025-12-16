// Core Types for ProgramPrimitives

export interface User {
	id: string;
	email: string;
	displayName: string;
	avatarUrl?: string;
	preferredLanguage: string;
	subscriptionTier: 'free' | 'learner' | 'pro' | 'team';
}

export interface Primitive {
	id: string;
	name: string;
	category: string;
	subcategory?: string;
	description: string;
	whyItMatters?: string;
	bestPractices?: string[];
	pitfalls?: string[];
	difficulty: number;
	icon?: string;
	isPremium: boolean;
}

export interface PrimitiveSyntax {
	primitiveId: string;
	language: string;
	syntax: string;
	example: string;
	explanation?: string;
	variations?: string[];
}

export interface Exercise {
	id: string;
	primitiveId: string;
	title: string;
	slug: string;
	description: string;
	difficulty: number;
	estimatedMinutes: number;
	instructions: string;
	hints: string[];
	starterCode: string;
	isPremium: boolean;
}

export interface TestResult {
	name: string;
	passed: boolean;
	message?: string;
}

export interface UserProgress {
	totalExercisesCompleted: number;
	totalPrimitivesMastered: number;
	totalTimeSpentMinutes: number;
	totalXp: number;
	currentLevel: number;
	currentDailyStreak: number;
	longestDailyStreak: number;
	lastActivityAt?: string;
}

export interface MasteryLevel {
	primitiveId: string;
	primitiveName: string;
	language: string;
	level: number;
	exercisesCompleted: number;
	exercisesAvailable: number;
	averageScore: number;
	lastPracticedAt?: string;
}

export interface Achievement {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
	xpReward: number;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	unlocked: boolean;
	unlockedAt?: string;
}

export interface Category {
	id: string;
	name: string;
	icon: string;
	count: number;
}

export interface Language {
	id: string;
	name: string;
	icon: string;
}

