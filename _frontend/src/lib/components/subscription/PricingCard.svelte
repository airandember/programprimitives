<script lang="ts">
	import { Check, X, Crown, Star, Zap } from 'lucide-svelte';
	import { 
		subscription,
		currentTier,
		TIER_FEATURES,
		TIER_PRICING,
		TIER_INFO,
		type SubscriptionTier,
		type BillingCycle,
	} from '$lib/stores/subscription';

	export let tier: SubscriptionTier;
	export let billingCycle: BillingCycle = 'yearly';
	export let highlighted = false;
	export let onSelect: (() => void) | undefined = undefined;

	$: info = TIER_INFO[tier];
	$: features = TIER_FEATURES[tier];
	$: pricing = tier === 'free' ? null : TIER_PRICING[tier];
	$: isCurrentTier = $currentTier === tier;
	$: price = pricing ? (billingCycle === 'yearly' ? pricing.yearly / 12 : pricing.monthly) : 0;
	$: totalPrice = pricing ? (billingCycle === 'yearly' ? pricing.yearly : pricing.monthly) : 0;

	const tierIcons = {
		free: Zap,
		premium: Star,
		pro: Crown,
	};

	async function handleSelect() {
		if (onSelect) {
			onSelect();
		} else if (tier !== 'free') {
			await subscription.checkout(tier, billingCycle);
		}
	}

	// All features for comparison
	const allFeatures = [
		{ key: 'exercises', label: 'Exercises', getValue: (f: typeof features) => f.maxExercises === Infinity ? 'Unlimited' : `${f.maxExercises}` },
		{ key: 'primitives', label: 'Primitives', getValue: (f: typeof features) => f.maxPrimitives === Infinity ? 'All' : `${f.maxPrimitives}` },
		{ key: 'languages', label: 'Languages', getValue: (f: typeof features) => f.languages.length.toString() },
		{ key: 'progressTracking', label: 'Progress tracking', getValue: (f: typeof features) => f.progressTracking },
		{ key: 'achievements', label: 'Achievements', getValue: (f: typeof features) => f.achievements },
		{ key: 'hints', label: 'Hints per exercise', getValue: (f: typeof features) => f.hintsPerExercise === Infinity ? 'Unlimited' : `${f.hintsPerExercise}` },
		{ key: 'speedBoards', label: 'Speed boards', getValue: (f: typeof features) => f.speedBoards },
		{ key: 'leaderboards', label: 'Leaderboards', getValue: (f: typeof features) => f.leaderboards },
		{ key: 'aiFeedback', label: 'AI feedback', getValue: (f: typeof features) => f.aiFeedback },
	];
</script>

<div 
	class="relative rounded-2xl border transition-all duration-300
		{highlighted 
			? 'border-primary-500 bg-gradient-to-b from-primary-500/10 to-transparent scale-105 shadow-xl shadow-primary-500/20' 
			: 'border-surface-700 bg-surface-900/50 hover:border-surface-600'}"
>
	{#if highlighted}
		<div class="absolute -top-4 left-1/2 -translate-x-1/2">
			<span class="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
				Most Popular
			</span>
		</div>
	{/if}

	<div class="p-6 sm:p-8">
		<!-- Header -->
		<div class="text-center mb-6">
			<div class="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4
				{tier === 'free' ? 'bg-surface-800' : tier === 'premium' ? 'bg-primary-500/20' : 'bg-accent-500/20'}">
				<svelte:component 
					this={tierIcons[tier]} 
					size={28} 
					class="{tier === 'free' ? 'text-surface-400' : tier === 'premium' ? 'text-primary-400' : 'text-accent-400'}" 
				/>
			</div>
			<h3 class="text-2xl font-bold mb-1">{info.name}</h3>
			<p class="text-surface-400 text-sm">{info.description}</p>
		</div>

		<!-- Pricing -->
		<div class="text-center mb-6">
			{#if tier === 'free'}
				<div class="text-4xl font-bold">$0</div>
				<div class="text-surface-500 text-sm">Forever free</div>
			{:else}
				<div class="flex items-baseline justify-center gap-1">
					<span class="text-4xl font-bold">${Math.round(price)}</span>
					<span class="text-surface-400">/mo</span>
				</div>
				{#if billingCycle === 'yearly' && pricing}
					<div class="text-surface-500 text-sm">
						${totalPrice}/year (save ${pricing.yearlySavings})
					</div>
				{:else}
					<div class="text-surface-500 text-sm">
						Billed monthly
					</div>
				{/if}
			{/if}
		</div>

		<!-- CTA Button -->
		<button
			on:click={handleSelect}
			disabled={isCurrentTier}
			class="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mb-6
				{isCurrentTier 
					? 'bg-surface-800 text-surface-500 cursor-not-allowed' 
					: highlighted
						? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
						: 'bg-surface-800 hover:bg-surface-700 text-white'}"
		>
			{#if isCurrentTier}
				Current Plan
			{:else if tier === 'free'}
				Get Started
			{:else}
				Upgrade to {info.name}
			{/if}
		</button>

		<!-- Features -->
		<div class="space-y-3">
			{#each allFeatures as feature}
				{@const value = feature.getValue(features)}
				<div class="flex items-center gap-3">
					{#if typeof value === 'boolean'}
						{#if value}
							<Check size={18} class="text-primary-500 shrink-0" />
						{:else}
							<X size={18} class="text-surface-600 shrink-0" />
						{/if}
						<span class="{value ? 'text-surface-300' : 'text-surface-500'}">
							{feature.label}
						</span>
					{:else}
						<Check size={18} class="text-primary-500 shrink-0" />
						<span class="text-surface-300">
							<span class="font-medium text-{tier === 'free' ? 'surface-400' : tier === 'premium' ? 'primary-400' : 'accent-400'}">
								{value}
							</span>
							{feature.label.toLowerCase()}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

