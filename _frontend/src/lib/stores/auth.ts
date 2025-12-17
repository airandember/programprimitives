// ============================================
// Auth Store - Re-exports from auth braid
// ============================================
// 
// This file re-exports the auth store from the auth braid.
// Components should import from here for consistent paths:
//   import { user, login, logout } from '$lib/stores/auth';
//

// Re-export everything from the auth braid store
export {
	user,
	isLoading,
	error,
	isInitialized,
	isAuthenticated,
	isPremium,
	subscriptionTier,
	initAuth,
	register,
	login,
	logout,
	forgotPassword,
	resetPassword,
	clearError,
	updateUser,
} from '@braids/auth/frontend/stores/auth';
