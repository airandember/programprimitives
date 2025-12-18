<script lang="ts">
	import { Play, Clock, Star, Lock, ChevronRight, Sparkles, Check, Zap, Trophy, Flame } from 'lucide-svelte';
	import { 
		freeZone, 
		remainingExercises, 
		hasReachedLimit,
		FREE_EXERCISES,
		FREE_ZONE_CONFIG,
	} from '@braids/free-zone/frontend/stores/free-zone';
	import { getExercise } from '$lib/stores/exercises';
	import { getPrimitive } from '$lib/stores/primitives';

	// Get free exercises with details
	$: freeExercises = FREE_EXERCISES.map(id => {
		const exercise = getExercise(id);
		if (!exercise) return null;
		const primitive = getPrimitive(exercise.primitiveId);
		const isCompleted = $freeZone.exercisesCompleted.includes(id);
		return { ...exercise, primitive, isCompleted };
	}).filter(Boolean);

	const benefits = [
		{ icon: Zap, text: 'Try real coding exercises', desc: 'No account needed' },
		{ icon: Trophy, text: 'See your results instantly', desc: 'Run and test your code' },
		{ icon: Flame, text: 'Learn by doing', desc: 'Practice makes perfect' },
	];
</script>

<svelte:head>
	<title>Try Free | ProgramPrimitives</title>
	<meta name="description" content="Try ProgramPrimitives for free! Practice coding exercises without signing up. Learn programming fundamentals hands-on." />
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Section -->
	<div class="bg-gradient-to-b from-accent-500/20 via-primary-500/10 to-transparent py-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<div class="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-4 py-1.5 mb-6">
				<Sparkles size={16} class="text-accent-400" />
				<span class="text-sm font-medium text-accent-300">No account required</span>
			</div>
			
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
				Try <span class="text-gradient">ProgramPrimitives</span> Free
			</h1>
			
			<p class="text-xl text-surface-400 mb-8 max-w-2xl mx-auto">
				Master the building blocks of programming. Start coding right now — 
				no signup, no credit card.
			</p>

			<!-- Progress indicator -->
			<div class="inline-flex items-center gap-3 bg-surface-800/50 rounded-full px-6 py-3 border border-surface-700">
				<div class="flex gap-1">
					{#each Array(FREE_ZONE_CONFIG.maxFreeExercises) as _, i}
						<div 
							class="w-3 h-3 rounded-full transition-colors {i < $freeZone.exercisesCompleted.length ? 'bg-primary-500' : 'bg-surface-700'}"
						></div>
					{/each}
				</div>
				<span class="text-surface-400">
					{#if $hasReachedLimit}
						<span class="text-primary-400">All free exercises completed!</span>
					{:else}
						<span class="text-primary-400 font-semibold">{$remainingExercises}</span> 
						free {$remainingExercises === 1 ? 'exercise' : 'exercises'} remaining
					{/if}
				</span>
			</div>
		</div>
	</div>

	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
		<!-- Benefits -->
		<div class="grid md:grid-cols-3 gap-6 mb-16">
			{#each benefits as benefit}
				<div class="card p-6 text-center">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-4">
						<svelte:component this={benefit.icon} size={28} class="text-primary-400" />
					</div>
					<h3 class="font-semibold mb-1">{benefit.text}</h3>
					<p class="text-sm text-surface-500">{benefit.desc}</p>
				</div>
			{/each}
		</div>

		<!-- Free Exercises -->
		<div class="mb-16">
			<h2 class="text-2xl font-display font-bold mb-6 text-center">
				Start with these exercises
			</h2>

			<div class="space-y-4">
				{#each freeExercises as exercise}
					{@const isLocked = $hasReachedLimit && !exercise.isCompleted}
					<a
						href={isLocked ? '#' : `/try/${exercise.primitiveId}/${exercise.id}`}
						class="card p-5 flex items-center gap-4 group transition-all
							{isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary-500/50'}"
						on:click|preventDefault={(e) => {
							if (!isLocked) {
								window.location.href = `/try/${exercise.primitiveId}/${exercise.id}`;
							}
						}}
					>
						<!-- Status indicator -->
						<div
							class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors
								{exercise.isCompleted 
									? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
									: isLocked
										? 'bg-surface-800 text-surface-600'
										: 'bg-surface-800 text-surface-400 group-hover:bg-surface-700'}"
						>
							{#if exercise.isCompleted}
								<Check size={28} />
							{:else if isLocked}
								<Lock size={24} />
							{:else}
								<Play size={28} />
							{/if}
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="text-lg">{exercise.primitive?.icon}</span>
								<span class="text-sm text-surface-500">{exercise.primitive?.name}</span>
							</div>
							<h3 class="font-semibold text-lg mb-1 group-hover:text-primary-400 transition-colors">
								{exercise.title}
							</h3>
							<p class="text-sm text-surface-500 line-clamp-1">{exercise.description}</p>
						</div>

						<!-- Meta -->
						<div class="flex items-center gap-4 shrink-0">
							<div class="flex items-center gap-1 text-surface-500 text-sm">
								<Clock size={14} />
								{exercise.estimatedMinutes} min
							</div>
							<div class="flex items-center gap-0.5">
								{#each Array(exercise.difficulty) as _}
									<Star size={12} class="fill-primary-500 text-primary-500" />
								{/each}
								{#each Array(5 - exercise.difficulty) as _}
									<Star size={12} class="text-surface-700" />
								{/each}
							</div>
							{#if !isLocked}
								<ChevronRight size={20} class="text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Upgrade CTA -->
		<div class="card p-8 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-500/10 border-primary-500/30 text-center">
			<div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
				<Sparkles size={32} class="text-white" />
			</div>
			<h2 class="text-2xl font-bold mb-3">Want unlimited access?</h2>
			<p class="text-surface-400 mb-6 max-w-md mx-auto">
				Create a free account to unlock all exercises, track your progress, 
				earn achievements, and learn in any programming language.
			</p>
			<div class="flex items-center justify-center gap-4">
				<a href="/register" class="btn btn-primary text-lg px-8">
					Create Free Account
				</a>
				<a href="/login" class="btn btn-ghost">
					Log In
				</a>
			</div>
		</div>
	</div>
</div>

