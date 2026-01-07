// ============================================
// Progress Store - Track learning & detect patterns
// ============================================

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Types
// ============================================

export type ErrorType = 'syntax' | 'logic' | 'conceptual' | 'edge-case';
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface PrimitiveMastery {
	primitiveId: string;
	language: string;
	level: MasteryLevel;
	exercisesCompleted: number;
	exercisesAvailable: number;
	totalAttempts: number;
	averageScore: number;
	bestScore: number;
	commonErrors: ErrorType[];
	suggestedReview?: string;
	lastAttemptAt?: string;
}

export interface ErrorPattern {
	errorType: ErrorType;
	primitiveId: string;
	occurrences: number;
	lastOccurred: string;
	description: string;
	suggestion: string;
	relatedPrinciple: string;
}

export interface ActivityEntry {
	id: string;
	type: 'exercise_completed' | 'exercise_attempted' | 'primitive_mastered' | 'streak_milestone' | 'level_up';
	primitiveId?: string;
	exerciseId?: string;
	score?: number;
	xpEarned?: number;
	timestamp: string;
}

export interface UserProgress {
	userId: string;
	
	// Overall stats
	totalExercisesCompleted: number;
	totalExercisesAttempted: number;
	totalTimeSpentMinutes: number;
	totalXp: number;
	currentLevel: number;
	
	// Streaks
	currentDailyStreak: number;
	longestDailyStreak: number;
	lastActivityAt: string;
	
	// Per-primitive mastery
	mastery: PrimitiveMastery[];
	
	// Error tracking
	errorPatterns: ErrorPattern[];
	
	// Activity log
	recentActivity: ActivityEntry[];
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'pp_progress';

export const MASTERY_LEVELS = {
	0: { name: 'Unexplored', color: 'surface-600', description: 'Not started yet' },
	1: { name: 'Introduced', color: 'surface-500', description: 'First attempt made' },
	2: { name: 'Practicing', color: 'yellow-500', description: 'Getting the hang of it' },
	3: { name: 'Familiar', color: 'orange-500', description: 'Mostly correct' },
	4: { name: 'Proficient', color: 'primary-500', description: 'Consistently good' },
	5: { name: 'Mastered', color: 'accent-400', description: 'Expert level' },
};

export const ERROR_PRINCIPLES = {
	syntax: {
		name: 'Precision',
		description: 'Code is unforgiving. Double-check syntax before logic.',
		icon: '🔍',
	},
	logic: {
		name: 'Think Step-by-Step',
		description: 'Walk through your code line by line. What happens on each iteration?',
		icon: '🧠',
	},
	conceptual: {
		name: 'Understand Before Coding',
		description: "Re-read the primitive explanation. Try explaining it in your own words.",
		icon: '📚',
	},
	'edge-case': {
		name: 'Expect the Unexpected',
		description: "What's the simplest input? The weirdest? What if it's empty?",
		icon: '⚡',
	},
};

export const XP_PER_LEVEL = 500;

// ============================================
// Default State
// ============================================

const defaultProgress: UserProgress = {
	userId: 'guest',
	totalExercisesCompleted: 0,
	totalExercisesAttempted: 0,
	totalTimeSpentMinutes: 0,
	totalXp: 0,
	currentLevel: 1,
	currentDailyStreak: 0,
	longestDailyStreak: 0,
	lastActivityAt: new Date().toISOString(),
	mastery: [],
	errorPatterns: [],
	recentActivity: [],
};

// ============================================
// Storage Helpers (for offline cache only)
// ============================================

function loadCachedProgress(): UserProgress {
	if (!browser) return defaultProgress;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		console.error('Failed to load cached progress:', e);
	}
	
	return defaultProgress;
}

function cacheProgress(progress: UserProgress): void {
	if (!browser) return;
	
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
	} catch (e) {
		console.error('Failed to cache progress:', e);
	}
}

// ============================================
// API Helpers
// ============================================

async function fetchProgress(): Promise<Partial<UserProgress>> {
	try {
		const response = await fetch('/api/progress', {
			credentials: 'include'
		});
		if (!response.ok) {
			if (response.status === 401) return {}; // Not logged in
			throw new Error('Failed to fetch progress');
		}
		const json = await response.json();
		// API returns { success: true, data: {...} } - extract data
		const data = json && typeof json === 'object' && 'data' in json ? json.data : json;
		return data || {};
	} catch (e) {
		console.error('Failed to fetch progress:', e);
		return {};
	}
}

async function fetchMastery(): Promise<PrimitiveMastery[]> {
	try {
		const response = await fetch('/api/progress/primitives', {
			credentials: 'include'
		});
		if (!response.ok) {
			if (response.status === 401) return [];
			throw new Error('Failed to fetch mastery');
		}
		const json = await response.json();
		// API returns { success: true, data: [...] } - extract data
		const data = json && typeof json === 'object' && 'data' in json ? json.data : json;
		// Ensure data is an array before mapping
		if (!Array.isArray(data)) {
			return [];
		}
		// Map API response to our interface
		return data.map((m: any) => ({
			primitiveId: m.primitiveId,
			language: m.language || 'javascript',
			level: m.level || 0,
			exercisesCompleted: m.exercisesCompleted || 0,
			exercisesAvailable: m.exercisesAvailable || 0,
			totalAttempts: m.totalAttempts || 0,
			averageScore: m.averageScore || 0,
			bestScore: m.bestScore || 0,
			commonErrors: [],
		}));
	} catch (e) {
		console.error('Failed to fetch mastery:', e);
		return [];
	}
}

// ============================================
// Store
// ============================================

function createProgressStore() {
	// Start with defaults - API will populate real data
	const { subscribe, set, update } = writable<UserProgress>(defaultProgress);
	
	// Auto-cache locally (only after API has loaded real data)
	let initialized = false;
	subscribe((state) => {
		if (initialized) {
			cacheProgress(state);
		}
	});
	
	return {
		subscribe,
		
		/**
		 * Load progress from API
		 */
		loadFromApi: async () => {
			const [progressData, masteryData] = await Promise.all([
				fetchProgress(),
				fetchMastery()
			]);
			
			update(state => ({
				...state,
				userId: progressData.userId || state.userId,
				totalExercisesCompleted: progressData.totalExercisesCompleted ?? 0,
				totalExercisesAttempted: progressData.totalExercisesAttempted ?? 0,
				totalTimeSpentMinutes: progressData.totalTimeSpentMinutes ?? 0,
				totalXp: progressData.totalXp ?? 0,
				currentLevel: progressData.currentLevel ?? 1,
				currentDailyStreak: progressData.currentDailyStreak ?? 0,
				longestDailyStreak: progressData.longestDailyStreak ?? 0,
				mastery: masteryData,
				errorPatterns: [], // Reset - will be populated by real data
				recentActivity: [], // Reset - will be populated by real data
			}));
			initialized = true;
		},
		
		/**
		 * Record an exercise attempt
		 */
		recordAttempt: (params: {
			primitiveId: string;
			exerciseId: string;
			language: string;
			passed: boolean;
			score: number;
			errors?: ErrorType[];
			timeSpentSeconds: number;
		}) => {
			update(state => {
				const { primitiveId, exerciseId, language, passed, score, errors = [], timeSpentSeconds } = params;
				
				// Update totals
				state.totalExercisesAttempted++;
				state.totalTimeSpentMinutes += Math.round(timeSpentSeconds / 60);
				
				if (passed) {
					state.totalExercisesCompleted++;
				}
				
				// Calculate XP
				const baseXp = passed ? 50 : 10;
				const bonusXp = Math.floor(score / 10) * 5;
				const xpEarned = baseXp + bonusXp;
				state.totalXp += xpEarned;
				
				// Level up check
				const newLevel = Math.floor(state.totalXp / XP_PER_LEVEL) + 1;
				const leveledUp = newLevel > state.currentLevel;
				state.currentLevel = newLevel;
				
				// Update mastery
				let mastery = state.mastery.find(m => m.primitiveId === primitiveId && m.language === language);
				if (!mastery) {
					mastery = {
						primitiveId,
						language,
						level: 0,
						exercisesCompleted: 0,
						exercisesAvailable: 5, // Default
						totalAttempts: 0,
						averageScore: 0,
						bestScore: 0,
						commonErrors: [],
					};
					state.mastery.push(mastery);
				}
				
				mastery.totalAttempts++;
				if (passed) {
					mastery.exercisesCompleted++;
				}
				mastery.averageScore = Math.round(
					(mastery.averageScore * (mastery.totalAttempts - 1) + score) / mastery.totalAttempts
				);
				mastery.bestScore = Math.max(mastery.bestScore, score);
				mastery.lastAttemptAt = new Date().toISOString();
				
				// Update mastery level
				if (mastery.averageScore >= 95 && mastery.exercisesCompleted >= mastery.exercisesAvailable) {
					mastery.level = 5;
				} else if (mastery.averageScore >= 85 && mastery.exercisesCompleted >= 3) {
					mastery.level = 4;
				} else if (mastery.averageScore >= 70 && mastery.exercisesCompleted >= 2) {
					mastery.level = 3;
				} else if (mastery.exercisesCompleted >= 1) {
					mastery.level = 2;
				} else if (mastery.totalAttempts >= 1) {
					mastery.level = 1;
				}
				
				// Track errors
				for (const errorType of errors) {
					// Add to mastery common errors
					if (!mastery.commonErrors.includes(errorType)) {
						mastery.commonErrors.push(errorType);
					}
					
					// Update error patterns
					let pattern = state.errorPatterns.find(
						p => p.errorType === errorType && p.primitiveId === primitiveId
					);
					
					if (pattern) {
						pattern.occurrences++;
						pattern.lastOccurred = new Date().toISOString();
					} else {
						const principle = ERROR_PRINCIPLES[errorType];
						state.errorPatterns.push({
							errorType,
							primitiveId,
							occurrences: 1,
							lastOccurred: new Date().toISOString(),
							description: getErrorDescription(errorType, primitiveId),
							suggestion: getErrorSuggestion(errorType, primitiveId),
							relatedPrinciple: principle.name,
						});
					}
					
					// Suggest review if error is frequent
					if (mastery.commonErrors.length >= 2 || state.errorPatterns.find(p => p.occurrences >= 3)) {
						mastery.suggestedReview = getSuggestedReview(errorType, primitiveId);
					}
				}
				
				// Update streak
				const lastActivity = new Date(state.lastActivityAt);
				const now = new Date();
				const daysSinceLast = Math.floor((now.getTime() - lastActivity.getTime()) / 86400000);
				
				if (daysSinceLast === 0) {
					// Same day, no change
				} else if (daysSinceLast === 1) {
					state.currentDailyStreak++;
					state.longestDailyStreak = Math.max(state.longestDailyStreak, state.currentDailyStreak);
				} else {
					state.currentDailyStreak = 1;
				}
				
				state.lastActivityAt = now.toISOString();
				
				// Add activity
				state.recentActivity.unshift({
					id: `activity-${Date.now()}`,
					type: passed ? 'exercise_completed' : 'exercise_attempted',
					primitiveId,
					exerciseId,
					score,
					xpEarned,
					timestamp: now.toISOString(),
				});
				
				// Keep only last 50 activities
				state.recentActivity = state.recentActivity.slice(0, 50);
				
				// Add level up activity
				if (leveledUp) {
					state.recentActivity.unshift({
						id: `levelup-${Date.now()}`,
						type: 'level_up',
						xpEarned: 0,
						timestamp: now.toISOString(),
					});
				}
				
				return { ...state };
			});
		},
		
		/**
		 * Get mastery for a specific primitive
		 */
		getMastery: (primitiveId: string, language: string = 'javascript'): PrimitiveMastery | undefined => {
			const state = get({ subscribe });
			return state.mastery.find(m => m.primitiveId === primitiveId && m.language === language);
		},
		
		/**
		 * Get error patterns for a primitive
		 */
		getErrorsFor: (primitiveId: string): ErrorPattern[] => {
			const state = get({ subscribe });
			return state.errorPatterns.filter(p => p.primitiveId === primitiveId);
		},
		
		/**
		 * Get learning insights
		 */
		getInsights: (): { 
			weakAreas: PrimitiveMastery[]; 
			strongAreas: PrimitiveMastery[];
			frequentErrors: ErrorPattern[];
			recommendations: string[];
		} => {
			const state = get({ subscribe });
			
			const weakAreas = state.mastery
				.filter(m => m.level <= 2 && m.totalAttempts > 0)
				.sort((a, b) => a.averageScore - b.averageScore);
			
			const strongAreas = state.mastery
				.filter(m => m.level >= 4)
				.sort((a, b) => b.averageScore - a.averageScore);
			
			const frequentErrors = state.errorPatterns
				.filter(p => p.occurrences >= 2)
				.sort((a, b) => b.occurrences - a.occurrences);
			
			const recommendations: string[] = [];
			
			// Generate recommendations based on patterns
			if (frequentErrors.length > 0) {
				const topError = frequentErrors[0];
				recommendations.push(
					`Focus on ${ERROR_PRINCIPLES[topError.errorType].name}: ${topError.suggestion}`
				);
			}
			
			if (weakAreas.length > 0) {
				recommendations.push(
					`Practice more ${weakAreas[0].primitiveId.replace('-', ' ')} exercises`
				);
			}
			
			if (state.currentDailyStreak > 0 && state.currentDailyStreak < 7) {
				recommendations.push(
					`Keep your ${state.currentDailyStreak}-day streak going! ${7 - state.currentDailyStreak} more days until bonus XP`
				);
			}
			
			return { weakAreas, strongAreas, frequentErrors, recommendations };
		},
		
		/**
		 * Reset progress (for testing)
		 */
		reset: () => {
			set({ ...defaultProgress });
		},
	};
}

// ============================================
// Helper Functions
// ============================================

function getErrorDescription(errorType: ErrorType, primitiveId: string): string {
	const descriptions: Record<ErrorType, Record<string, string>> = {
		syntax: {
			default: 'Syntax errors in code structure',
		},
		logic: {
			'for-loop': 'Off-by-one errors in loop conditions',
			'while-loop': 'Infinite loop or wrong termination condition',
			conditionals: 'Incorrect comparison logic',
			default: 'Logic errors in code flow',
		},
		conceptual: {
			default: 'Misunderstanding of how this primitive works',
		},
		'edge-case': {
			arrays: 'Not handling empty arrays or bounds',
			functions: 'Not handling invalid inputs',
			default: 'Missing edge case handling',
		},
	};
	
	return descriptions[errorType][primitiveId] || descriptions[errorType].default;
}

function getErrorSuggestion(errorType: ErrorType, primitiveId: string): string {
	const suggestions: Record<ErrorType, Record<string, string>> = {
		syntax: {
			default: 'Double-check brackets, semicolons, and keywords',
		},
		logic: {
			'for-loop': 'Use < instead of <= when iterating to array.length',
			'while-loop': 'Make sure your condition will eventually be false',
			conditionals: 'Check your comparison operators (==, ===, >, <)',
			default: 'Walk through your code step by step',
		},
		conceptual: {
			default: 'Re-read the primitive explanation and examples',
		},
		'edge-case': {
			arrays: 'Always check if array.length > 0 before accessing elements',
			functions: 'Validate inputs at the start of your function',
			default: 'Consider: What if input is empty, null, or zero?',
		},
	};
	
	return suggestions[errorType][primitiveId] || suggestions[errorType].default;
}

function getSuggestedReview(errorType: ErrorType, primitiveId: string): string {
	const reviews: Record<ErrorType, string> = {
		syntax: 'Review syntax rules for this language',
		logic: `Practice step-by-step debugging with ${primitiveId.replace('-', ' ')}`,
		conceptual: `Re-read the ${primitiveId.replace('-', ' ')} explanation`,
		'edge-case': 'Practice with empty, null, and boundary inputs',
	};
	
	return reviews[errorType];
}

// ============================================
// Export Store
// ============================================

export const progress = createProgressStore();

// ============================================
// Derived Stores
// ============================================

/** Current level progress (0-100%) */
export const levelProgress = derived(progress, $p => {
	const xpInLevel = $p.totalXp % XP_PER_LEVEL;
	return Math.round((xpInLevel / XP_PER_LEVEL) * 100);
});

/** XP needed for next level */
export const xpToNextLevel = derived(progress, $p => {
	return XP_PER_LEVEL - ($p.totalXp % XP_PER_LEVEL);
});

/** Overall mastery percentage */
export const overallMastery = derived(progress, $p => {
	if ($p.mastery.length === 0) return 0;
	const totalLevels = $p.mastery.reduce((sum, m) => sum + m.level, 0);
	return Math.round((totalLevels / ($p.mastery.length * 5)) * 100);
});

/** Has active error patterns that need attention */
export const hasErrorsToAddress = derived(progress, $p => {
	return $p.errorPatterns.some(p => p.occurrences >= 3);
});

/** Get mastery for display */
export const masteryList = derived(progress, $p => 
	$p.mastery.sort((a, b) => b.level - a.level)
);

