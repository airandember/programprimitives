// API client for ProgramPrimitives backend
// Uses mock data when backend is unavailable

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

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

		const data: APIResponse<T> = await response.json();

		if (data.success) {
			return data.data || null;
		}

		console.error('API Error:', data.error);
		return null;
	} catch (error) {
		console.warn('API unavailable, using mock data');
		return null;
	}
}

export const api = {
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

	// Progress
	getProgress: () => fetchAPI('/api/progress'),
	getMastery: () => fetchAPI('/api/progress/primitives'),

	// Gamification
	getAchievements: () => fetchAPI('/api/achievements'),
	getLeaderboard: (period: string) => fetchAPI(`/api/leaderboard/${period}`)
};

