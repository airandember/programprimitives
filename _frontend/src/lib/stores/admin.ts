// Admin store for managing admin state
import { writable, derived } from 'svelte/store';
import { user } from './auth';
import * as adminApi from '$lib/api/admin';

// Check if current user is admin
export const isAdmin = derived(user, ($user) => {
	return $user?.role === 'admin';
});

// Dashboard stats
interface DashboardStats {
	totalUsers: number;
	totalPrimitives: number;
	totalExercises: number;
	totalCompletions: number;
	activeUsersToday: number;
	activeUsersWeek: number;
	newUsersToday: number;
	newUsersWeek: number;
	premiumSubscribers: number;
}

const defaultStats: DashboardStats = {
	totalUsers: 0,
	totalPrimitives: 0,
	totalExercises: 0,
	totalCompletions: 0,
	activeUsersToday: 0,
	activeUsersWeek: 0,
	newUsersToday: 0,
	newUsersWeek: 0,
	premiumSubscribers: 0
};

function createAdminStore() {
	const { subscribe, set, update } = writable({
		stats: defaultStats,
		primitives: [] as any[],
		exercises: [] as any[],
		users: [] as any[],
		auditLog: [] as any[],
		loading: false,
		error: null as string | null
	});

	return {
		subscribe,
		
		async loadStats() {
			update(s => ({ ...s, loading: true }));
			try {
				const stats = await adminApi.getAdminStats();
				// Ensure stats has all required properties with defaults
				update(s => ({ 
					...s, 
					stats: stats ? {
						totalUsers: stats.totalUsers ?? 0,
						totalPrimitives: stats.totalPrimitives ?? 0,
						totalExercises: stats.totalExercises ?? 0,
						totalCompletions: stats.totalCompletions ?? 0,
						activeUsersToday: stats.activeUsersToday ?? 0,
						activeUsersWeek: stats.activeUsersWeek ?? 0,
						newUsersToday: stats.newUsersToday ?? 0,
						newUsersWeek: stats.newUsersWeek ?? 0,
						premiumSubscribers: stats.premiumSubscribers ?? 0,
					} : defaultStats,
					loading: false 
				}));
			} catch (e: any) {
				update(s => ({ ...s, stats: defaultStats, error: e.message, loading: false }));
			}
		},

		async loadPrimitives() {
			update(s => ({ ...s, loading: true }));
			try {
				const primitives = await adminApi.listPrimitives();
				update(s => ({ ...s, primitives: Array.isArray(primitives) ? primitives : [], loading: false }));
			} catch (e: any) {
				update(s => ({ ...s, primitives: [], error: e.message, loading: false }));
			}
		},

		async createPrimitive(data: adminApi.PrimitiveInput) {
			const result = await adminApi.createPrimitive(data);
			await this.loadPrimitives();
			return result;
		},

		async updatePrimitive(id: string, data: adminApi.PrimitiveInput) {
			const result = await adminApi.updatePrimitive(id, data);
			await this.loadPrimitives();
			return result;
		},

		async deletePrimitive(id: string) {
			await adminApi.deletePrimitive(id);
			await this.loadPrimitives();
		},

		async loadExercises(primitiveId?: string) {
			update(s => ({ ...s, loading: true }));
			try {
				const exercises = await adminApi.listExercises(primitiveId);
				update(s => ({ ...s, exercises: Array.isArray(exercises) ? exercises : [], loading: false }));
			} catch (e: any) {
				update(s => ({ ...s, exercises: [], error: e.message, loading: false }));
			}
		},

		async createExercise(data: adminApi.ExerciseInput) {
			const result = await adminApi.createExercise(data);
			await this.loadExercises();
			return result;
		},

		async updateExercise(id: string, data: adminApi.ExerciseInput) {
			const result = await adminApi.updateExercise(id, data);
			await this.loadExercises();
			return result;
		},

		async deleteExercise(id: string) {
			await adminApi.deleteExercise(id);
			await this.loadExercises();
		},

		async loadUsers() {
			update(s => ({ ...s, loading: true }));
			try {
				const users = await adminApi.listUsers();
				update(s => ({ ...s, users: Array.isArray(users) ? users : [], loading: false }));
			} catch (e: any) {
				update(s => ({ ...s, users: [], error: e.message, loading: false }));
			}
		},

		async updateUserRole(id: string, role: 'user' | 'admin') {
			await adminApi.updateUserRole(id, role);
			await this.loadUsers();
		},

		async loadAuditLog() {
			update(s => ({ ...s, loading: true }));
			try {
				const auditLog = await adminApi.getAuditLog();
				update(s => ({ ...s, auditLog: Array.isArray(auditLog) ? auditLog : [], loading: false }));
			} catch (e: any) {
				update(s => ({ ...s, auditLog: [], error: e.message, loading: false }));
			}
		}
	};
}

export const admin = createAdminStore();
