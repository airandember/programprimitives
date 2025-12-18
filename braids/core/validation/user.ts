// ============================================
// User Validation Schemas
// ============================================

import { z } from 'zod';
import {
	emailSchema,
	passwordSchema,
	loginPasswordSchema,
	displayNameSchema,
	languageSchema,
	themeSchema,
} from './common';

/**
 * Registration form validation
 */
export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	displayName: displayNameSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login form validation
 */
export const loginSchema = z.object({
	email: emailSchema,
	password: loginPasswordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Forgot password form validation
 */
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password form validation
 */
export const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Reset token is required'),
	password: passwordSchema,
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Update profile form validation
 */
export const updateProfileSchema = z.object({
	displayName: displayNameSchema.optional(),
	preferredLanguage: languageSchema.optional(),
	theme: themeSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Change password form validation
 */
export const changePasswordSchema = z.object({
	currentPassword: loginPasswordSchema,
	newPassword: passwordSchema,
	confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
	message: 'New password must be different from current password',
	path: ['newPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

