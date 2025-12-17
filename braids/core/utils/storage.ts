// ============================================
// LocalStorage Utilities
// ============================================

/**
 * Safely get item from localStorage with JSON parsing
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
	if (typeof window === 'undefined') {
		return defaultValue;
	}
	
	try {
		const item = localStorage.getItem(key);
		if (item === null) {
			return defaultValue;
		}
		return JSON.parse(item) as T;
	} catch {
		console.warn(`Error reading localStorage key "${key}"`);
		return defaultValue;
	}
}

/**
 * Safely set item in localStorage with JSON stringification
 */
export function setStorageItem<T>(key: string, value: T): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.warn(`Error setting localStorage key "${key}"`, error);
		return false;
	}
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	
	try {
		localStorage.removeItem(key);
		return true;
	} catch {
		console.warn(`Error removing localStorage key "${key}"`);
		return false;
	}
}

/**
 * Clear all items with a prefix from localStorage
 */
export function clearStoragePrefix(prefix: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	
	const keysToRemove: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(prefix)) {
			keysToRemove.push(key);
		}
	}
	keysToRemove.forEach(key => localStorage.removeItem(key));
}

// ============================================
// Storage Keys
// ============================================

export const StorageKeys = {
	// Auth
	AUTH_TOKEN: 'pp_auth_token',
	
	// User preferences
	THEME: 'pp_theme',
	PREFERRED_LANGUAGE: 'pp_preferred_language',
	
	// Free zone
	FREE_ZONE_PROGRESS: 'pp_free_zone',
	
	// Exercise state (persisted across page refreshes)
	EXERCISE_CODE_PREFIX: 'pp_exercise_code_',
	
	// UI state
	SIDEBAR_COLLAPSED: 'pp_sidebar_collapsed',
	LAST_VIEWED_PRIMITIVE: 'pp_last_primitive',
} as const;

/**
 * Get exercise code from storage
 */
export function getExerciseCode(exerciseId: string, language: string): string | null {
	const key = `${StorageKeys.EXERCISE_CODE_PREFIX}${exerciseId}_${language}`;
	return getStorageItem<string | null>(key, null);
}

/**
 * Save exercise code to storage
 */
export function saveExerciseCode(exerciseId: string, language: string, code: string): void {
	const key = `${StorageKeys.EXERCISE_CODE_PREFIX}${exerciseId}_${language}`;
	setStorageItem(key, code);
}

/**
 * Clear exercise code from storage
 */
export function clearExerciseCode(exerciseId: string, language: string): void {
	const key = `${StorageKeys.EXERCISE_CODE_PREFIX}${exerciseId}_${language}`;
	removeStorageItem(key);
}

