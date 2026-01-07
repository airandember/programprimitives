// ============================================
// Tool Tiers - The Craftsman's Journey
// ============================================

import type { ToolTier, ToolTierName, RefinementStage } from '../types/primitive';

/**
 * Tool Tier metadata for the Craftsman's Journey
 */
export interface TierInfo {
	tier: ToolTier;
	name: ToolTierName;
	displayName: string;
	icon: string;
	color: string;           // Tailwind color class
	bgGradient: string;      // Gradient for cards/headers
	description: string;
	unlockMessage: string;   // Message when tier is unlocked
}

/**
 * All tool tiers in progression order
 */
export const TOOL_TIERS: TierInfo[] = [
	{
		tier: 0,
		name: 'blueprints',
		displayName: 'Blueprints',
		icon: '📐',
		color: 'text-sky-400',
		bgGradient: 'from-sky-600/20 to-sky-800/20',
		description: 'Mental models & principles - understand the WHY before the HOW',
		unlockMessage: 'Start with the foundations that every tool is built upon',
	},
	{
		tier: 1,
		name: 'stone',
		displayName: 'Stone Tools',
		icon: '🪨',
		color: 'text-stone-400',
		bgGradient: 'from-stone-600/20 to-stone-800/20',
		description: 'Raw fundamentals - the bedrock of programming',
		unlockMessage: 'Begin your journey with the most fundamental concepts',
	},
	{
		tier: 2,
		name: 'wood',
		displayName: 'Wood Tools',
		icon: '🪵',
		color: 'text-amber-600',
		bgGradient: 'from-amber-600/20 to-amber-800/20',
		description: 'Structured basics - control flow and iteration',
		unlockMessage: 'You\'ve mastered the basics! Time for structured programming.',
	},
	{
		tier: 3,
		name: 'bronze',
		displayName: 'Bronze Tools',
		icon: '🔩',
		color: 'text-orange-500',
		bgGradient: 'from-orange-500/20 to-orange-700/20',
		description: 'Data organization - collections and structures',
		unlockMessage: 'Excellent progress! Learn to organize and structure data.',
	},
	{
		tier: 4,
		name: 'iron',
		displayName: 'Iron Tools',
		icon: '⚙️',
		color: 'text-slate-400',
		bgGradient: 'from-slate-500/20 to-slate-700/20',
		description: 'Abstractions - modularity and scope',
		unlockMessage: 'Strong foundation built! Time for powerful abstractions.',
	},
	{
		tier: 5,
		name: 'steel',
		displayName: 'Steel Tools',
		icon: '🔧',
		color: 'text-blue-400',
		bgGradient: 'from-blue-500/20 to-blue-700/20',
		description: 'Higher-order patterns - functional programming',
		unlockMessage: 'Advanced territory! Master higher-order thinking.',
	},
	{
		tier: 6,
		name: 'power',
		displayName: 'Power Tools',
		icon: '⚡',
		color: 'text-purple-400',
		bgGradient: 'from-purple-500/20 to-purple-700/20',
		description: 'Advanced concepts - async, recursion, generators',
		unlockMessage: 'Near-master level! Tackle the most powerful concepts.',
	},
	{
		tier: 7,
		name: 'precision',
		displayName: 'Precision Tools',
		icon: '🎯',
		color: 'text-rose-400',
		bgGradient: 'from-rose-500/20 to-rose-700/20',
		description: 'Mastery-level - optimization and algorithms',
		unlockMessage: 'Elite tier! Competition-level precision and optimization.',
	},
];

/**
 * Refinement stages for user progress on individual tools
 */
export interface RefinementInfo {
	stage: RefinementStage;
	displayName: string;
	icon: string;
	color: string;
	description: string;
	percentage: number;  // Progress percentage (0-100)
}

export const REFINEMENT_STAGES: RefinementInfo[] = [
	{
		stage: 'unstarted',
		displayName: 'Not Started',
		icon: '○',
		color: 'text-surface-600',
		description: 'Haven\'t begun learning this tool',
		percentage: 0,
	},
	{
		stage: 'stone',
		displayName: 'Stone',
		icon: '🪨',
		color: 'text-stone-400',
		description: 'Basic understanding of the concept',
		percentage: 17,
	},
	{
		stage: 'wood',
		displayName: 'Wood',
		icon: '🪵',
		color: 'text-amber-600',
		description: 'Comfortable with the syntax',
		percentage: 33,
	},
	{
		stage: 'bronze',
		displayName: 'Bronze',
		icon: '🔩',
		color: 'text-orange-500',
		description: 'Can apply independently',
		percentage: 50,
	},
	{
		stage: 'iron',
		displayName: 'Iron',
		icon: '⚙️',
		color: 'text-slate-400',
		description: 'Solid proficiency',
		percentage: 67,
	},
	{
		stage: 'steel',
		displayName: 'Steel',
		icon: '🔧',
		color: 'text-blue-400',
		description: 'Advanced pattern usage',
		percentage: 83,
	},
	{
		stage: 'mastered',
		displayName: 'Mastered',
		icon: '✨',
		color: 'text-yellow-400',
		description: 'Complete mastery achieved',
		percentage: 100,
	},
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get tier info by tier number
 */
export function getTierByNumber(tier: ToolTier): TierInfo {
	return TOOL_TIERS.find(t => t.tier === tier) || TOOL_TIERS[0];
}

/**
 * Get tier info by tier name
 */
export function getTierByName(name: ToolTierName): TierInfo {
	return TOOL_TIERS.find(t => t.name === name) || TOOL_TIERS[0];
}

/**
 * Get refinement info by stage
 */
export function getRefinementStage(stage: RefinementStage): RefinementInfo {
	return REFINEMENT_STAGES.find(r => r.stage === stage) || REFINEMENT_STAGES[0];
}

/**
 * Check if a tier is unlocked based on previous tier completion
 */
export function isTierUnlocked(tier: ToolTier, completedTiers: ToolTier[]): boolean {
	if (tier === 0) return true; // Blueprints always unlocked
	return completedTiers.includes((tier - 1) as ToolTier);
}

/**
 * Get the next tier in progression
 */
export function getNextTier(currentTier: ToolTier): TierInfo | null {
	const next = currentTier + 1;
	if (next > 7) return null;
	return getTierByNumber(next as ToolTier);
}

/**
 * Map tier number to CSS color classes
 */
export function getTierColorClass(tier: ToolTier): string {
	const colors: Record<ToolTier, string> = {
		0: 'from-sky-500 to-sky-700',
		1: 'from-stone-500 to-stone-700',
		2: 'from-amber-500 to-amber-700',
		3: 'from-orange-500 to-orange-700',
		4: 'from-slate-400 to-slate-600',
		5: 'from-blue-400 to-blue-600',
		6: 'from-purple-400 to-purple-600',
		7: 'from-rose-400 to-rose-600',
	};
	return colors[tier];
}
