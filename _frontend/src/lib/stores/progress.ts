import { writable, derived } from 'svelte/store';
import { mockProgress, mockMastery } from '$lib/mock-data';
import type { UserProgress, MasteryLevel } from '$lib/types';

// Stores
export const userProgress = writable<UserProgress>(mockProgress);
export const masteryLevels = writable<MasteryLevel[]>(mockMastery);
export const isLoadingProgress = writable(false);

// Derived
export const currentStreak = derived(userProgress, ($p) => $p?.currentDailyStreak || 0);
export const totalXp = derived(userProgress, ($p) => $p?.totalXp || 0);
export const currentLevel = derived(userProgress, ($p) => $p?.currentLevel || 1);

export const masteryPercentage = derived(masteryLevels, ($levels) => {
	if ($levels.length === 0) return 0;
	const totalPossible = $levels.length * 5;
	const totalAchieved = $levels.reduce((sum, l) => sum + l.level, 0);
	return Math.round((totalAchieved / totalPossible) * 100);
});

// XP to level calculation
export function xpForLevel(level: number): number {
	if (level <= 1) return 0;
	return Math.floor(50 * Math.pow(level - 1, 2));
}

export function xpToNextLevel(currentXp: number, currentLevel: number): number {
	const nextLevelXp = xpForLevel(currentLevel + 1);
	return nextLevelXp - currentXp;
}

// Level names
export function getLevelName(level: number): string {
	if (level < 5) return 'Beginner';
	if (level < 10) return 'Learner';
	if (level < 20) return 'Practitioner';
	if (level < 35) return 'Developer';
	if (level < 50) return 'Expert';
	if (level < 100) return 'Master';
	return 'Legend';
}

// Mastery level names
export function getMasteryName(level: number): string {
	const names = ['Unexplored', 'Introduced', 'Practicing', 'Familiar', 'Proficient', 'Mastered'];
	return names[level] || 'Unknown';
}

export function getMasteryColor(level: number): string {
	const colors = [
		'text-surface-500',
		'text-surface-400',
		'text-yellow-500',
		'text-orange-500',
		'text-primary-500',
		'text-accent-400'
	];
	return colors[level] || colors[0];
}

// Actions
export function loadProgress(): void {
	userProgress.set(mockProgress);
}

export function loadMastery(): void {
	masteryLevels.set(mockMastery);
}
