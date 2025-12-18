// ============================================
// Exercise Validation Schemas
// ============================================

import { z } from 'zod';
import { codeSchema, languageSchema, uuidSchema } from './common';

/**
 * Run code request validation
 */
export const runCodeSchema = z.object({
	exerciseId: uuidSchema.optional(),
	language: languageSchema,
	code: codeSchema,
	input: z.string().max(10000).optional(),
});

export type RunCodeInput = z.infer<typeof runCodeSchema>;

/**
 * Submit solution request validation
 */
export const submitSolutionSchema = z.object({
	exerciseId: uuidSchema,
	language: languageSchema,
	code: codeSchema,
	hintsUsed: z.number().int().min(0).max(10).default(0),
	timeSpentSeconds: z.number().int().min(0).max(86400).default(0), // Max 24 hours
});

export type SubmitSolutionInput = z.infer<typeof submitSolutionSchema>;

/**
 * Start exercise request validation
 */
export const startExerciseSchema = z.object({
	exerciseId: uuidSchema,
	language: languageSchema,
});

export type StartExerciseInput = z.infer<typeof startExerciseSchema>;

/**
 * Get hint request validation
 */
export const getHintSchema = z.object({
	exerciseId: uuidSchema,
	hintLevel: z.number().int().min(1).max(5),
});

export type GetHintInput = z.infer<typeof getHintSchema>;

/**
 * Exercise query params
 */
export const exerciseQuerySchema = z.object({
	primitiveId: z.string().optional(),
	difficulty: z.coerce.number().int().min(1).max(5).optional(),
	completed: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
	language: languageSchema.optional(),
});

export type ExerciseQueryInput = z.infer<typeof exerciseQuerySchema>;

/**
 * Primitive query params
 */
export const primitiveQuerySchema = z.object({
	category: z.enum(['fundamentals', 'data-structures', 'functions', 'advanced']).optional(),
	difficulty: z.coerce.number().int().min(1).max(5).optional(),
	search: z.string().max(100).optional(),
	isPremium: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
});

export type PrimitiveQueryInput = z.infer<typeof primitiveQuerySchema>;

