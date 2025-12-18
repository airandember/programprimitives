// ============================================
// User Types
// ============================================

import type { SubscriptionTier } from './subscription';

/**
 * User entity
 */
export interface User {
	id: string;
	email: string;
	displayName: string;
	avatarUrl?: string;
	emailVerified: boolean;
	
	// Preferences
	preferredLanguage: Language;
	theme: 'light' | 'dark' | 'system';
	
	// Subscription (denormalized for quick access)
	subscriptionTier: SubscriptionTier;
	
	// Timestamps
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string;
}

/**
 * User for display (public info only)
 */
export interface UserPublic {
	id: string;
	displayName: string;
	avatarUrl?: string;
	level: number;
}

/**
 * Session info
 */
export interface Session {
	userId: string;
	expiresAt: string;
	createdAt: string;
}

/**
 * Supported programming languages
 */
export type Language = 
	| 'javascript'
	| 'python'
	| 'go'
	| 'typescript'
	| 'cpp'
	| 'html'
	| 'css';

/**
 * Language metadata
 */
export interface LanguageInfo {
	id: Language;
	name: string;
	icon: string;
	fileExtension: string;
	monacoLanguage: string;
}

// ============================================
// Auth Request/Response Types
// ============================================

export interface RegisterRequest {
	email: string;
	password: string;
	displayName: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	expiresAt: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

