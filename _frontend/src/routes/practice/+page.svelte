<script lang="ts">
	import { Play, Clock, Target, ChevronRight, Flame, Trophy, Star } from 'lucide-svelte';
	import { primitives, selectedLanguage, CATEGORIES } from '$lib/stores/primitives';
	import { getPrimitive } from '$lib/stores/primitives';
	import { 
		exercises, 
		filteredExercises,
		exercisesByPrimitive,
		filterByPrimitive,
		filterByDifficulty,
	} from '$lib/stores/exercises';
	import { SUPPORTED_LANGUAGES } from '@braids/core/constants';

	let selectedDifficultyValue = 'all';
	let selectedPrimitiveValue = 'all';

	// Reactive filter updates
	$: filterByPrimitive(selectedPrimitiveValue === 'all' ? null : selectedPrimitiveValue);
	$: filterByDifficulty(selectedDifficultyValue === 'all' ? null : parseInt(selectedDifficultyValue));

	// Mock completion data (will come from progress braid)
	const completedExercises = new Set(['ex-for-001', 'ex-var-001', 'ex-cond-001']);
	const exerciseScores: Record<string, number> = {
		'ex-for-001': 95,
		'ex-var-001': 100,
		'ex-cond-001': 88
	};

	function getPrimitiveName(id: string): string {
		const p = getPrimitive(id);
		return p?.name || id;
	}

	function getPrimitiveIcon(id: string): string {
		const p = getPrimitive(id);
		return p?.icon || '📦';
	}

	// Group filtered exercises by primitive
	$: groupedExercises = Object.entries(
		$filteredExercises.reduce((acc, ex) => {
			if (!acc[ex.primitiveId]) {
				acc[ex.primitiveId] = [];
			}
			acc[ex.primitiveId].push(ex);
			return acc;
		}, {} as Record<string, typeof $filteredExercises>)
	);

	const dailyChallenge = {
		primitive: 'For Loop',
		title: "Today's Challenge: FizzBuzz",
		description: 'The classic programming interview question',
		xpReward: 100,
		timeLimit: '15 min',
		exerciseId: 'ex-for-003',
		primitiveId: 'for-loop'
	};
</script>

<svelte:head>
	<title>Practice | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Header -->
	<div class="bg-gradient-to-b from-accent-500/10 via-surface-900/50 to-transparent py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">
				<span class="text-gradient">Practice</span>
			</h1>
			<p class="text-surface-400 text-lg max-w-2xl">
				Put your knowledge to the test. Complete exercises, earn XP, and build your streak.
			</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
		<!-- Daily Challenge Banner -->
		<div
			class="card bg-gradient-to-r from-primary-500/10 via-accent-500/10 to-primary-500/10 border-primary-500/30 p-6 mb-8 relative overflow-hidden"
		>
			<!-- Background decoration -->
			<div class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div>
			<div class="absolute -left-10 -bottom-10 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl"></div>

			<div class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div
						class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25"
					>
						<Flame size={28} class="text-white" />
					</div>
					<div>
						<div class="flex items-center gap-2 mb-1">
							<span class="text-sm font-medium text-primary-400">Daily Challenge</span>
							<span class="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">
								New today!
							</span>
						</div>
						<h3 class="font-semibold text-lg">{dailyChallenge.title}</h3>
						<div class="flex items-center gap-4 text-sm text-surface-400 mt-1">
							<span class="flex items-center gap-1">
								<Trophy size={14} class="text-accent-400" />
								{dailyChallenge.xpReward} XP
							</span>
							<span class="flex items-center gap-1">
								<Clock size={14} />
								{dailyChallenge.timeLimit}
							</span>
						</div>
					</div>
				</div>
				<a
					href="/practice/{dailyChallenge.primitiveId}/{dailyChallenge.exerciseId}"
					class="btn btn-primary shadow-lg shadow-primary-500/25"
				>
					<Play size={18} />
					Start Challenge
				</a>
			</div>
		</div>

		<!-- Filters -->
		<div class="card p-4 mb-8">
			<div class="flex flex-col sm:flex-row gap-4">
				<!-- Primitive filter -->
				<select bind:value={selectedPrimitiveValue} class="input w-full sm:w-auto">
					<option value="all">All Primitives</option>
					{#each $primitives as p}
						<option value={p.id}>{p.icon} {p.name}</option>
					{/each}
				</select>

				<!-- Difficulty filter -->
				<select bind:value={selectedDifficultyValue} class="input w-full sm:w-auto">
					<option value="all">All Difficulties</option>
					<option value="1">⭐ Beginner</option>
					<option value="2">⭐⭐ Easy</option>
					<option value="3">⭐⭐⭐ Medium</option>
					<option value="4">⭐⭐⭐⭐ Hard</option>
					<option value="5">⭐⭐⭐⭐⭐ Expert</option>
				</select>

				<!-- Language selector -->
				<select bind:value={$selectedLanguage} class="input w-full sm:w-auto">
					{#each SUPPORTED_LANGUAGES as lang}
						<option value={lang.id}>{lang.icon} {lang.name}</option>
					{/each}
				</select>

				<!-- Stats summary -->
				<div class="flex-1 flex items-center justify-end gap-4 text-sm text-surface-500">
					<span>{$filteredExercises.length} exercises</span>
					<span>{completedExercises.size} completed</span>
				</div>
			</div>
		</div>

		<!-- Exercise List by Primitive -->
		{#each groupedExercises as [primitiveId, exercises]}
			<div class="mb-10">
				<div class="flex items-center gap-3 mb-4">
					<span class="text-2xl">{getPrimitiveIcon(primitiveId)}</span>
					<h2 class="text-xl font-semibold">{getPrimitiveName(primitiveId)}</h2>
					<span class="text-surface-500 text-sm">({exercises.length} exercises)</span>
				</div>

				<div class="space-y-3">
					{#each exercises as exercise}
						{@const isCompleted = completedExercises.has(exercise.id)}
						{@const score = exerciseScores[exercise.id]}
						<a
							href="/practice/{exercise.primitiveId}/{exercise.id}"
							class="card p-5 flex items-center gap-4 group hover:border-primary-500/50 transition-all"
						>
							<!-- Status indicator -->
							<div
								class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                         {isCompleted
									? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
									: 'bg-surface-800 text-surface-500 group-hover:bg-surface-700'}"
							>
								{#if isCompleted}
									<Target size={24} />
								{:else}
									<Play size={24} />
								{/if}
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<h3
									class="font-semibold mb-1 group-hover:text-primary-400 transition-colors truncate"
								>
									{exercise.title}
								</h3>
								<p class="text-sm text-surface-500 mb-2 line-clamp-1">{exercise.description}</p>
								<div class="flex items-center gap-4 text-sm text-surface-500">
									<span class="flex items-center gap-1">
										<Clock size={14} />
										{exercise.estimatedMinutes} min
									</span>
									<div class="flex items-center gap-0.5">
										{#each Array(exercise.difficulty) as _}
											<Star size={12} class="fill-primary-500 text-primary-500" />
										{/each}
										{#each Array(5 - exercise.difficulty) as _}
											<Star size={12} class="text-surface-700" />
										{/each}
									</div>
								</div>
							</div>

							<!-- Score/Status -->
							<div class="shrink-0 text-right">
								{#if isCompleted && score}
									<div
										class="text-2xl font-bold {score >= 90
											? 'text-primary-400'
											: score >= 70
												? 'text-yellow-400'
												: 'text-orange-400'}"
									>
										{score}%
									</div>
									<div class="text-sm text-surface-500">Score</div>
								{:else}
									<div class="text-surface-600 text-sm">Not started</div>
								{/if}
							</div>

							<ChevronRight
								size={20}
								class="text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all shrink-0"
							/>
						</a>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Empty state -->
		{#if $filteredExercises.length === 0}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🎯</div>
				<h3 class="text-xl font-semibold mb-2">No exercises found</h3>
				<p class="text-surface-400">Try adjusting your filters</p>
			</div>
		{/if}
	</div>
</div>
