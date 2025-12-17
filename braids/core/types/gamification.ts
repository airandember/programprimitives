// ============================================
// Gamification Types
// ============================================

/**
 * User XP and level
 */
export interface UserXP {
	userId: string;
	totalXp: number;
	currentLevel: number;
	xpToNextLevel: number;
	levelProgress: number;          // 0-100 percentage
}

/**
 * Level thresholds
 */
export const LevelThresholds: Record<number, number> = {
	1: 0,
	5: 500,
	10: 2000,
	20: 8000,
	35: 25000,
	50: 60000,
	100: 200000,
};

/**
 * Level names
 */
export const LevelNames: Record<number, string> = {
	1: 'Beginner',
	5: 'Learner',
	10: 'Practitioner',
	20: 'Developer',
	35: 'Expert',
	50: 'Master',
	100: 'Legend',
};

/**
 * Achievement rarity
 */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Achievement category
 */
export type AchievementCategory = 
	| 'milestone'      // Exercise counts
	| 'consistency'    // Streaks
	| 'mastery'        // Primitive mastery
	| 'skill'          // Special accomplishments
	| 'social';        // Community

/**
 * Achievement definition
 */
export interface Achievement {
	id: string;
	name: string;
	description: string;
	category: AchievementCategory;
	icon: string;
	xpReward: number;
	rarity: AchievementRarity;
	
	// Trigger condition (JSON)
	triggerCondition: AchievementTrigger;
	
	// Display
	isSecret: boolean;              // Hidden until unlocked
	
	createdAt: string;
}

/**
 * Achievement trigger types
 */
export type AchievementTrigger =
	| { type: 'exercises_completed'; count: number }
	| { type: 'streak'; days: number }
	| { type: 'primitive_mastery'; category?: string; level: number }
	| { type: 'languages_used'; count: number }
	| { type: 'time_under'; seconds: number }
	| { type: 'first_try_perfect'; count: number }
	| { type: 'no_hints'; count: number }
	| { type: 'level_reached'; level: number };

/**
 * User's unlocked achievement
 */
export interface UserAchievement {
	id: string;
	userId: string;
	achievementId: string;
	unlockedAt: string;
	notified: boolean;
}

/**
 * Achievement for display
 */
export interface AchievementDisplay {
	id: string;
	name: string;
	description: string;
	category: AchievementCategory;
	icon: string;
	xpReward: number;
	rarity: AchievementRarity;
	
	// User state
	isUnlocked: boolean;
	unlockedAt?: string;
	progress?: number;              // 0-100 for partial progress
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
	rank: number;
	userId: string;
	displayName: string;
	avatarUrl?: string;
	score: number;                  // XP or relevant metric
	level: number;
	
	// Highlight current user
	isCurrentUser?: boolean;
}

/**
 * Leaderboard period
 */
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'alltime';

/**
 * Challenge type
 */
export type ChallengeType = 'daily' | 'weekly' | 'special';

/**
 * Challenge definition
 */
export interface Challenge {
	id: string;
	type: ChallengeType;
	title: string;
	description: string;
	
	// Content
	exerciseIds: string[];
	primitiveId?: string;
	
	// Rewards
	xpReward: number;
	badgeId?: string;               // Special badge for completion
	
	// Timing
	startDate: string;
	endDate: string;
	timeLimit?: number;             // Minutes
	
	// Status
	isActive: boolean;
}

/**
 * User's challenge progress
 */
export interface UserChallenge {
	userId: string;
	challengeId: string;
	
	status: 'not_started' | 'in_progress' | 'completed' | 'expired';
	exercisesCompleted: string[];
	score?: number;
	
	startedAt?: string;
	completedAt?: string;
}

