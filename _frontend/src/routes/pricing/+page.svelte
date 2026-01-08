<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, Zap, Star, Crown, HelpCircle } from 'lucide-svelte';
	import PricingCard from '$lib/components/subscription/PricingCard.svelte';
	import { 
		subscription,
		currentTier,
		TIER_INFO,
		type BillingCycle,
	} from '$lib/stores/subscription';
	import { funnelTracking } from '@braids/free-zone/frontend/stores/funnel-tracking';

	let billingCycle: BillingCycle = 'yearly';

	onMount(() => {
		// Track pricing page view
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'pricing_page',
			touchpoint: 'pricing_view',
		});
	});

	function trackPlanClick(plan: string) {
		funnelTracking.track({
			eventType: 'click',
			funnelName: 'pricing_page',
			touchpoint: 'pricing_plan_click',
			metadata: { plan, billingCycle },
		});
	}

	const faqs = [
		{
			q: 'Can I cancel anytime?',
			a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
		},
		{
			q: 'Is there a free trial?',
			a: 'New Premium and Pro subscribers get a 7-day free trial. No credit card required to start.',
		},
		{
			q: 'What payment methods do you accept?',
			a: 'We accept all major credit cards, PayPal, and Apple Pay. Enterprise customers can pay by invoice.',
		},
		{
			q: 'Can I switch plans?',
			a: 'Yes! You can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades at the next billing cycle.',
		},
		{
			q: 'Do you offer refunds?',
			a: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
		},
		{
			q: 'Is my progress saved if I downgrade?',
			a: 'Yes, your progress is always saved. If you upgrade again later, everything will be there.',
		},
	];

	let openFaq: number | null = null;
</script>

<svelte:head>
	<title>Pricing | ProgramPrimitives</title>
	<meta name="description" content="Choose the plan that fits your learning journey. Start free, upgrade when ready." />
</svelte:head>

<div class="min-h-screen py-12 sm:py-20">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">
				Simple, Transparent <span class="text-gradient">Pricing</span>
			</h1>
			<p class="text-lg text-surface-400 max-w-2xl mx-auto mb-8">
				Start learning for free. Upgrade when you're ready to unlock your full potential.
			</p>

			<!-- Billing toggle -->
			<div class="inline-flex items-center gap-3 bg-surface-800/50 rounded-full p-1">
				<button
					class="px-4 py-2 rounded-full text-sm font-medium transition-colors
						{billingCycle === 'monthly' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-surface-200'}"
					on:click={() => billingCycle = 'monthly'}
				>
					Monthly
				</button>
				<button
					class="px-4 py-2 rounded-full text-sm font-medium transition-colors relative
						{billingCycle === 'yearly' ? 'bg-surface-700 text-white' : 'text-surface-400 hover:text-surface-200'}"
					on:click={() => billingCycle = 'yearly'}
				>
					Yearly
					<span class="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
						-30%
					</span>
				</button>
			</div>
		</div>

		<!-- Pricing Cards -->
		<div class="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
			<PricingCard tier="free" {billingCycle} />
			<PricingCard tier="premium" {billingCycle} highlighted />
			<PricingCard tier="pro" {billingCycle} />
		</div>

		<!-- Feature Comparison -->
		<div class="mb-20">
			<h2 class="text-2xl font-display font-bold text-center mb-8">
				Compare Plans
			</h2>
			
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-surface-800">
							<th class="text-left py-4 px-4 text-surface-400 font-medium">Feature</th>
							<th class="text-center py-4 px-4 text-surface-400 font-medium">Free</th>
							<th class="text-center py-4 px-4 text-primary-400 font-medium">Premium</th>
							<th class="text-center py-4 px-4 text-accent-400 font-medium">Pro</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Exercises</td>
							<td class="py-4 px-4 text-center">3</td>
							<td class="py-4 px-4 text-center text-primary-400">Unlimited</td>
							<td class="py-4 px-4 text-center text-accent-400">Unlimited</td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Primitives</td>
							<td class="py-4 px-4 text-center">5</td>
							<td class="py-4 px-4 text-center text-primary-400">All</td>
							<td class="py-4 px-4 text-center text-accent-400">All</td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Languages</td>
							<td class="py-4 px-4 text-center">1</td>
							<td class="py-4 px-4 text-center text-primary-400">3</td>
							<td class="py-4 px-4 text-center text-accent-400">7+</td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Progress tracking</td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-primary-500" /></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-accent-500" /></td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Achievements</td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-primary-500" /></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-accent-500" /></td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Hints per exercise</td>
							<td class="py-4 px-4 text-center">1</td>
							<td class="py-4 px-4 text-center text-primary-400">Unlimited</td>
							<td class="py-4 px-4 text-center text-accent-400">Unlimited</td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Speed boards</td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-accent-500" /></td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">Leaderboards</td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-accent-500" /></td>
						</tr>
						<tr class="border-b border-surface-800/50">
							<td class="py-4 px-4">AI feedback</td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><span class="text-surface-600">—</span></td>
							<td class="py-4 px-4 text-center"><Check size={18} class="inline text-accent-500" /></td>
						</tr>
						<tr>
							<td class="py-4 px-4">Support</td>
							<td class="py-4 px-4 text-center text-surface-500">Community</td>
							<td class="py-4 px-4 text-center text-primary-400">Priority</td>
							<td class="py-4 px-4 text-center text-accent-400">Priority</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Money back guarantee -->
		<div class="text-center mb-20">
			<div class="inline-flex items-center gap-3 bg-primary-500/10 border border-primary-500/30 rounded-full px-6 py-3">
				<Check size={20} class="text-primary-400" />
				<span class="text-primary-300">30-day money-back guarantee</span>
			</div>
		</div>

		<!-- FAQ -->
		<div class="max-w-3xl mx-auto">
			<h2 class="text-2xl font-display font-bold text-center mb-8">
				Frequently Asked Questions
			</h2>

			<div class="space-y-3">
				{#each faqs as faq, i}
					<div class="card overflow-hidden">
						<button
							class="w-full p-5 text-left flex items-center justify-between gap-4"
							on:click={() => openFaq = openFaq === i ? null : i}
						>
							<span class="font-medium">{faq.q}</span>
							<HelpCircle 
								size={20} 
								class="shrink-0 transition-transform text-surface-500
									{openFaq === i ? 'rotate-180' : ''}" 
							/>
						</button>
						{#if openFaq === i}
							<div class="px-5 pb-5 text-surface-400">
								{faq.a}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Final CTA -->
		<div class="text-center mt-20">
			<h2 class="text-2xl font-display font-bold mb-4">
				Ready to master the tools of code?
			</h2>
			<p class="text-surface-400 mb-6">
				Start free, upgrade when you're ready. No credit card required.
			</p>
			<a href="/try" class="btn btn-primary text-lg px-8">
				<Zap size={20} />
				Start Learning Free
			</a>
		</div>
	</div>
</div>

