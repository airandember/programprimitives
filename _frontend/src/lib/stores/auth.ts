// ============================================
// Auth Store - Re-exports from local auth store
// ============================================
// 
// Components should import from here for consistent paths:
//   import { user, login, logout } from '$lib/stores/auth';
//

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
} from './auth-store';
