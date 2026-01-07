// ============================================
// Tools (Primitives) Store - Svelte store for tools catalog
// The Craftsman's Journey
// ============================================

import { writable, derived } from 'svelte/store';
import type { Primitive, PrimitiveSyntax, ToolTier } from '@braids/core/types';
import { TOOL_TIERS, type TierInfo } from '@braids/core/constants';
import { 
	ALL_PRIMITIVES, 
	ALL_SYNTAX, 
	CATEGORIES,
	getPrimitiveById,
	getPrimitivesByCategory,
	getFreePrimitives,
	getSyntax,
} from '../data/primitives';

// ============================================
// State
// ============================================

export const primitives = writable<Primitive[]>(ALL_PRIMITIVES);
export const isLoading = writable(false);
export const error = writable<string | null>(null);
export const selectedLanguage = writable<string>('javascript');
export const searchQuery = writable<string>('');
export const selectedCategory = writable<string | null>(null);
export const selectedTier = writable<ToolTier | null>(null);

// ============================================
// Derived Stores
// ============================================

/** Get primitives filtered by category, tier, and search */
export const filteredPrimitives = derived(
	[primitives, selectedCategory, selectedTier, searchQuery],
	([$primitives, $category, $tier, $query]) => {
		let result = $primitives;
		
		// Filter by category
		if ($category) {
			result = result.filter(p => p.category === $category);
		}
		
		// Filter by tier
		if ($tier) {
			result = result.filter(p => p.tier === $tier);
		}
		
		// Filter by search query
		if ($query) {
			const q = $query.toLowerCase();
			result = result.filter(p => 
				p.name.toLowerCase().includes(q) ||
				p.description.toLowerCase().includes(q) ||
				p.category.toLowerCase().includes(q) ||
				p.tierName?.toLowerCase().includes(q)
			);
		}
		
		return result;
	}
);

/** Get primitives grouped by category */
export const primitivesByCategory = derived(primitives, ($primitives) => {
	const grouped: Record<string, Primitive[]> = {};
	
	for (const category of CATEGORIES) {
		grouped[category.id] = $primitives.filter(p => p.category === category.id);
	}
	
	return grouped;
});

/** Get primitives grouped by tier - The Craftsman's Journey */
export const primitivesByTier = derived(primitives, ($primitives) => {
	const grouped: Record<number, { tier: TierInfo; tools: Primitive[] }> = {};
	
	for (const tierInfo of TOOL_TIERS) {
		const tools = $primitives.filter(p => p.tier === tierInfo.tier);
		if (tools.length > 0) {
			grouped[tierInfo.tier] = { tier: tierInfo, tools };
		}
	}
	
	return grouped;
});

/** Get tiers with tool counts */
export const tiersWithCounts = derived(primitives, ($primitives) => {
	return TOOL_TIERS.map(tier => ({
		...tier,
		count: $primitives.filter(p => p.tier === tier.tier).length,
		tools: $primitives.filter(p => p.tier === tier.tier),
	}));
});

/** Get free primitives only */
export const freePrimitives = derived(primitives, ($primitives) => 
	$primitives.filter(p => !p.isPremium)
);

/** Get premium primitives only */
export const premiumPrimitives = derived(primitives, ($primitives) => 
	$primitives.filter(p => p.isPremium)
);

/** Categories with counts */
export const categoriesWithCounts = derived(primitives, ($primitives) => {
	return CATEGORIES.map(cat => ({
		...cat,
		count: $primitives.filter(p => p.category === cat.id).length,
	}));
});

// ============================================
// Actions
// ============================================

/**
 * Load primitives (from API in production)
 */
export async function loadPrimitives(): Promise<void> {
	isLoading.set(true);
	error.set(null);
	
	try {
		// For now, use static data
		// In production: const data = await api.get('/primitives');
		primitives.set(ALL_PRIMITIVES);
	} catch (err) {
		error.set('Failed to load primitives');
		console.error('Error loading primitives:', err);
	} finally {
		isLoading.set(false);
	}
}

/**
 * Get a single primitive by ID
 */
export function getPrimitive(id: string): Primitive | undefined {
	return getPrimitiveById(id);
}

/**
 * Get syntax for a primitive in a specific language
 */
export function getPrimitiveSyntax(primitiveId: string, language: string): PrimitiveSyntax | undefined {
	return getSyntax(primitiveId, language);
}

/**
 * Get all available syntax for a primitive
 */
export function getAllSyntax(primitiveId: string): Record<string, PrimitiveSyntax> | undefined {
	return ALL_SYNTAX[primitiveId];
}

/**
 * Set the selected language for syntax examples
 */
export function setLanguage(language: string): void {
	selectedLanguage.set(language);
}

/**
 * Set the search query
 */
export function setSearchQuery(query: string): void {
	searchQuery.set(query);
}

/**
 * Set the selected category filter
 */
export function setCategory(category: string | null): void {
	selectedCategory.set(category);
}

/**
 * Set the selected tier filter
 */
export function setTier(tier: ToolTier | null): void {
	selectedTier.set(tier);
}

/**
 * Clear all filters
 */
export function clearFilters(): void {
	searchQuery.set('');
	selectedCategory.set(null);
	selectedTier.set(null);
}

// ============================================
// Exports
// ============================================

export { CATEGORIES };
export { TOOL_TIERS };

