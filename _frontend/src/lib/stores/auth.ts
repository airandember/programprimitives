import { writable, derived } from 'svelte/store';
import { mockUser } from '$lib/mock-data';
import type { User } from '$lib/types';

// Core stores - start with mock user for demo
export const user = writable<User | null>(mockUser);
export const isLoading = writable(false);

// Derived stores
export const isAuthenticated = derived(user, ($user) => !!$user);
export const isPremium = derived(user, ($user) =>
	$user?.subscriptionTier !== 'free'
);

// Actions
export async function login(email: string, password: string): Promise<void> {
	isLoading.set(true);
	
	// Simulate login delay
	await new Promise(resolve => setTimeout(resolve, 500));
	
	// For demo, just set the mock user
	user.set({
		...mockUser,
		email,
		displayName: email.split('@')[0]
	});
	
	isLoading.set(false);
}

export async function register(data: {
	email: string;
	password: string;
	displayName: string;
}): Promise<void> {
	isLoading.set(true);
	
	await new Promise(resolve => setTimeout(resolve, 500));
	
	user.set({
		id: 'new-user',
		email: data.email,
		displayName: data.displayName,
		preferredLanguage: 'javascript',
		subscriptionTier: 'free'
	});
	
	isLoading.set(false);
}

export async function logout(): Promise<void> {
	user.set(null);
}

export function setDemoUser(): void {
	user.set(mockUser);
}
