// ============================================
// Primitive Types
// ============================================

import type { Language } from './user';

/**
 * Primitive category
 */
export type PrimitiveCategory = 
	| 'fundamentals'
	| 'data-structures'
	| 'functions'
	| 'advanced';

/**
 * Primitive subcategory
 */
export type PrimitiveSubcategory =
	| 'basics'
	| 'control-flow'
	| 'loops'
	| 'modularity'
	| 'linear'
	| 'associative'
	| 'patterns'
	| 'concurrency';

/**
 * Core primitive entity
 */
export interface Primitive {
	id: string;                          // URL-safe slug: 'for-loop'
	name: string;                        // Display name: 'For Loop'
	category: PrimitiveCategory;
	subcategory?: PrimitiveSubcategory;
	
	// Content
	description: string;                 // Brief description
	whyItMatters: string;               // Real-world importance
	bestPractices: string[];            // Do's
	pitfalls: string[];                 // Don'ts
	
	// Metadata
	difficulty: 1 | 2 | 3 | 4 | 5;
	icon: string;                        // Emoji or icon ID
	prerequisites: string[];             // Primitive IDs
	related: string[];                   // Related primitive IDs
	
	// Access
	isPremium: boolean;
	isPublished: boolean;
	
	// Ordering
	categoryOrder: number;
	
	// Timestamps
	createdAt: string;
	updatedAt: string;
}

/**
 * Primitive for list view (lighter)
 */
export interface PrimitiveListItem {
	id: string;
	name: string;
	category: PrimitiveCategory;
	description: string;
	difficulty: 1 | 2 | 3 | 4 | 5;
	icon: string;
	isPremium: boolean;
	exerciseCount: number;
}

/**
 * Language-specific syntax for a primitive
 */
export interface PrimitiveSyntax {
	primitiveId: string;
	language: Language;
	
	// Syntax content
	syntaxTemplate: string;              // Basic syntax pattern
	fullExample: string;                 // Complete working example
	explanation?: string;                // Line-by-line explanation
	variations?: string[];               // Alternative syntaxes
	
	// Output
	expectedOutput?: string;
}

/**
 * Category with metadata
 */
export interface CategoryInfo {
	id: PrimitiveCategory;
	name: string;
	icon: string;
	description: string;
	primitiveCount: number;
}

// ============================================
// Query Types
// ============================================

export interface PrimitiveQuery {
	category?: PrimitiveCategory;
	difficulty?: number;
	search?: string;
	language?: Language;
	isPremium?: boolean;
}

