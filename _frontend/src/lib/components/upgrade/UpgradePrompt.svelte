<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { X, Sparkles, Zap, Crown, Lock, ArrowRight, Check } from 'lucide-svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { funnelTracking, type FunnelName, type TouchPoint } from '@braids/free-zone/frontend/stores/funnel-tracking';
	import { auth } from '$lib/stores/auth-store';

	// Props
	export let variant: 'modal' | 'banner' | 'inline' | 'card' | 'floating' = 'modal';
	export let funnelName: FunnelName = 'try_signup';
	export let touchpoint: TouchPoint | string = 'try_signup_cta';
	export let show = false;
	
	// Content customization
	export let title = 'Unlock Your Full Potential';
	export let subtitle = 'Get unlimited access to all exercises, lessons, and features.';
	export let ctaText = 'Start Free Trial';
	export let ctaLink = '/register';
	export let secondaryText = 'View Pricing';
	export let secondaryLink = '/pricing';
	export let showDismiss = true;
	export let features: string[] = [
		'Unlimited exercises',
		'All programming languages',
		'Progress tracking',
		'Achievements & badges'
	];
	
	// Context for tracking
	export let exerciseId: string | undefined = undefined;
	export let lessonId: string | undefined = undefined;
	export let primitiveId: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	let hasTrackedView = false;

	// Check if user is logged in
	$: isLoggedIn = $auth?.isAuthenticated;
	$: displayCta = isLoggedIn ? 'Upgrade to Premium' : ctaText;
	$: displayLink = isLoggedIn ? '/pricing' : ctaLink;

	onMount(() => {
		if (show && !hasTrackedView) {
			trackView();
		}
	});

	$: if (show && !hasTrackedView) {
		trackView();
	}

	function trackView() {
		hasTrackedView = true;
		funnelTracking.track({
			eventType: 'view',
			funnelName,
			touchpoint,
			exerciseId,
			lessonId,
			primitiveId,
		});
	}

	function handleCtaClick() {
		funnelTracking.track({
			eventType: 'click',
			funnelName,
			touchpoint: touchpoint + '_cta',
			exerciseId,
			lessonId,
			primitiveId,
			metadata: { destination: displayLink },
		});
		dispatch('cta');
		goto(displayLink);
	}

	function handleSecondaryClick() {
		funnelTracking.track({
			eventType: 'click',
			funnelName,
			touchpoint: touchpoint + '_secondary',
			exerciseId,
			lessonId,
			primitiveId,
			metadata: { destination: secondaryLink },
		});
		dispatch('secondary');
		goto(secondaryLink);
	}

	function handleDismiss() {
		funnelTracking.track({
			eventType: 'dismiss',
			funnelName,
			touchpoint,
			exerciseId,
			lessonId,
			primitiveId,
		});
		dispatch('dismiss');
		show = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && showDismiss) {
			handleDismiss();
		}
	}
</script>

{#if variant === 'modal' && show}
	<!-- Full Modal -->
	<div 
		class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		transition:fade={{ duration: 200 }}
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
	>
		<div 
			class="bg-surface-900 border border-surface-700 rounded-2xl max-w-md w-full p-8 relative"
			transition:scale={{ duration: 300, start: 0.9 }}
		>
			{#if showDismiss}
				<button 
					on:click={handleDismiss}
					class="absolute top-4 right-4 p-2 text-surface-500 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			{/if}

			<div class="text-center">
				<!-- Icon -->
				<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/20">
					<Crown size={40} class="text-white" />
				</div>

				<!-- Title -->
				<h2 class="text-2xl font-bold mb-2">{title}</h2>
				<p class="text-surface-400 mb-6">{subtitle}</p>

				<!-- Features -->
				{#if features.length > 0}
					<div class="bg-surface-800/50 rounded-xl p-4 mb-6 text-left">
						<ul class="space-y-2">
							{#each features as feature}
								<li class="flex items-center gap-3 text-sm">
									<Check size={16} class="text-primary-400 shrink-0" />
									<span class="text-surface-300">{feature}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- CTAs -->
				<button 
					on:click={handleCtaClick}
					class="w-full btn btn-primary text-lg py-3 mb-3"
				>
					<Sparkles size={20} />
					{displayCta}
				</button>

				<button 
					on:click={handleSecondaryClick}
					class="w-full btn btn-ghost text-surface-400"
				>
					{secondaryText}
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	</div>
{/if}

{#if variant === 'banner' && show}
	<!-- Top Banner -->
	<div 
		class="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 text-white py-3 px-4 relative"
		transition:fly={{ y: -50, duration: 300 }}
	>
		<div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<Zap size={20} class="shrink-0" />
				<p class="text-sm sm:text-base">
					<span class="font-semibold">{title}</span>
					<span class="hidden sm:inline text-white/80"> — {subtitle}</span>
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button 
					on:click={handleCtaClick}
					class="btn btn-sm bg-white text-primary-600 hover:bg-white/90 font-semibold"
				>
					{displayCta}
				</button>
				{#if showDismiss}
					<button 
						on:click={handleDismiss}
						class="p-1 hover:bg-white/20 rounded transition-colors"
						aria-label="Dismiss"
					>
						<X size={18} />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if variant === 'inline'}
	<!-- Inline within content -->
	<div class="bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border border-primary-500/30 rounded-xl p-6">
		<div class="flex items-start gap-4">
			<div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
				<Lock size={24} class="text-primary-400" />
			</div>
			<div class="flex-1">
				<h3 class="font-semibold text-lg mb-1">{title}</h3>
				<p class="text-surface-400 text-sm mb-4">{subtitle}</p>
				<div class="flex items-center gap-3">
					<button on:click={handleCtaClick} class="btn btn-primary btn-sm">
						{displayCta}
					</button>
					<button on:click={handleSecondaryClick} class="btn btn-ghost btn-sm text-surface-400">
						{secondaryText}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if variant === 'card'}
	<!-- Card style (for grids) -->
	<div class="card p-6 bg-gradient-to-br from-surface-800 to-surface-900 border-primary-500/30 hover:border-primary-500/50 transition-colors">
		<div class="text-center">
			<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4">
				<Sparkles size={28} class="text-primary-400" />
			</div>
			<h3 class="font-semibold mb-2">{title}</h3>
			<p class="text-sm text-surface-400 mb-4">{subtitle}</p>
			<button on:click={handleCtaClick} class="btn btn-primary w-full">
				{displayCta}
			</button>
		</div>
	</div>
{/if}

{#if variant === 'floating' && show}
	<!-- Floating bottom-right -->
	<div 
		class="fixed bottom-6 right-6 z-40 max-w-sm"
		transition:fly={{ x: 100, duration: 300 }}
	>
		<div class="bg-surface-900 border border-surface-700 rounded-xl p-5 shadow-2xl shadow-black/40">
			<div class="flex items-start gap-4">
				<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
					<Crown size={24} class="text-white" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-start justify-between gap-2 mb-1">
						<h4 class="font-semibold">{title}</h4>
						{#if showDismiss}
							<button 
								on:click={handleDismiss}
								class="p-1 text-surface-500 hover:text-white -mt-1 -mr-1"
								aria-label="Dismiss"
							>
								<X size={16} />
							</button>
						{/if}
					</div>
					<p class="text-sm text-surface-400 mb-3">{subtitle}</p>
					<button on:click={handleCtaClick} class="btn btn-primary btn-sm w-full">
						<Sparkles size={14} />
						{displayCta}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
