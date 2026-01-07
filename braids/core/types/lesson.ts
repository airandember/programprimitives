// ============================================
// Lesson Types - Three-Phase Learning Structure
// ============================================

import type { ToolTier, ToolTierName } from './primitive';

/**
 * Lesson Phase - The three-phase learning structure
 */
export type LessonPhase = 'blueprint' | 'crafting' | 'mastery';

/**
 * Lesson status for user progress
 */
export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'completed';

/**
 * Individual lesson entity
 */
export interface Lesson {
	id: string;
	toolId: string;
	slug: string;                    // URL-safe: 'off-by-one'
	title: string;                   // 'Off-By-One Errors'
	description: string;             // Brief description
	
	// Phase structure
	phase: LessonPhase;              // 'blueprint', 'crafting', 'mastery'
	phaseOrder: number;              // Order within phase (1, 2, 3...)
	sequenceOrder: number;           // Overall order in tool
	
	// Metaphor visual
	metaphorProgress?: string;       // "Drawing the axle"
	
	// Content
	contentMarkdown?: string;        // Full lesson content
	estimatedMinutes: number;        // Time estimate
	difficultyModifier: number;      // Added to tool base difficulty
	
	// Access
	isPremium: boolean;
	isPublished: boolean;
	
	// Timestamps
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Lesson with user progress
 */
export interface LessonWithProgress extends Lesson {
	status: LessonStatus;
	startedAt?: string;
	completedAt?: string;
	exercisesCompleted: number;
	exercisesTotal: number;
	bestScore?: number;
	attempts: number;
}

/**
 * Tool metaphor - The physical tool representation
 */
export interface ToolMetaphor {
	id: string;
	toolId: string;
	metaphorName: string;            // 'Counting Wheel'
	metaphorIcon: string;            // '🔄'
	
	// Three progression stages
	stage1Name: string;              // 'Tally stick'
	stage1Description?: string;
	stage2Name: string;              // 'Abacus'
	stage2Description?: string;
	stage3Name: string;              // 'Mechanical counter'
	stage3Description?: string;
	
	// Visual descriptions for UI
	blueprintVisual?: string;        // "Drawing the counting wheel design"
	craftingVisual?: string;         // "Building your counting wheel"
	masteryVisual?: string;          // "Hardening the tool"
}

/**
 * Language documentation citation
 */
export interface LanguageDoc {
	id: string;
	languageId: string;              // 'javascript', 'python', 'go'
	toolId: string;                  // 'for-loop', 'variables'
	
	docUrl: string;                  // Full URL to official docs
	docTitle: string;                // 'for - JavaScript | MDN'
	docSource: string;               // 'MDN', 'Python Docs', 'Go Docs'
	
	officialSyntax?: string;         // Canonical syntax from docs
	notes?: string;                  // Special notes
	displayOrder: number;            // For multiple doc references
}

/**
 * Phase info for UI display
 */
export interface PhaseInfo {
	phase: LessonPhase;
	displayName: string;
	icon: string;
	color: string;
	description: string;
}

/**
 * All phase definitions
 */
export const LESSON_PHASES: PhaseInfo[] = [
	{
		phase: 'blueprint',
		displayName: 'Blueprint',
		icon: '📐',
		color: 'text-sky-400',
		description: 'Understanding the WHY - mental models and principles',
	},
	{
		phase: 'crafting',
		displayName: 'Crafting',
		icon: '🔨',
		color: 'text-amber-400',
		description: 'Building proficiency - hands-on practice and syntax',
	},
	{
		phase: 'mastery',
		displayName: 'Mastery',
		icon: '🔩',
		color: 'text-emerald-400',
		description: 'Solidifying knowledge - patterns and cross-language',
	},
];

// ============================================
// Helper Types
// ============================================

/**
 * Lessons grouped by phase
 */
export interface LessonsByPhase {
	blueprint: Lesson[];
	crafting: Lesson[];
	mastery: Lesson[];
}

/**
 * Tool with lessons and metaphor
 */
export interface ToolWithLessons {
	toolId: string;
	toolName: string;
	tier: ToolTier;
	tierName: ToolTierName;
	metaphor: ToolMetaphor;
	lessons: LessonsByPhase;
	totalLessons: number;
	
	// Per-language docs
	docs: Record<string, LanguageDoc[]>; // keyed by languageId
}

/**
 * User progress on lessons for a tool
 */
export interface ToolLessonProgress {
	toolId: string;
	
	// Phase completion
	blueprintCompleted: number;
	blueprintTotal: number;
	craftingCompleted: number;
	craftingTotal: number;
	masteryCompleted: number;
	masteryTotal: number;
	
	// Overall
	totalCompleted: number;
	totalLessons: number;
	currentPhase: LessonPhase;
	currentLesson?: string;          // Current lesson ID
	
	// Metaphor stage (derived from progress)
	metaphorStage: 1 | 2 | 3;        // Which metaphor image to show
}
