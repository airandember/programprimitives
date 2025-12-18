<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import LoginForm from './LoginForm.svelte';
	import RegisterForm from './RegisterForm.svelte';
	
	export let show = false;
	export let initialView: 'login' | 'register' = 'login';
	
	const dispatch = createEventDispatcher<{
		close: void;
		success: void;
	}>();
	
	let currentView = initialView;
	
	$: if (show) {
		currentView = initialView;
	}
	
	function handleSuccess() {
		dispatch('success');
		dispatch('close');
	}
	
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			dispatch('close');
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div 
		class="modal-backdrop" 
		on:click={handleBackdropClick}
		on:keydown={() => {}}
		role="dialog"
		aria-modal="true"
		aria-labelledby="auth-modal-title"
		transition:fade={{ duration: 200 }}
	>
		<div class="modal-content" transition:scale={{ duration: 200, start: 0.95 }}>
			<button class="close-btn" on:click={() => dispatch('close')} aria-label="Close">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
			
			{#if currentView === 'login'}
				<LoginForm 
					on:success={handleSuccess}
					on:switchToRegister={() => currentView = 'register'}
				/>
			{:else}
				<RegisterForm 
					on:success={handleSuccess}
					on:switchToLogin={() => currentView = 'login'}
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
	}
	
	.modal-content {
		position: relative;
		max-height: 90vh;
		overflow-y: auto;
	}
	
	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		padding: 0.5rem;
		background: transparent;
		border: none;
		color: var(--text-secondary, #888);
		cursor: pointer;
		border-radius: 0.5rem;
		transition: color 0.2s, background 0.2s;
	}
	
	.close-btn:hover {
		color: var(--text-primary, #fff);
		background: var(--surface, rgba(255, 255, 255, 0.1));
	}
</style>

