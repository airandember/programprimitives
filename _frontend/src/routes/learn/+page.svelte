<script lang="ts">
	import { Search, ChevronRight, Lock, Check, Hammer, Wrench } from 'lucide-svelte';
	import {
		primitives,
		filteredPrimitives,
		selectedLanguage,
		searchQuery,
		tiersWithCounts,
		setSearchQuery,
		setTier,
		TOOL_TIERS,
	} from '$lib/stores/primitives';
	import { SUPPORTED_LANGUAGES } from '@braids/core/constants';
	import type { ToolTier } from '@braids/core/types';

	// Local search value (synced with store)
	let localSearch = '';
	let selectedTierFilter: ToolTier | 'all' = 'all';

	$: setSearchQuery(localSearch);
	$: setTier(selectedTierFilter === 'all' ? null : selectedTierFilter);

	// Mock refinement for now (will come from progress braid)
	function getRefinementStage(toolId: string): string {
		const mockRefinement: Record<string, string> = {
			'variables': 'iron',
			'operators': 'bronze',
			'conditionals': 'wood',
			'for-loop': 'wood',
			'while-loop': 'stone',
			'arrays': 'stone',
			'objects': 'unstarted',
			'functions': 'unstarted',
		};
		return mockRefinement[toolId] || 'unstarted';
	}

	function getRefinementProgress(stage: string): number {
		const progress: Record<string, number> = {
			'unstarted': 0,
			'stone': 17,
			'wood': 33,
			'bronze': 50,
			'iron': 67,
			'steel': 83,
			'mastered': 100,
		};
		return progress[stage] || 0;
	}

	function getRefinementColor(stage: string): string {
		const colors: Record<string, string> = {
			'unstarted': 'bg-surface-700',
			'stone': 'bg-stone-500',
			'wood': 'bg-amber-600',
			'bronze': 'bg-orange-500',
			'iron': 'bg-slate-400',
			'steel': 'bg-blue-400',
			'mastered': 'bg-yellow-400',
		};
		return colors[stage] || 'bg-surface-700';
	}

	function getRefinementIcon(stage: string): string {
		const icons: Record<string, string> = {
			'unstarted': '○',
			'stone': '🪨',
			'wood': '🪵',
			'bronze': '🔩',
			'iron': '⚙️',
			'steel': '🔧',
			'mastered': '✨',
		};
		return icons[stage] || '○';
	}

	// Group filtered primitives by tier
	$: groupedByTier = $tiersWithCounts
		.map((tier) => ({
			...tier,
			tools: $filteredPrimitives.filter((p) => p.tier === tier.tier)
		}))
		.filter((tier) => tier.tools.length > 0);

	// Calculate overall journey progress
	$: totalTools = $primitives.length;
	$: masteredTools = $primitives.filter(p => getRefinementStage(p.id) === 'mastered').length;
	$: inProgressTools = $primitives.filter(p => {
		const stage = getRefinementStage(p.id);
		return stage !== 'unstarted' && stage !== 'mastered';
	}).length;
</script>

<svelte:head>
	<title>Learn Tools | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Hero: The Craftsman's Journey -->
	<div class="bg-gradient-to-b from-surface-800 via-surface-900 to-transparent py-12 border-b border-surface-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="text-center mb-10">
				<div class="inline-flex items-center gap-2 bg-surface-800/50 rounded-full px-4 py-2 mb-4">
					<Hammer size={18} class="text-amber-500" />
					<span class="text-sm text-surface-300">The Craftsman's Journey</span>
				</div>
				<h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">
					Master Your <span class="text-gradient">Tools</span>
				</h1>
				<p class="text-surface-400 text-lg max-w-2xl mx-auto">
					Progress from raw fundamentals to precision instruments. Each tool you master unlocks new capabilities.
				</p>
			</div>

			<!-- Journey Progress Bar -->
			<div class="max-w-4xl mx-auto mb-8">
				<div class="flex items-center justify-between text-sm text-surface-400 mb-2">
					<span>{masteredTools} of {totalTools} tools mastered</span>
					<span>{inProgressTools} in progress</span>
				</div>
				<div class="h-3 bg-surface-800 rounded-full overflow-hidden flex">
					{#each TOOL_TIERS as tier, i}
						{@const tierTools = $primitives.filter(p => p.tier === tier.tier)}
						{@const tierMastered = tierTools.filter(p => getRefinementStage(p.id) === 'mastered').length}
						{@const tierInProgress = tierTools.filter(p => {
							const stage = getRefinementStage(p.id);
							return stage !== 'unstarted' && stage !== 'mastered';
						}).length}
						{@const tierWidth = (tierTools.length / totalTools) * 100}
						{@const masteredWidth = tierTools.length > 0 ? (tierMastered / tierTools.length) * 100 : 0}
						{@const inProgressWidth = tierTools.length > 0 ? (tierInProgress / tierTools.length) * 100 : 0}
						{#if tierTools.length > 0}
							<div 
								class="relative h-full {i < TOOL_TIERS.length - 1 ? 'border-r border-surface-700' : ''}"
								style="width: {tierWidth}%"
								title="{tier.displayName}: {tierMastered}/{tierTools.length} mastered"
							>
								<div class="absolute inset-y-0 left-0 bg-gradient-to-r {tier.tier === 0 ? 'from-sky-500 to-sky-600' : tier.tier === 1 ? 'from-stone-500 to-stone-600' : tier.tier === 2 ? 'from-amber-500 to-amber-600' : tier.tier === 3 ? 'from-orange-500 to-orange-600' : tier.tier === 4 ? 'from-slate-400 to-slate-500' : tier.tier === 5 ? 'from-blue-400 to-blue-500' : tier.tier === 6 ? 'from-purple-400 to-purple-500' : 'from-rose-400 to-rose-500'}" style="width: {masteredWidth}%"></div>
								<div class="absolute inset-y-0 bg-gradient-to-r {tier.tier === 0 ? 'from-sky-500/40 to-sky-600/40' : tier.tier === 1 ? 'from-stone-500/40 to-stone-600/40' : tier.tier === 2 ? 'from-amber-500/40 to-amber-600/40' : tier.tier === 3 ? 'from-orange-500/40 to-orange-600/40' : tier.tier === 4 ? 'from-slate-400/40 to-slate-500/40' : tier.tier === 5 ? 'from-blue-400/40 to-blue-500/40' : tier.tier === 6 ? 'from-purple-400/40 to-purple-500/40' : 'from-rose-400/40 to-rose-500/40'}" style="left: {masteredWidth}%; width: {inProgressWidth}%"></div>
							</div>
						{/if}
					{/each}
				</div>
				
				<!-- Tier Legend -->
				<div class="flex flex-wrap justify-center gap-4 mt-4">
					{#each TOOL_TIERS as tier}
						{@const tierTools = $primitives.filter(p => p.tier === tier.tier)}
						{#if tierTools.length > 0}
							<button
								on:click={() => selectedTierFilter = selectedTierFilter === tier.tier ? 'all' : tier.tier}
								class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all
									{selectedTierFilter === tier.tier 
										? 'bg-surface-700 ring-2 ring-primary-500/50' 
										: 'bg-surface-800/50 hover:bg-surface-700/50'}"
							>
								<span>{tier.icon}</span>
								<span class="{tier.color}">{tier.displayName}</span>
								<span class="text-surface-500">({tierTools.length})</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8">
		<!-- Filters -->
		<div class="card p-4 mb-8">
			<div class="flex flex-col sm:flex-row gap-4">
				<!-- Search -->
				<div class="relative flex-1">
					<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
					<input
						type="text"
						placeholder="Search tools..."
						bind:value={localSearch}
						class="input pl-10"
					/>
				</div>

				<!-- Language selector -->
				<select bind:value={$selectedLanguage} class="input w-full sm:w-44">
					{#each SUPPORTED_LANGUAGES as lang}
						<option value={lang.id}>{lang.icon} {lang.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Tools by Tier -->
		{#each groupedByTier as tierGroup}
			<div class="mb-12">
				<!-- Tier Header -->
				<div class="flex items-center gap-4 mb-6">
					<div class="w-14 h-14 rounded-2xl bg-gradient-to-br {tierGroup.bgGradient} flex items-center justify-center text-3xl border border-surface-700">
						{tierGroup.icon}
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-3">
							<h2 class="text-2xl font-display font-semibold {tierGroup.color}">
								{tierGroup.displayName}
							</h2>
							<span class="text-sm text-surface-500 bg-surface-800 px-2 py-0.5 rounded">
								Tier {tierGroup.tier}
							</span>
						</div>
						<p class="text-surface-500 text-sm mt-1">{tierGroup.description}</p>
					</div>
					<div class="text-right hidden sm:block">
						<div class="text-2xl font-bold {tierGroup.color}">{tierGroup.tools.length}</div>
						<div class="text-xs text-surface-500">tools</div>
					</div>
				</div>

				<!-- Tools Grid -->
				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each tierGroup.tools as tool}
						{@const refinement = getRefinementStage(tool.id)}
						{@const progress = getRefinementProgress(refinement)}
						<a
							href="/learn/{tool.id}"
							class="card group relative overflow-hidden transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<!-- Premium badge -->
							{#if tool.isPremium}
								<div class="absolute top-0 right-0 bg-gradient-to-bl from-accent-500/20 to-transparent p-4">
									<Lock size={16} class="text-accent-400" />
								</div>
							{/if}

							<div class="p-5">
								<!-- Icon and Refinement -->
								<div class="flex items-start justify-between mb-4">
									<div
										class="w-12 h-12 rounded-xl bg-gradient-to-br {tierGroup.bgGradient} flex items-center justify-center text-2xl border border-surface-700 group-hover:border-primary-500/30 transition-colors"
									>
										{tool.icon || '🔧'}
									</div>

									<!-- Refinement Badge -->
									<div class="flex items-center gap-2">
										<span class="text-lg" title="{refinement} refinement">{getRefinementIcon(refinement)}</span>
										{#if refinement === 'mastered'}
											<Check size={14} class="text-yellow-400" />
										{/if}
									</div>
								</div>

								<!-- Content -->
								<h3 class="font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors">
									{tool.name}
								</h3>
								<p class="text-surface-400 text-sm mb-4 line-clamp-2">
									{tool.description}
								</p>

								<!-- Refinement Progress Bar -->
								<div class="mb-3">
									<div class="flex justify-between text-xs text-surface-500 mb-1">
										<span class="capitalize">{refinement === 'unstarted' ? 'Not started' : refinement}</span>
										<span>{progress}%</span>
									</div>
									<div class="h-1.5 bg-surface-800 rounded-full overflow-hidden">
										<div 
											class="h-full {getRefinementColor(refinement)} transition-all duration-500"
											style="width: {progress}%"
										></div>
									</div>
								</div>

								<!-- Footer -->
								<div class="flex items-center justify-between text-sm">
									<div class="flex items-center gap-2 text-surface-500">
										<span class="{tierGroup.color}">{tierGroup.icon}</span>
										<span class="text-xs">{tierGroup.displayName}</span>
									</div>
									<ChevronRight
										size={18}
										class="text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
									/>
								</div>
							</div>

							<!-- Hover glow effect -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
							></div>
						</a>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Empty state -->
		{#if $filteredPrimitives.length === 0}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-xl font-semibold mb-2">No tools found</h3>
				<p class="text-surface-400">Try adjusting your search or tier filter</p>
				<button 
					on:click={() => { localSearch = ''; selectedTierFilter = 'all'; }}
					class="btn btn-secondary mt-4"
				>
					Clear filters
				</button>
			</div>
		{/if}

		<!-- Journey Philosophy -->
		<div class="mt-16 card bg-gradient-to-br from-surface-800/50 to-surface-900/50 p-8 text-center">
			<Wrench size={32} class="mx-auto text-primary-400 mb-4" />
			<h3 class="text-xl font-display font-semibold mb-3">Tool-First, Language-Second</h3>
			<p class="text-surface-400 max-w-2xl mx-auto">
				Coding tools are universal across every language — the difference is just syntax. 
				We teach the <strong class="text-primary-400">principles and best practices</strong> that persist everywhere, 
				so you can practice in the language of your choice.
			</p>
			<div class="flex justify-center gap-4 mt-6 text-sm">
				<div class="flex items-center gap-2">
					<span class="text-sky-400">📐</span>
					<span class="text-surface-500">→</span>
					<span class="text-stone-400">🪨</span>
					<span class="text-surface-500">→</span>
					<span class="text-amber-500">🪵</span>
					<span class="text-surface-500">→</span>
					<span class="text-orange-500">🔩</span>
					<span class="text-surface-500">→</span>
					<span class="text-slate-400">⚙️</span>
					<span class="text-surface-500">→</span>
					<span class="text-blue-400">🔧</span>
					<span class="text-surface-500">→</span>
					<span class="text-purple-400">⚡</span>
					<span class="text-surface-500">→</span>
					<span class="text-rose-400">🎯</span>
				</div>
			</div>
		</div>
	</div>
</div>
