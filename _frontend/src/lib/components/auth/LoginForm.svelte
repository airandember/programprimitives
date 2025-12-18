<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { login, isLoading, error, clearError } from '$lib/stores/auth';
	
	const dispatch = createEventDispatcher<{
		success: void;
		switchToRegister: void;
	}>();
	
	let email = '';
	let password = '';
	let localError = '';
	
	async function handleSubmit() {
		localError = '';
		clearError();
		
		if (!email || !password) {
			localError = 'Please fill in all fields';
			return;
		}
		
		const result = await login({ email, password });
		
		if (result.success) {
			dispatch('success');
		} else {
			localError = result.error ?? 'Login failed';
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="auth-form">
	<h2>Welcome Back</h2>
	<p class="subtitle">Sign in to continue your learning journey</p>
	
	{#if localError || $error}
		<div class="error-message">
			{localError || $error}
		</div>
	{/if}
	
	<div class="form-group">
		<label for="email">Email</label>
		<input
			type="email"
			id="email"
			bind:value={email}
			on:keydown={handleKeydown}
			placeholder="you@example.com"
			disabled={$isLoading}
			autocomplete="email"
		/>
	</div>
	
	<div class="form-group">
		<label for="password">Password</label>
		<input
			type="password"
			id="password"
			bind:value={password}
			on:keydown={handleKeydown}
			placeholder="••••••••"
			disabled={$isLoading}
			autocomplete="current-password"
		/>
	</div>
	
	<button type="submit" class="submit-btn" disabled={$isLoading}>
		{#if $isLoading}
			<span class="spinner"></span>
			Signing in...
		{:else}
			Sign In
		{/if}
	</button>
	
	<div class="form-footer">
		<a href="/forgot-password" class="forgot-link">Forgot password?</a>
		<p>
			Don't have an account?
			<button type="button" class="switch-btn" on:click={() => dispatch('switchToRegister')}>
				Sign up
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
	
	input::placeholder {
		color: var(--text-tertiary, #555);
	}
	
	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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
	
	.form-footer {
		margin-top: 1.5rem;
		text-align: center;
	}
	
	.forgot-link {
		color: var(--text-secondary, #888);
		font-size: 0.9rem;
		text-decoration: none;
		transition: color 0.2s;
	}
	
	.forgot-link:hover {
		color: var(--primary, #6366f1);
	}
	
	.form-footer p {
		margin-top: 1rem;
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

