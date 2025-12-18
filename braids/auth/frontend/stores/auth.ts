// ============================================
// Auth Store - Svelte store for authentication
// ============================================

import { writable, derived, get } from 'svelte/store';
import type { User } from '@braids/core/types';
import type { RegisterInput, LoginInput } from '@braids/core/validation';
import { registerSchema, loginSchema } from '@braids/core/validation';
import { ApiError, handleApiError } from '@braids/core/api';
import * as authApi from '../api/auth';

// ============================================
// State
// ============================================

export const user = writable<User | null>(null);
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const isInitialized = writable(false);

// ============================================
// Derived Stores
// ============================================

export const isAuthenticated = derived(user, ($user) => $user !== null);

export const isPremium = derived(user, ($user) => 
	$user !== null && $user.subscriptionTier !== 'free'
);

export const subscriptionTier = derived(user, ($user) => 
	$user?.subscriptionTier ?? 'free'
);

// ============================================
// Actions
// ============================================

/**
 * Initialize auth state (call on app load)
 */
export async function initAuth(): Promise<void> {
	if (get(isInitialized)) return;
	
	isLoading.set(true);
	error.set(null);
	
	try {
		const currentUser = await authApi.getCurrentUser();
		user.set(currentUser);
	} catch (err) {
		// Silently fail - user just isn't logged in
		user.set(null);
	} finally {
		isLoading.set(false);
		isInitialized.set(true);
	}
}

/**
 * Register a new user
 */
export async function register(input: RegisterInput): Promise<{ success: boolean; error?: string }> {
	// Validate input
	const result = registerSchema.safeParse(input);
	if (!result.success) {
		const firstError = result.error.errors[0]?.message ?? 'Invalid input';
		error.set(firstError);
		return { success: false, error: firstError };
	}
	
	isLoading.set(true);
	error.set(null);
	
	try {
		const response = await authApi.register(result.data);
		user.set(response.user);
		return { success: true };
	} catch (err) {
		const message = handleApiError(err);
		error.set(message);
		return { success: false, error: message };
	} finally {
		isLoading.set(false);
	}
}

/**
 * Login with email/password
 */
export async function login(input: LoginInput): Promise<{ success: boolean; error?: string }> {
	// Validate input
	const result = loginSchema.safeParse(input);
	if (!result.success) {
		const firstError = result.error.errors[0]?.message ?? 'Invalid input';
		error.set(firstError);
		return { success: false, error: firstError };
	}
	
	isLoading.set(true);
	error.set(null);
	
	try {
		const response = await authApi.login(result.data);
		user.set(response.user);
		return { success: true };
	} catch (err) {
		const message = handleApiError(err);
		error.set(message);
		return { success: false, error: message };
	} finally {
		isLoading.set(false);
	}
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
	isLoading.set(true);
	error.set(null);
	
	try {
		await authApi.logout();
	} catch {
		// Ignore errors - clear local state anyway
	} finally {
		user.set(null);
		isLoading.set(false);
	}
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
	isLoading.set(true);
	error.set(null);
	
	try {
		await authApi.forgotPassword({ email });
		return { success: true };
	} catch (err) {
		const message = handleApiError(err);
		error.set(message);
		return { success: false, error: message };
	} finally {
		isLoading.set(false);
	}
}

/**
 * Complete password reset
 */
export async function resetPassword(token: string, password: string): Promise<{ success: boolean; error?: string }> {
	isLoading.set(true);
	error.set(null);
	
	try {
		await authApi.resetPassword({ token, password });
		return { success: true };
	} catch (err) {
		const message = handleApiError(err);
		error.set(message);
		return { success: false, error: message };
	} finally {
		isLoading.set(false);
	}
}

/**
 * Clear any auth errors
 */
export function clearError(): void {
	error.set(null);
}

/**
 * Update user in store (e.g., after profile update)
 */
export function updateUser(updates: Partial<User>): void {
	user.update(current => {
		if (!current) return null;
		return { ...current, ...updates };
	});
}

