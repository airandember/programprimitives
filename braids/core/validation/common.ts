// ============================================
// Common Validation Schemas
// ============================================

import { z } from 'zod';

/**
 * Email validation
 */
export const emailSchema = z
	.string()
	.min(1, 'Email is required')
	.email('Please enter a valid email address')
	.max(255, 'Email is too long');

/**
 * Password validation
 * - At least 8 characters
 * - At least one uppercase
 * - At least one lowercase
 * - At least one number
 */
export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(128, 'Password is too long')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Simple password (for login - no complexity requirements)
 */
export const loginPasswordSchema = z
	.string()
	.min(1, 'Password is required')
	.max(128, 'Password is too long');

/**
 * Display name validation
 */
export const displayNameSchema = z
	.string()
	.min(2, 'Name must be at least 2 characters')
	.max(50, 'Name is too long')
	.regex(/^[a-zA-Z0-9_\- ]+$/, 'Name can only contain letters, numbers, spaces, underscores, and hyphens');

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Slug validation (URL-safe string)
 */
export const slugSchema = z
	.string()
	.min(1, 'Slug is required')
	.max(100, 'Slug is too long')
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only');

/**
 * Pagination params
 */
export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Sort params
 */
export const sortSchema = z.object({
	sortBy: z.string().optional(),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Search params
 */
export const searchSchema = z.object({
	search: z.string().max(100).optional(),
});

/**
 * Combined query params
 */
export const queryParamsSchema = paginationSchema.merge(sortSchema).merge(searchSchema);

/**
 * Language enum
 */
export const languageSchema = z.enum([
	'javascript',
	'typescript',
	'python',
	'go',
	'cpp',
	'html',
	'css',
]);

/**
 * Theme enum
 */
export const themeSchema = z.enum(['light', 'dark', 'system']);

/**
 * Difficulty level (1-5)
 */
export const difficultySchema = z.coerce.number().int().min(1).max(5);

/**
 * Code validation (for submissions)
 */
export const codeSchema = z
	.string()
	.min(1, 'Code cannot be empty')
	.max(50000, 'Code is too long (max 50KB)');

