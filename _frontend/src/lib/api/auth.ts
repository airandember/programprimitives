// ============================================
// Auth API Functions
// ============================================

import { ApiClient } from '@braids/core/api/client';
import type { 
	User, 
	AuthResponse, 
	RegisterRequest, 
	LoginRequest,
	ForgotPasswordRequest,
	ResetPasswordRequest 
} from '@braids/core/types';

// Create auth-specific API client
const authApi = new ApiClient({
	baseUrl: '/api',
	timeout: 30000,
});

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
	return authApi.post<AuthResponse>('/auth/register', data);
}

/**
 * Login with email/password
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
	return authApi.post<AuthResponse>('/auth/login', data);
}

/**
 * Logout current session
 */
export async function logout(): Promise<void> {
	return authApi.post<void>('/auth/logout');
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		return await authApi.get<User>('/auth/me');
	} catch {
		// Not authenticated
		return null;
	}
}

/**
 * Refresh auth tokens
 */
export async function refreshToken(): Promise<AuthResponse> {
	return authApi.post<AuthResponse>('/auth/refresh');
}

/**
 * Request password reset email
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
	return authApi.post<void>('/auth/forgot-password', data);
}

/**
 * Complete password reset
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
	return authApi.post<void>('/auth/reset-password', data);
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<void> {
	return authApi.get<void>(`/auth/verify-email/${token}`);
}

