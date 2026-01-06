// API client for ProgramPrimitives backend
// Uses same-origin in production, configurable for development

// In production, API is served from same origin (Go serves both)
// In development, API runs on port 8080
const API_URL = import.meta.env.VITE_API_URL || 
	(typeof window !== 'undefined' && window.location.hostname === 'localhost' 
		? 'http://localhost:8080' 
		: '');

interface APIResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
	try {
		const response = await fetch(`${API_URL}${endpoint}`, {
			...options,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			}
		});

		if (!response.ok) {
			console.error('API Error:', response.status, response.statusText);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.warn('API unavailable, using mock data');
		return null;
	}
}

export const api = {
	// Generic methods for admin and other APIs
	get: <T>(endpoint: string) => fetchAPI<T>(endpoint),
	
	post: <T>(endpoint: string, data?: any) =>
		fetchAPI<T>(endpoint, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		}),
	
	put: <T>(endpoint: string, data?: any) =>
		fetchAPI<T>(endpoint, {
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined
		}),
	
	delete: <T>(endpoint: string) =>
		fetchAPI<T>(endpoint, { method: 'DELETE' }),

	// Auth
	login: (email: string, password: string) =>
		fetchAPI('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		}),

	register: (data: { email: string; password: string; displayName: string }) =>
		fetchAPI('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(data)
		}),

	logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),

	getMe: () => fetchAPI('/api/auth/me'),

	// Primitives
	getPrimitives: () => fetchAPI('/api/primitives'),
	getPrimitive: (id: string) => fetchAPI(`/api/primitives/${id}`),
	getSyntax: (primitiveId: string, language: string) =>
		fetchAPI(`/api/primitives/${primitiveId}/syntax/${language}`),

	// Exercises
	getExercises: (primitiveId?: string) =>
		fetchAPI(`/api/exercises${primitiveId ? `?primitive=${primitiveId}` : ''}`),
	getExercise: (id: string) => fetchAPI(`/api/exercises/${id}`),
	runCode: (exerciseId: string, code: string, language: string) =>
		fetchAPI(`/api/exercises/${exerciseId}/run`, {
			method: 'POST',
			body: JSON.stringify({ code, language })
		}),
	submitSolution: (exerciseId: string, code: string, language: string, hintsUsed: number) =>
		fetchAPI(`/api/exercises/${exerciseId}/submit`, {
			method: 'POST',
			body: JSON.stringify({ code, language, hintsUsed })
		}),

	// Sandbox
	runSandbox: (code: string, language: string) =>
		fetchAPI('/api/sandbox/run', {
			method: 'POST',
			body: JSON.stringify({ code, language })
		}),

	// Progress
	getProgress: () => fetchAPI('/api/progress'),
	getMastery: () => fetchAPI('/api/progress/primitives'),

	// Gamification
	getAchievements: () => fetchAPI('/api/achievements'),
	getLeaderboard: (period: string) => fetchAPI(`/api/leaderboard/${period}`)
};
