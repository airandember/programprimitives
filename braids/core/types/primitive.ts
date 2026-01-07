// ============================================
// Primitive Types (Tools)
// ============================================

import type { Language } from './user';

/**
 * Tool Tier - The Craftsman's Journey
 * Tools are organized by conceptual complexity and dependency depth
 */
export type ToolTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ToolTierName = 
	| 'blueprints' // 0: Mental models, patterns, principles (the WHY)
	| 'stone'      // 1: Raw fundamentals
	| 'wood'       // 2: Structured basics  
	| 'bronze'     // 3: Data organization
	| 'iron'       // 4: Abstractions
	| 'steel'      // 5: Higher-order patterns
	| 'power'      // 6: Advanced concepts
	| 'precision'; // 7: Mastery-level

/**
 * Tool refinement stage (per-user progress on a tool)
 */
export type RefinementStage = 
	| 'unstarted'  // Haven't begun
	| 'stone'      // Basic understanding
	| 'wood'       // Comfortable with syntax
	| 'bronze'     // Can apply independently
	| 'iron'       // Solid proficiency
	| 'steel'      // Advanced patterns
	| 'mastered';  // Complete mastery

/**
 * Primitive category (legacy - used for grouping within tiers)
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
 * Core primitive entity (Tool)
 */
export interface Primitive {
	id: string;                          // URL-safe slug: 'for-loop'
	name: string;                        // Display name: 'For Loop'
	category: PrimitiveCategory;
	subcategory?: PrimitiveSubcategory;
	
	// Tool Tier (Craftsman's Journey)
	tier: ToolTier;                      // 1-7 tier number
	tierName: ToolTierName;              // 'stone', 'wood', etc.
	
	// Content
	description: string;                 // Brief description
	whyItMatters: string;               // Real-world importance
	bestPractices: string[];            // Do's
	pitfalls: string[];                 // Don'ts
	
	// Metadata
	difficulty: 1 | 2 | 3 | 4 | 5;       // Legacy difficulty (derived from tier)
	icon: string;                        // Emoji or icon ID
	prerequisites: string[];             // Primitive IDs
	related: string[];                   // Related primitive IDs
	
	// Access
	isPremium: boolean;
	isPublished?: boolean;
	
	// Ordering
	categoryOrder?: number;
	
	// Timestamps
	createdAt?: string;
	updatedAt?: string;
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

