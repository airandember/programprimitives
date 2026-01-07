// ============================================
// Gamification Store - XP, Achievements, Badges
// ============================================

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Types
// ============================================

export type AchievementCategory = 'completion' | 'streak' | 'mastery' | 'special';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: AchievementCategory;
	requirement: {
		type: string;
		value: number;
	};
	xpReward: number;
	rarity: AchievementRarity;
}

export interface UserAchievement {
	achievementId: string;
	unlockedAt?: string;
	progress: number;      // 0-100
	isUnlocked: boolean;
}

export interface DailyChallenge {
	id: string;
	title: string;
	description: string;
	type: 'complete_exercises' | 'score_target' | 'primitive_focus' | 'streak';
	target: number;
	current: number;
	xpReward: number;
	expiresAt: string;
}

export interface GamificationState {
	userId: string;
	achievements: UserAchievement[];
	dailyChallenges: DailyChallenge[];
	weeklyXp: number;
	lastCheckedAt: string;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'pp_gamification';

export const LEVEL_TITLES: Record<number, string> = {
	1: 'Novice',
	2: 'Learner',
	3: 'Practitioner',
	4: 'Developer',
	5: 'Skilled',
	6: 'Advanced',
	7: 'Expert',
	8: 'Master',
	9: 'Grandmaster',
	10: 'Legend',
};

export const LEVEL_THRESHOLDS: Record<number, number> = {
	1: 0,
	2: 500,
	3: 1000,
	4: 2000,
	5: 3500,
	6: 5500,
	7: 8000,
	8: 11000,
	9: 15000,
	10: 20000,
};

export const RARITY_COLORS: Record<AchievementRarity, string> = {
	common: 'surface-400',
	uncommon: 'green-400',
	rare: 'blue-400',
	epic: 'purple-400',
	legendary: 'yellow-400',
};

// ============================================
// Achievement Catalog
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
	// Completion badges
	{
		id: 'first-steps',
		name: 'First Steps',
		description: 'Complete your first exercise',
		icon: '🎯',
		category: 'completion',
		requirement: { type: 'exercises_completed', value: 1 },
		xpReward: 50,
		rarity: 'common',
	},
	{
		id: 'on-fire',
		name: 'On Fire',
		description: 'Complete 5 exercises in one day',
		icon: '🔥',
		category: 'completion',
		requirement: { type: 'daily_exercises', value: 5 },
		xpReward: 100,
		rarity: 'uncommon',
	},
	{
		id: 'speed-run',
		name: 'Speed Run',
		description: 'Complete 10 exercises in one day',
		icon: '🚀',
		category: 'completion',
		requirement: { type: 'daily_exercises', value: 10 },
		xpReward: 200,
		rarity: 'rare',
	},
	{
		id: 'completionist',
		name: 'Completionist',
		description: 'Complete all exercises for a primitive',
		icon: '🏆',
		category: 'completion',
		requirement: { type: 'primitive_complete', value: 1 },
		xpReward: 150,
		rarity: 'uncommon',
	},
	{
		id: 'perfectionist',
		name: 'Perfectionist',
		description: 'Get 5 perfect scores in a row',
		icon: '💎',
		category: 'completion',
		requirement: { type: 'perfect_streak', value: 5 },
		xpReward: 250,
		rarity: 'epic',
	},
	{
		id: 'polyglot',
		name: 'Polyglot',
		description: 'Complete exercises in 3+ languages',
		icon: '🌟',
		category: 'completion',
		requirement: { type: 'languages_used', value: 3 },
		xpReward: 200,
		rarity: 'rare',
	},
	
	// Streak badges
	{
		id: 'week-warrior',
		name: 'Week Warrior',
		description: '7 day streak',
		icon: '📆',
		category: 'streak',
		requirement: { type: 'streak', value: 7 },
		xpReward: 100,
		rarity: 'uncommon',
	},
	{
		id: 'monthly-master',
		name: 'Monthly Master',
		description: '30 day streak',
		icon: '🗓️',
		category: 'streak',
		requirement: { type: 'streak', value: 30 },
		xpReward: 500,
		rarity: 'epic',
	},
	{
		id: 'century-club',
		name: 'Century Club',
		description: '100 day streak',
		icon: '📅',
		category: 'streak',
		requirement: { type: 'streak', value: 100 },
		xpReward: 1000,
		rarity: 'legendary',
	},
	
	// Mastery badges
	{
		id: 'scholar',
		name: 'Scholar',
		description: 'Master 3 primitives',
		icon: '📚',
		category: 'mastery',
		requirement: { type: 'primitives_mastered', value: 3 },
		xpReward: 300,
		rarity: 'rare',
	},
	{
		id: 'professor',
		name: 'Professor',
		description: 'Master 6 primitives',
		icon: '🎓',
		category: 'mastery',
		requirement: { type: 'primitives_mastered', value: 6 },
		xpReward: 500,
		rarity: 'epic',
	},
	{
		id: 'wizard',
		name: 'Wizard',
		description: 'Master 10 primitives',
		icon: '🧙',
		category: 'mastery',
		requirement: { type: 'primitives_mastered', value: 10 },
		xpReward: 1000,
		rarity: 'legendary',
	},
	{
		id: 'master',
		name: 'Master',
		description: 'Reach level 5 mastery on any primitive',
		icon: '👑',
		category: 'mastery',
		requirement: { type: 'max_mastery', value: 1 },
		xpReward: 250,
		rarity: 'rare',
	},
	
	// Special badges
	{
		id: 'early-bird',
		name: 'Early Bird',
		description: 'Practice before 7am',
		icon: '🌅',
		category: 'special',
		requirement: { type: 'early_practice', value: 1 },
		xpReward: 50,
		rarity: 'uncommon',
	},
	{
		id: 'night-owl',
		name: 'Night Owl',
		description: 'Practice after midnight',
		icon: '🦉',
		category: 'special',
		requirement: { type: 'late_practice', value: 1 },
		xpReward: 50,
		rarity: 'uncommon',
	},
	{
		id: 'comeback-kid',
		name: 'Comeback Kid',
		description: 'Return after 7+ day break',
		icon: '💪',
		category: 'special',
		requirement: { type: 'comeback', value: 7 },
		xpReward: 100,
		rarity: 'rare',
	},
	{
		id: 'versatile',
		name: 'Versatile',
		description: 'Practice in all primitive categories',
		icon: '🎭',
		category: 'special',
		requirement: { type: 'all_categories', value: 4 },
		xpReward: 150,
		rarity: 'rare',
	},
];

// ============================================
// Default State
// ============================================

function generateDailyChallenges(): DailyChallenge[] {
	const tomorrow = new Date();
	tomorrow.setHours(24, 0, 0, 0);
	
	return [
		{
			id: 'daily-1',
			title: 'Daily Practice',
			description: 'Complete 3 exercises today',
			type: 'complete_exercises',
			target: 3,
			current: 0,
			xpReward: 75,
			expiresAt: tomorrow.toISOString(),
		},
		{
			id: 'daily-2',
			title: 'High Achiever',
			description: 'Score 90% or higher on 2 exercises',
			type: 'score_target',
			target: 2,
			current: 0,
			xpReward: 100,
			expiresAt: tomorrow.toISOString(),
		},
	];
}

const defaultState: GamificationState = {
	userId: 'guest',
	achievements: ACHIEVEMENTS.map(a => ({
		achievementId: a.id,
		progress: 0,
		isUnlocked: false,
	})),
	dailyChallenges: generateDailyChallenges(),
	weeklyXp: 0,
	lastCheckedAt: new Date().toISOString(),
};

// ============================================
// API Helpers
// ============================================

async function fetchAchievements(): Promise<any[]> {
	try {
		const response = await fetch('/api/achievements', {
			credentials: 'include'
		});
		if (!response.ok) {
			return [];
		}
		const json = await response.json();
		// API returns { success: true, data: [...] } - extract data
		const data = json && typeof json === 'object' && 'data' in json ? json.data : json;
		return Array.isArray(data) ? data : [];
	} catch (e) {
		console.error('Failed to fetch achievements:', e);
		return [];
	}
}

// ============================================
// Storage (for offline cache)
// ============================================

function loadCachedState(): GamificationState {
	if (!browser) return defaultState;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.error('Failed to load cached gamification state:', e);
	}
	
	return defaultState;
}

function cacheState(state: GamificationState): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.error('Failed to cache gamification state:', e);
	}
}

// ============================================
// Store
// ============================================

function createGamificationStore() {
	// Start with defaults - API will populate real data
	const { subscribe, set, update } = writable<GamificationState>(defaultState);
	
	// Only cache after API has loaded real data
	let initialized = false;
	subscribe((state) => {
		if (initialized) {
			cacheState(state);
		}
	});
	
	return {
		subscribe,
		
		/**
		 * Load achievements from API
		 */
		loadFromApi: async () => {
			const apiAchievements = await fetchAchievements();
			
			// Merge API achievements with our local ACHIEVEMENTS catalog
			const updatedAchievements = ACHIEVEMENTS.map(ach => {
				const apiAch = apiAchievements.find((a: any) => a.id === ach.id);
				return {
					achievementId: ach.id,
					progress: apiAch?.isUnlocked ? 100 : 0,
					isUnlocked: apiAch?.isUnlocked || false,
					unlockedAt: apiAch?.unlockedAt,
				};
			});
			
			update(state => ({
				...state,
				achievements: updatedAchievements,
				weeklyXp: 0, // Reset to 0 - will be calculated from API
			}));
			
			initialized = true;
		},
		
		/**
		 * Check and unlock achievements based on progress data
		 */
		checkAchievements: (progressData: {
			exercisesCompleted: number;
			dailyExercises: number;
			streak: number;
			primitivesMastered: number;
			languagesUsed: number;
			perfectStreak: number;
			allCategories: boolean;
			hourOfDay: number;
			daysSinceLastActivity: number;
		}): Achievement[] => {
			const newlyUnlocked: Achievement[] = [];
			
			update(state => {
				for (const userAch of state.achievements) {
					if (userAch.isUnlocked) continue;
					
					const achievement = ACHIEVEMENTS.find(a => a.id === userAch.achievementId);
					if (!achievement) continue;
					
					let progress = 0;
					let shouldUnlock = false;
					
					switch (achievement.requirement.type) {
						case 'exercises_completed':
							progress = Math.min(100, (progressData.exercisesCompleted / achievement.requirement.value) * 100);
							shouldUnlock = progressData.exercisesCompleted >= achievement.requirement.value;
							break;
						case 'daily_exercises':
							progress = Math.min(100, (progressData.dailyExercises / achievement.requirement.value) * 100);
							shouldUnlock = progressData.dailyExercises >= achievement.requirement.value;
							break;
						case 'streak':
							progress = Math.min(100, (progressData.streak / achievement.requirement.value) * 100);
							shouldUnlock = progressData.streak >= achievement.requirement.value;
							break;
						case 'primitives_mastered':
						case 'max_mastery':
							progress = Math.min(100, (progressData.primitivesMastered / achievement.requirement.value) * 100);
							shouldUnlock = progressData.primitivesMastered >= achievement.requirement.value;
							break;
						case 'languages_used':
							progress = Math.min(100, (progressData.languagesUsed / achievement.requirement.value) * 100);
							shouldUnlock = progressData.languagesUsed >= achievement.requirement.value;
							break;
						case 'perfect_streak':
							progress = Math.min(100, (progressData.perfectStreak / achievement.requirement.value) * 100);
							shouldUnlock = progressData.perfectStreak >= achievement.requirement.value;
							break;
						case 'all_categories':
							progress = progressData.allCategories ? 100 : 75;
							shouldUnlock = progressData.allCategories;
							break;
						case 'early_practice':
							shouldUnlock = progressData.hourOfDay < 7;
							progress = shouldUnlock ? 100 : 0;
							break;
						case 'late_practice':
							shouldUnlock = progressData.hourOfDay >= 0 && progressData.hourOfDay < 5;
							progress = shouldUnlock ? 100 : 0;
							break;
						case 'comeback':
							shouldUnlock = progressData.daysSinceLastActivity >= achievement.requirement.value;
							progress = shouldUnlock ? 100 : 0;
							break;
					}
					
					userAch.progress = Math.round(progress);
					
					if (shouldUnlock && !userAch.isUnlocked) {
						userAch.isUnlocked = true;
						userAch.unlockedAt = new Date().toISOString();
						newlyUnlocked.push(achievement);
					}
				}
				
				return { ...state };
			});
			
			return newlyUnlocked;
		},
		
		/**
		 * Update daily challenge progress
		 */
		updateDailyChallenge: (type: string, value: number) => {
			update(state => {
				for (const challenge of state.dailyChallenges) {
					if (challenge.type === type) {
						challenge.current = Math.min(challenge.target, challenge.current + value);
					}
				}
				return { ...state };
			});
		},
		
		/**
		 * Get achievement by ID
		 */
		getAchievement: (id: string): { achievement: Achievement; userAchievement: UserAchievement } | undefined => {
			const state = get({ subscribe });
			const achievement = ACHIEVEMENTS.find(a => a.id === id);
			const userAchievement = state.achievements.find(ua => ua.achievementId === id);
			
			if (achievement && userAchievement) {
				return { achievement, userAchievement };
			}
			return undefined;
		},
		
		/**
		 * Add weekly XP
		 */
		addWeeklyXp: (xp: number) => {
			update(state => ({
				...state,
				weeklyXp: state.weeklyXp + xp,
			}));
		},
		
		/**
		 * Reset (for testing)
		 */
		reset: () => {
			set({ ...defaultState });
		},
	};
}

export const gamification = createGamificationStore();

// ============================================
// Derived Stores
// ============================================

/** Unlocked achievements */
export const unlockedAchievements = derived(gamification, $g => 
	$g.achievements
		.filter(ua => ua.isUnlocked)
		.map(ua => ({
			...ACHIEVEMENTS.find(a => a.id === ua.achievementId)!,
			unlockedAt: ua.unlockedAt,
		}))
		.sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
);

/** Achievements in progress (not unlocked but started) */
export const inProgressAchievements = derived(gamification, $g =>
	$g.achievements
		.filter(ua => !ua.isUnlocked && ua.progress > 0)
		.map(ua => ({
			...ACHIEVEMENTS.find(a => a.id === ua.achievementId)!,
			progress: ua.progress,
		}))
		.sort((a, b) => b.progress - a.progress)
);

/** Total XP from achievements */
export const achievementXp = derived(gamification, $g => {
	return $g.achievements
		.filter(ua => ua.isUnlocked)
		.reduce((sum, ua) => {
			const ach = ACHIEVEMENTS.find(a => a.id === ua.achievementId);
			return sum + (ach?.xpReward || 0);
		}, 0);
});

/** Daily challenges completion percentage */
export const dailyChallengeProgress = derived(gamification, $g => {
	const total = $g.dailyChallenges.length;
	if (total === 0) return 0;
	
	const completed = $g.dailyChallenges.filter(c => c.current >= c.target).length;
	return Math.round((completed / total) * 100);
});

/** Get level from XP */
export function getLevelFromXp(xp: number): number {
	for (let level = 10; level >= 1; level--) {
		if (xp >= LEVEL_THRESHOLDS[level]) {
			return level;
		}
	}
	return 1;
}

/** Get title for level */
export function getLevelTitle(level: number): string {
	return LEVEL_TITLES[Math.min(level, 10)] || 'Legend';
}

