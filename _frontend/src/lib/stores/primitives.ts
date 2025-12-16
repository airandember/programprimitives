import { writable, derived } from 'svelte/store';
import { mockPrimitives } from '$lib/mock-data';
import type { Primitive } from '$lib/types';

// Stores
export const primitives = writable<Primitive[]>(mockPrimitives);
export const currentPrimitive = writable<Primitive | null>(null);
export const selectedLanguage = writable<string>('javascript');
export const isLoadingPrimitives = writable(false);

// Categories
export const categories = [
	{ id: 'fundamentals', name: 'Fundamentals', icon: '🎯', count: 6 },
	{ id: 'data-structures', name: 'Data Structures', icon: '📊', count: 2 },
	{ id: 'advanced', name: 'Advanced', icon: '🚀', count: 2 }
];

// Supported languages
export const supportedLanguages = [
	{ id: 'javascript', name: 'JavaScript', icon: '🟨' },
	{ id: 'python', name: 'Python', icon: '🐍' },
	{ id: 'go', name: 'Go', icon: '🔵' },
	{ id: 'typescript', name: 'TypeScript', icon: '🔷' },
	{ id: 'cpp', name: 'C++', icon: '⚙️' }
];

// Derived stores
export const primitivesByCategory = derived(primitives, ($primitives) => {
	const byCategory: Record<string, Primitive[]> = {};
	for (const primitive of $primitives) {
		if (!byCategory[primitive.category]) {
			byCategory[primitive.category] = [];
		}
		byCategory[primitive.category].push(primitive);
	}
	return byCategory;
});

// Actions
export function loadPrimitives(): void {
	// Using mock data for now
	primitives.set(mockPrimitives);
}

export function loadPrimitive(id: string): void {
	const found = mockPrimitives.find(p => p.id === id);
	currentPrimitive.set(found || null);
}

export function setLanguage(lang: string): void {
	selectedLanguage.set(lang);
}
