// ============================================
// Types - Re-exports from core braid
// ============================================
// 
// This file re-exports types from the core braid.
// Components should import from here for consistent paths:
//   import type { User, Primitive, Exercise } from '$lib/types';
//

// Re-export all types from core braid
export type {
	// User & Auth
	User,
	UserPublic,
	Session,
	Language,
	LanguageInfo,
	RegisterRequest,
	LoginRequest,
	AuthResponse,
	ForgotPasswordRequest,
	ResetPasswordRequest,
	
	// Primitives
	Primitive,
	PrimitiveListItem,
	PrimitiveSyntax,
	PrimitiveCategory,
	PrimitiveSubcategory,
	CategoryInfo,
	PrimitiveQuery,
	
	// Exercises
	Exercise,
	ExerciseListItem,
	ExerciseDetail,
	ExerciseStarterCode,
	TestCase,
	TestResult,
	RunCodeRequest,
	RunCodeResponse,
	SubmitSolutionRequest,
	SubmitSolutionResponse,
	ExerciseQuery,
	
	// Progress
	UserProgress,
	PrimitiveMastery,
	MasteryDisplay,
	MasteryLevel,
	StreakInfo,
	ActivityEntry,
	ActivityType,
	ExerciseCompletion,
	ProgressAnalytics,
	DailyActivity,
	
	// Gamification
	UserXP,
	Achievement,
	AchievementRarity,
	AchievementCategory,
	AchievementTrigger,
	UserAchievement,
	AchievementDisplay,
	LeaderboardEntry,
	LeaderboardPeriod,
	Challenge,
	ChallengeType,
	UserChallenge,
	
	// Subscription
	SubscriptionTier,
	SubscriptionStatus,
	TierLimits,
	TierInfo,
	Subscription,
	PaymentRecord,
	UsageRecord,
	CheckoutRequest,
	CheckoutResponse,
	PortalResponse,
	
	// API
	ApiResponse,
	ApiError,
	ApiMeta,
	PaginationParams,
	SortParams,
	QueryParams,
	ErrorCode,
	
	// Free Zone
	FreeZoneProgress,
	FreeZoneExercise,
	FreeZonePrimitive,
	SignupPromptVariant,
	FreeZoneEvent,
	FreeZoneEventType,
} from '@braids/core/types';

// Re-export constants
export {
	ErrorCodes,
	MasteryLevelNames,
	LevelThresholds,
	LevelNames,
	Tiers,
	FREE_ZONE_STORAGE_KEY,
	FREE_ZONE_MAX_EXERCISES,
	FREE_ZONE_PRIMITIVES,
	DEFAULT_SIGNUP_PROMPT,
} from '@braids/core/types';
