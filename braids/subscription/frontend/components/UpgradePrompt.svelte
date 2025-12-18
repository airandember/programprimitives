<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { Lock, Crown, Star, ArrowRight, X, Sparkles } from 'lucide-svelte';
	import { 
		subscription,
		currentTier,
		TIER_INFO,
		type SubscriptionTier 
	} from '../stores/subscription';

	export let feature: string;
	export let requiredTier: SubscriptionTier = 'premium';
	export let variant: 'modal' | 'inline' | 'banner' = 'inline';
	export let showClose = true;

	const dispatch = createEventDispatcher<{
		close: void;
		upgrade: SubscriptionTier;
	}>();

	$: tierInfo = TIER_INFO[requiredTier];
	$: isUpgradeFromFree = $currentTier === 'free';

	const featureMessages: Record<string, { title: string; description: string }> = {
		language: {
			title: 'Unlock More Languages',
			description: 'Practice in Python, Go, TypeScript and more.',
		},
		speedBoards: {
			title: 'Access Speed Boards',
			description: 'Compete for the fastest completion times.',
		},
		leaderboards: {
			title: 'Join the Leaderboard',
			description: 'See how you rank against other learners.',
		},
		aiFeedback: {
			title: 'Get AI Feedback',
			description: 'Personalized suggestions to improve your code.',
		},
		progressTracking: {
			title: 'Track Your Progress',
			description: 'See your mastery grow across all primitives.',
		},
		achievements: {
			title: 'Earn Achievements',
			description: 'Collect badges and show off your skills.',
		},
		hints: {
			title: 'Unlimited Hints',
			description: 'Get as many hints as you need to learn.',
		},
		exercises: {
			title: 'Unlimited Exercises',
			description: 'Practice with our full library of challenges.',
		},
	};

	$: message = featureMessages[feature] || {
		title: 'Unlock This Feature',
		description: `Upgrade to ${tierInfo.name} to access this feature.`,
	};

	function handleUpgrade() {
		dispatch('upgrade', requiredTier);
	}

	function handleClose() {
		dispatch('close');
	}
</script>

{#if variant === 'modal'}
	<!-- Full Modal -->
	<div 
		class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		transition:fade={{ duration: 200 }}
		on:click|self={handleClose}
		role="dialog"
		aria-modal="true"
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

			<div class="text-center">
				<div class="w-16 h-16 rounded-full bg-gradient-to-br from-{tierInfo.color}-500/30 to-{tierInfo.color}-500/10 flex items-center justify-center mx-auto mb-6">
					<Lock size={32} class="text-{tierInfo.color}-400" />
				</div>
				
				<h2 class="text-2xl font-bold mb-2">{message.title}</h2>
				<p class="text-surface-400 mb-6">{message.description}</p>

				<div class="bg-surface-800/50 rounded-xl p-4 mb-6">
					<div class="flex items-center justify-center gap-3 mb-2">
						{#if requiredTier === 'premium'}
							<Star size={24} class="text-primary-400" />
						{:else}
							<Crown size={24} class="text-accent-400" />
						{/if}
						<span class="text-xl font-bold">{tierInfo.name}</span>
					</div>
					<p class="text-sm text-surface-400">{tierInfo.description}</p>
				</div>

				<a
					href="/pricing"
					on:click={handleUpgrade}
					class="btn btn-primary w-full justify-center text-lg py-3"
				>
					<Sparkles size={20} />
					Upgrade to {tierInfo.name}
					<ArrowRight size={20} />
				</a>

				{#if isUpgradeFromFree}
					<p class="text-sm text-surface-500 mt-4">
						Start with a 7-day free trial
					</p>
				{/if}
			</div>
		</div>
	</div>

{:else if variant === 'banner'}
	<!-- Banner -->
	<div 
		class="bg-gradient-to-r from-{tierInfo.color}-500/20 via-{tierInfo.color}-500/10 to-transparent border border-{tierInfo.color}-500/30 rounded-xl p-4 flex items-center gap-4"
		transition:fade={{ duration: 200 }}
	>
		<div class="w-10 h-10 rounded-lg bg-{tierInfo.color}-500/20 flex items-center justify-center shrink-0">
			<Lock size={20} class="text-{tierInfo.color}-400" />
		</div>
		<div class="flex-1 min-w-0">
			<div class="font-semibold">{message.title}</div>
			<div class="text-sm text-surface-400">{message.description}</div>
		</div>
		<a href="/pricing" class="btn btn-primary btn-sm shrink-0">
			Upgrade
		</a>
	</div>

{:else}
	<!-- Inline card -->
	<div class="card p-5 bg-gradient-to-br from-{tierInfo.color}-500/10 to-transparent border-{tierInfo.color}-500/30">
		<div class="flex items-start gap-4">
			<div class="w-12 h-12 rounded-xl bg-{tierInfo.color}-500/20 flex items-center justify-center shrink-0">
				<Lock size={24} class="text-{tierInfo.color}-400" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold mb-1">{message.title}</h3>
				<p class="text-sm text-surface-400 mb-3">{message.description}</p>
				<a href="/pricing" class="btn btn-primary btn-sm">
					Upgrade to {tierInfo.name}
					<ArrowRight size={16} />
				</a>
			</div>
		</div>
	</div>
{/if}

