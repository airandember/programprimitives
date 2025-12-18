<script lang="ts">
	import { Search, ChevronRight, Lock, Check, Star } from 'lucide-svelte';
	import {
		primitives,
		filteredPrimitives,
		selectedLanguage,
		searchQuery,
		selectedCategory,
		setSearchQuery,
		setCategory,
		CATEGORIES,
	} from '$lib/stores/primitives';
	import { SUPPORTED_LANGUAGES } from '@braids/core/constants';

	// Local search value (synced with store)
	let localSearch = '';
	let localCategory = 'all';

	$: setSearchQuery(localSearch);
	$: setCategory(localCategory === 'all' ? null : localCategory);

	// Mock mastery for now (will come from progress braid)
	function getMasteryLevel(primitiveId: string): number {
		const mockMastery: Record<string, number> = {
			'variables': 5,
			'conditionals': 4,
			'for-loop': 3,
			'while-loop': 2,
			'functions': 1,
		};
		return mockMastery[primitiveId] || 0;
	}

	function getMasteryColor(level: number): string {
		const colors = [
			'bg-surface-700',
			'bg-surface-600',
			'bg-yellow-500',
			'bg-orange-500',
			'bg-primary-500',
			'bg-accent-400'
		];
		return colors[level] || colors[0];
	}

	function getDifficultyLabel(d: number): string {
		const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
		return labels[d] || '';
	}

	// Group primitives by category
	$: groupedPrimitives = CATEGORIES
		.map((cat) => ({
			...cat,
			primitives: $filteredPrimitives.filter((p) => p.category === cat.id)
		}))
		.filter((cat) => cat.primitives.length > 0);
</script>

<svelte:head>
	<title>Learn Primitives | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Header -->
	<div class="bg-gradient-to-b from-primary-500/10 via-surface-900/50 to-transparent py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">
				Learn <span class="text-gradient">Primitives</span>
			</h1>
			<p class="text-surface-400 text-lg max-w-2xl">
				Master the building blocks of programming. Each primitive is explained with examples in your
				preferred language.
			</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
		<!-- Filters -->
		<div class="card p-4 mb-8">
			<div class="flex flex-col sm:flex-row gap-4">
				<!-- Search -->
				<div class="relative flex-1">
					<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
					<input
						type="text"
						placeholder="Search primitives..."
						bind:value={localSearch}
						class="input pl-10"
					/>
				</div>

				<!-- Category filter -->
				<select bind:value={localCategory} class="input w-full sm:w-48">
					<option value="all">All Categories</option>
					{#each CATEGORIES as category}
						<option value={category.id}>{category.icon} {category.name}</option>
					{/each}
				</select>

				<!-- Language selector -->
				<select bind:value={$selectedLanguage} class="input w-full sm:w-44">
					{#each SUPPORTED_LANGUAGES as lang}
						<option value={lang.id}>{lang.icon} {lang.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Categories Grid -->
		{#each groupedPrimitives as category}
			<div class="mb-12">
				<div class="flex items-center gap-3 mb-6">
					<span class="text-3xl">{category.icon}</span>
					<div>
						<h2 class="text-2xl font-display font-semibold">{category.name}</h2>
						<p class="text-surface-500 text-sm">{category.primitives.length} primitives</p>
					</div>
				</div>

				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each category.primitives as primitive}
						{@const mastery = getMasteryLevel(primitive.id)}
						<a
							href="/learn/{primitive.id}"
							class="card group relative overflow-hidden transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
						>
							<!-- Premium badge -->
							{#if primitive.isPremium}
								<div
									class="absolute top-0 right-0 bg-gradient-to-bl from-accent-500/20 to-transparent p-4"
								>
									<Lock size={16} class="text-accent-400" />
								</div>
							{/if}

							<div class="p-5">
								<!-- Icon and Mastery -->
								<div class="flex items-start justify-between mb-4">
									<div
										class="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center text-2xl border border-surface-700 group-hover:border-primary-500/30 transition-colors"
									>
										{primitive.icon || '📦'}
									</div>

									<!-- Mastery dots -->
									<div class="flex items-center gap-1">
										{#each Array(5) as _, i}
											<div
												class="w-2 h-2 rounded-full transition-all duration-300 {i < mastery
													? getMasteryColor(mastery)
													: 'bg-surface-800'}"
											></div>
										{/each}
										{#if mastery === 5}
											<Check size={14} class="text-accent-400 ml-1" />
										{/if}
									</div>
								</div>

								<!-- Content -->
								<h3
									class="font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors"
								>
									{primitive.name}
								</h3>
								<p class="text-surface-400 text-sm mb-4 line-clamp-2">
									{primitive.description}
								</p>

								<!-- Footer -->
								<div class="flex items-center justify-between text-sm">
									<div class="flex items-center gap-2 text-surface-500">
										<div class="flex items-center gap-0.5">
											{#each Array(primitive.difficulty) as _}
												<Star size={12} class="fill-primary-500 text-primary-500" />
											{/each}
											{#each Array(5 - primitive.difficulty) as _}
												<Star size={12} class="text-surface-700" />
											{/each}
										</div>
										<span class="text-xs">{getDifficultyLabel(primitive.difficulty)}</span>
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
				<h3 class="text-xl font-semibold mb-2">No primitives found</h3>
				<p class="text-surface-400">Try adjusting your search or filters</p>
			</div>
		{/if}
	</div>
</div>
