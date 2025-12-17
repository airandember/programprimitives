// ============================================
// API Types - Request/Response Contracts
// ============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: ApiError;
	meta?: ApiMeta;
}

/**
 * API error structure
 */
export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, string[]>;
}

/**
 * Pagination metadata
 */
export interface ApiMeta {
	page?: number;
	limit?: number;
	total?: number;
	hasMore?: boolean;
}

/**
 * Paginated request params
 */
export interface PaginationParams {
	page?: number;
	limit?: number;
}

/**
 * Sort params
 */
export interface SortParams {
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * Common query params
 */
export interface QueryParams extends PaginationParams, SortParams {
	search?: string;
	filter?: Record<string, string>;
}

// ============================================
// Error Codes
// ============================================

export const ErrorCodes = {
	// General
	INTERNAL_ERROR: 'INTERNAL_ERROR',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	NOT_FOUND: 'NOT_FOUND',
	FORBIDDEN: 'FORBIDDEN',
	
	// Auth
	UNAUTHORIZED: 'UNAUTHORIZED',
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	EMAIL_TAKEN: 'EMAIL_TAKEN',
	SESSION_EXPIRED: 'SESSION_EXPIRED',
	INVALID_TOKEN: 'INVALID_TOKEN',
	
	// Exercises
	EXERCISE_NOT_FOUND: 'EXERCISE_NOT_FOUND',
	INVALID_SOLUTION: 'INVALID_SOLUTION',
	EXECUTION_TIMEOUT: 'EXECUTION_TIMEOUT',
	EXECUTION_ERROR: 'EXECUTION_ERROR',
	
	// Subscription
	SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
	TIER_REQUIRED: 'TIER_REQUIRED',
	PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

