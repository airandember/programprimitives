// ============================================
// Primitives Store - Re-exports from primitives braid
// ============================================
// 
// Components should import from here:
//   import { primitives, getPrimitive } from '$lib/stores/primitives';
//

export {
	primitives,
	isLoading,
	error,
	selectedLanguage,
	searchQuery,
	selectedCategory,
	filteredPrimitives,
	primitivesByCategory,
	freePrimitives,
	premiumPrimitives,
	categoriesWithCounts,
	loadPrimitives,
	getPrimitive,
	getPrimitiveSyntax,
	getAllSyntax,
	setLanguage,
	setSearchQuery,
	setCategory,
	clearFilters,
	CATEGORIES,
} from '@braids/primitives/frontend/stores/primitives';
