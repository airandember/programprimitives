<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { register, isLoading, error, clearError } from '../stores/auth';
	import { registerSchema } from '@braids/core/validation';
	
	const dispatch = createEventDispatcher<{
		success: void;
		switchToLogin: void;
	}>();
	
	let email = '';
	let password = '';
	let confirmPassword = '';
	let displayName = '';
	let localError = '';
	let fieldErrors: Record<string, string> = {};
	
	function validateField(field: string, value: string): string {
		const testData = { email, password, displayName, [field]: value };
		const result = registerSchema.safeParse(testData);
		
		if (!result.success) {
			const fieldError = result.error.errors.find(e => e.path[0] === field);
			return fieldError?.message ?? '';
		}
		return '';
	}
	
	function handleBlur(field: string) {
		const value = field === 'email' ? email : field === 'password' ? password : displayName;
		fieldErrors[field] = validateField(field, value);
	}
	
	async function handleSubmit() {
		localError = '';
		fieldErrors = {};
		clearError();
		
		// Check passwords match
		if (password !== confirmPassword) {
			fieldErrors.confirmPassword = 'Passwords do not match';
			return;
		}
		
		const result = await register({ email, password, displayName });
		
		if (result.success) {
			dispatch('success');
		} else {
			localError = result.error ?? 'Registration failed';
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="auth-form">
	<h2>Create Account</h2>
	<p class="subtitle">Start your journey to coding mastery</p>
	
	{#if localError || $error}
		<div class="error-message">
			{localError || $error}
		</div>
	{/if}
	
	<div class="form-group">
		<label for="displayName">Display Name</label>
		<input
			type="text"
			id="displayName"
			bind:value={displayName}
			on:blur={() => handleBlur('displayName')}
			on:keydown={handleKeydown}
			placeholder="John Doe"
			disabled={$isLoading}
			autocomplete="name"
			class:error={fieldErrors.displayName}
		/>
		{#if fieldErrors.displayName}
			<span class="field-error">{fieldErrors.displayName}</span>
		{/if}
	</div>
	
	<div class="form-group">
		<label for="email">Email</label>
		<input
			type="email"
			id="email"
			bind:value={email}
			on:blur={() => handleBlur('email')}
			on:keydown={handleKeydown}
			placeholder="you@example.com"
			disabled={$isLoading}
			autocomplete="email"
			class:error={fieldErrors.email}
		/>
		{#if fieldErrors.email}
			<span class="field-error">{fieldErrors.email}</span>
		{/if}
	</div>
	
	<div class="form-group">
		<label for="password">Password</label>
		<input
			type="password"
			id="password"
			bind:value={password}
			on:blur={() => handleBlur('password')}
			on:keydown={handleKeydown}
			placeholder="••••••••"
			disabled={$isLoading}
			autocomplete="new-password"
			class:error={fieldErrors.password}
		/>
		{#if fieldErrors.password}
			<span class="field-error">{fieldErrors.password}</span>
		{:else}
			<span class="field-hint">At least 8 characters with uppercase, lowercase, and number</span>
		{/if}
	</div>
	
	<div class="form-group">
		<label for="confirmPassword">Confirm Password</label>
		<input
			type="password"
			id="confirmPassword"
			bind:value={confirmPassword}
			on:keydown={handleKeydown}
			placeholder="••••••••"
			disabled={$isLoading}
			autocomplete="new-password"
			class:error={fieldErrors.confirmPassword}
		/>
		{#if fieldErrors.confirmPassword}
			<span class="field-error">{fieldErrors.confirmPassword}</span>
		{/if}
	</div>
	
	<button type="submit" class="submit-btn" disabled={$isLoading}>
		{#if $isLoading}
			<span class="spinner"></span>
			Creating account...
		{:else}
			Create Account
		{/if}
	</button>
	
	<p class="terms">
		By signing up, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
	</p>
	
	<div class="form-footer">
		<p>
			Already have an account?
			<button type="button" class="switch-btn" on:click={() => dispatch('switchToLogin')}>
				Sign in
			</button>
		</p>
	</div>
</form>

<style>
	.auth-form {
		width: 100%;
		max-width: 400px;
		padding: 2rem;
		background: var(--surface-elevated, #1a1a2e);
		border-radius: 1rem;
		border: 1px solid var(--border, #2a2a4a);
	}
	
	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary, #fff);
	}
	
	.subtitle {
		margin: 0 0 1.5rem;
		color: var(--text-secondary, #888);
		font-size: 0.95rem;
	}
	
	.error-message {
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 0.5rem;
		color: #f87171;
		font-size: 0.9rem;
	}
	
	.form-group {
		margin-bottom: 1.25rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary, #ccc);
	}
	
	input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		background: var(--surface, #0f0f1a);
		border: 1px solid var(--border, #2a2a4a);
		border-radius: 0.5rem;
		color: var(--text-primary, #fff);
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	
	input:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
	}
	
	input.error {
		border-color: #ef4444;
	}
	
	input.error:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
	}
	
	input::placeholder {
		color: var(--text-tertiary, #555);
	}
	
	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.field-error {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.8rem;
		color: #f87171;
	}
	
	.field-hint {
		display: block;
		margin-top: 0.35rem;
		font-size: 0.8rem;
		color: var(--text-tertiary, #666);
	}
	
	.submit-btn {
		width: 100%;
		padding: 0.875rem 1.5rem;
		margin-top: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: #fff;
		background: var(--primary, #6366f1);
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s, transform 0.1s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	
	.submit-btn:hover:not(:disabled) {
		background: var(--primary-hover, #5457e5);
	}
	
	.submit-btn:active:not(:disabled) {
		transform: scale(0.98);
	}
	
	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	
	.terms {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--text-tertiary, #666);
		text-align: center;
	}
	
	.terms a {
		color: var(--text-secondary, #888);
		text-decoration: underline;
	}
	
	.terms a:hover {
		color: var(--primary, #6366f1);
	}
	
	.form-footer {
		margin-top: 1.5rem;
		text-align: center;
	}
	
	.form-footer p {
		color: var(--text-secondary, #888);
		font-size: 0.9rem;
	}
	
	.switch-btn {
		background: none;
		border: none;
		color: var(--primary, #6366f1);
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		font-size: inherit;
	}
	
	.switch-btn:hover {
		text-decoration: underline;
	}
</style>

