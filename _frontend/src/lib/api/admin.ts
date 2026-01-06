// Admin API functions
import { api } from '$lib/api';

// Dashboard
export async function getAdminStats() {
	return api.get('/api/admin/stats');
}

export async function getAuditLog() {
	return api.get('/api/admin/audit-log');
}

// Primitives
export async function listPrimitives() {
	return api.get('/api/admin/primitives');
}

export async function createPrimitive(data: PrimitiveInput) {
	return api.post('/api/admin/primitives', data);
}

export async function updatePrimitive(id: string, data: PrimitiveInput) {
	return api.put(`/api/admin/primitives/${id}`, data);
}

export async function deletePrimitive(id: string) {
	return api.delete(`/api/admin/primitives/${id}`);
}

// Primitive Syntax
export async function listPrimitiveSyntax(primitiveId: string) {
	return api.get(`/api/admin/primitives/${primitiveId}/syntax`);
}

export async function upsertPrimitiveSyntax(primitiveId: string, data: SyntaxInput) {
	return api.post(`/api/admin/primitives/${primitiveId}/syntax`, data);
}

// Exercises
export async function listExercises(primitiveId?: string) {
	const url = primitiveId
		? `/api/admin/exercises?primitive=${primitiveId}`
		: '/api/admin/exercises';
	return api.get(url);
}

export async function createExercise(data: ExerciseInput) {
	return api.post('/api/admin/exercises', data);
}

export async function updateExercise(id: string, data: ExerciseInput) {
	return api.put(`/api/admin/exercises/${id}`, data);
}

export async function deleteExercise(id: string) {
	return api.delete(`/api/admin/exercises/${id}`);
}

// Exercise Starter Code
export async function listStarterCode(exerciseId: string) {
	return api.get(`/api/admin/exercises/${exerciseId}/starter-code`);
}

export async function upsertStarterCode(exerciseId: string, data: StarterCodeInput) {
	return api.post(`/api/admin/exercises/${exerciseId}/starter-code`, data);
}

// Exercise Test Cases
export async function listTestCases(exerciseId: string) {
	return api.get(`/api/admin/exercises/${exerciseId}/test-cases`);
}

export async function createTestCase(exerciseId: string, data: TestCaseInput) {
	return api.post(`/api/admin/exercises/${exerciseId}/test-cases`, data);
}

export async function deleteTestCase(id: string) {
	return api.delete(`/api/admin/test-cases/${id}`);
}

// Users
export async function listUsers() {
	return api.get('/api/admin/users');
}

export async function updateUserRole(id: string, role: 'user' | 'admin') {
	return api.put(`/api/admin/users/${id}/role`, { role });
}

// Types
export interface PrimitiveInput {
	id: string;
	name: string;
	category: string;
	subcategory?: string;
	description: string;
	whyItMatters: string;
	bestPractices: string[];
	pitfalls: string[];
	difficulty: number;
	prerequisites: string[];
	related: string[];
	icon: string;
	categoryOrder: number;
	isPremium: boolean;
	isPublished: boolean;
}

export interface SyntaxInput {
	primitiveId: string;
	language: string;
	syntaxTemplate: string;
	fullExample: string;
	explanation: string;
	variations?: string;
	isPrimary: boolean;
}

export interface ExerciseInput {
	id?: string;
	primitiveId: string;
	title: string;
	slug?: string;
	description: string;
	difficulty: number;
	estimatedMinutes: number;
	instructions: string;
	hints: string[];
	sequenceOrder: number;
	isPremium: boolean;
	isPublished: boolean;
}

export interface StarterCodeInput {
	exerciseId: string;
	language: string;
	starterCode: string;
	solutionCode: string;
}

export interface TestCaseInput {
	exerciseId: string;
	name: string;
	description?: string;
	input: string;
	expectedOutput: string;
	isHidden: boolean;
	timeoutMs: number;
	sequenceOrder: number;
}
