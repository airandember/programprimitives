<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Sparkles, Check, X, Zap, Trophy, Flame, ArrowRight } from 'lucide-svelte';
	import { 
		freeZone, 
		remainingExercises, 
		hasReachedLimit,
		FREE_ZONE_CONFIG,
	} from '$lib/stores/free-zone';

	export let variant: 'modal' | 'banner' | 'inline' = 'modal';
	export let showClose = true;

	const dispatch = createEventDispatcher<{
		close: void;
		signup: void;
		login: void;
	}>();

	function handleClose() {
		freeZone.dismissedSignup();
		dispatch('close');
	}

	function handleSignup() {
		freeZone.sawSignupPrompt();
		dispatch('signup');
	}

	function handleLogin() {
		dispatch('login');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	const benefits = [
		{ icon: Zap, text: 'Unlimited exercises' },
		{ icon: Trophy, text: 'Track your progress' },
		{ icon: Flame, text: 'Daily streaks & XP' },
		{ icon: Sparkles, text: 'All programming languages' },
	];
</script>

{#if variant === 'modal'}
	<!-- Full Modal -->
	<div 
		class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		transition:fade={{ duration: 200 }}
		on:click|self={handleClose}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div 
			class="card p-8 max-w-md w-full relative"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			{#if showClose}
				<button
					on:click={handleClose}
					class="absolute top-4 right-4 p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			{/if}

			<!-- Header -->
			<div class="text-center mb-8">
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
					<Sparkles size={32} class="text-white" />
				</div>
				
				{#if $hasReachedLimit}
					<h2 class="text-2xl font-bold mb-2">You've Used Your Free Tries!</h2>
					<p class="text-surface-400">
						Sign up to continue learning and unlock unlimited exercises.
					</p>
				{:else}
					<h2 class="text-2xl font-bold mb-2">Enjoying ProgramPrimitives?</h2>
					<p class="text-surface-400">
						You have <span class="text-primary-400 font-semibold">{$remainingExercises}</span> 
						free {$remainingExercises === 1 ? 'exercise' : 'exercises'} left.
						Sign up to unlock everything!
					</p>
				{/if}
			</div>

			<!-- Benefits -->
			<div class="space-y-3 mb-8">
				{#each benefits as benefit}
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
							<svelte:component this={benefit.icon} size={16} class="text-primary-400" />
						</div>
						<span class="text-surface-300">{benefit.text}</span>
					</div>
				{/each}
			</div>

			<!-- Actions -->
			<div class="space-y-3">
				<a
					href="/register"
					on:click={handleSignup}
					class="btn btn-primary w-full justify-center text-lg py-3"
				>
					Create Free Account
					<ArrowRight size={20} />
				</a>
				
				<div class="text-center text-sm text-surface-500">
					Already have an account?
					<a href="/login" on:click={handleLogin} class="text-primary-400 hover:underline">
						Log in
					</a>
				</div>
			</div>

			{#if !$hasReachedLimit}
				<button
					on:click={handleClose}
					class="w-full mt-4 text-center text-sm text-surface-500 hover:text-surface-300 transition-colors"
				>
					Continue with free tries
				</button>
			{/if}
		</div>
	</div>

{:else if variant === 'banner'}
	<!-- Banner at bottom -->
	<div 
		class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 border-t border-primary-500/30 backdrop-blur-sm z-40"
		transition:fade={{ duration: 200 }}
	>
		<div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
					<Sparkles size={20} class="text-white" />
				</div>
				<div>
					<div class="font-semibold">
						{#if $hasReachedLimit}
							You've used all free exercises
						{:else}
							{$remainingExercises} free {$remainingExercises === 1 ? 'exercise' : 'exercises'} remaining
						{/if}
					</div>
					<div class="text-sm text-surface-400">Sign up to unlock unlimited learning</div>
				</div>
			</div>
			
			<div class="flex items-center gap-3">
				<a href="/register" on:click={handleSignup} class="btn btn-primary">
					Sign Up Free
				</a>
				{#if showClose && !$hasReachedLimit}
					<button
						on:click={handleClose}
						class="p-2 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200 transition-colors"
						aria-label="Dismiss"
					>
						<X size={20} />
					</button>
				{/if}
			</div>
		</div>
	</div>

{:else}
	<!-- Inline card -->
	<div class="card p-6 bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-primary-500/30">
		<div class="flex items-start gap-4">
			<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
				<Sparkles size={24} class="text-white" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold mb-1">
					{#if $hasReachedLimit}
						Unlock Unlimited Exercises
					{:else}
						{$remainingExercises} free {$remainingExercises === 1 ? 'exercise' : 'exercises'} left
					{/if}
				</h3>
				<p class="text-sm text-surface-400 mb-4">
					Create a free account to track progress, earn achievements, and access all content.
				</p>
				<div class="flex items-center gap-3">
					<a href="/register" on:click={handleSignup} class="btn btn-primary btn-sm">
						Sign Up Free
					</a>
					<a href="/login" on:click={handleLogin} class="btn btn-ghost btn-sm">
						Log In
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

