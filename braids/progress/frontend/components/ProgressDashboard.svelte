<script lang="ts">
	import { 
		Flame, Trophy, Target, TrendingUp, Clock, 
		AlertTriangle, CheckCircle, ChevronRight, Zap,
		BookOpen, Lightbulb
	} from 'lucide-svelte';
	import { 
		progress, 
		levelProgress, 
		xpToNextLevel, 
		overallMastery,
		masteryList,
		MASTERY_LEVELS,
		ERROR_PRINCIPLES,
		type PrimitiveMastery,
		type ErrorPattern,
	} from '../stores/progress';
	import { getPrimitive } from '$lib/stores/primitives';

	// Get insights
	$: insights = progress.getInsights();

	function formatTime(minutes: number): string {
		if (minutes < 60) return `${minutes}m`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}

	function getMasteryColor(level: number): string {
		return MASTERY_LEVELS[level as keyof typeof MASTERY_LEVELS].color;
	}
</script>

<div class="space-y-8">
	<!-- Stats Overview -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="card p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
					<Zap size={20} class="text-primary-400" />
				</div>
				<div class="text-2xl font-bold">{$progress.totalXp.toLocaleString()}</div>
			</div>
			<div class="text-sm text-surface-500">Total XP</div>
			<div class="mt-2">
				<div class="flex justify-between text-xs mb-1">
					<span class="text-surface-400">Level {$progress.currentLevel}</span>
					<span class="text-primary-400">{$xpToNextLevel} to next</span>
				</div>
				<div class="h-2 bg-surface-800 rounded-full overflow-hidden">
					<div 
						class="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
						style="width: {$levelProgress}%"
					></div>
				</div>
			</div>
		</div>

		<div class="card p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
					<Flame size={20} class="text-orange-400" />
				</div>
				<div class="text-2xl font-bold">{$progress.currentDailyStreak}</div>
			</div>
			<div class="text-sm text-surface-500">Day Streak</div>
			<div class="text-xs text-surface-400 mt-2">
				Best: {$progress.longestDailyStreak} days
			</div>
		</div>

		<div class="card p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
					<Trophy size={20} class="text-accent-400" />
				</div>
				<div class="text-2xl font-bold">{$progress.totalExercisesCompleted}</div>
			</div>
			<div class="text-sm text-surface-500">Completed</div>
			<div class="text-xs text-surface-400 mt-2">
				{$progress.totalExercisesAttempted} attempted
			</div>
		</div>

		<div class="card p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
					<Clock size={20} class="text-purple-400" />
				</div>
				<div class="text-2xl font-bold">{formatTime($progress.totalTimeSpentMinutes)}</div>
			</div>
			<div class="text-sm text-surface-500">Time Learning</div>
			<div class="text-xs text-surface-400 mt-2">
				{$overallMastery}% mastery
			</div>
		</div>
	</div>

	<!-- Learning Insights -->
	{#if insights.frequentErrors.length > 0 || insights.recommendations.length > 0}
		<div class="card p-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
					<Lightbulb size={20} class="text-yellow-400" />
				</div>
				<div>
					<h2 class="font-semibold text-lg">Learning Insights</h2>
					<p class="text-sm text-surface-500">Personalized suggestions to improve</p>
				</div>
			</div>

			<!-- Error Patterns -->
			{#if insights.frequentErrors.length > 0}
				<div class="mb-6">
					<h3 class="text-sm font-medium text-surface-400 mb-3 flex items-center gap-2">
						<AlertTriangle size={14} />
						Areas to Focus On
					</h3>
					<div class="space-y-3">
						{#each insights.frequentErrors.slice(0, 3) as error}
							{@const principle = ERROR_PRINCIPLES[error.errorType]}
							{@const primitive = getPrimitive(error.primitiveId)}
							<div class="bg-surface-800/50 rounded-lg p-4 border border-surface-700">
								<div class="flex items-start gap-3">
									<span class="text-2xl">{principle.icon}</span>
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-1">
											<span class="font-medium">{principle.name}</span>
											<span class="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
												{error.occurrences}x in {primitive?.name || error.primitiveId}
											</span>
										</div>
										<p class="text-sm text-surface-400 mb-2">{error.description}</p>
										<p class="text-sm text-primary-400">💡 {error.suggestion}</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Recommendations -->
			{#if insights.recommendations.length > 0}
				<div>
					<h3 class="text-sm font-medium text-surface-400 mb-3 flex items-center gap-2">
						<Target size={14} />
						Recommendations
					</h3>
					<div class="space-y-2">
						{#each insights.recommendations as rec}
							<div class="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
								<CheckCircle size={16} class="text-primary-500 shrink-0" />
								<span class="text-sm text-surface-300">{rec}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Mastery Grid -->
	<div class="card p-6">
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
					<TrendingUp size={20} class="text-primary-400" />
				</div>
				<div>
					<h2 class="font-semibold text-lg">Tool Mastery</h2>
					<p class="text-sm text-surface-500">Your proficiency in each primitive</p>
				</div>
			</div>
			<a href="/learn" class="btn btn-ghost btn-sm">
				<BookOpen size={16} />
				All Primitives
			</a>
		</div>

		<!-- Mastery levels legend -->
		<div class="flex flex-wrap gap-3 mb-6 text-xs">
			{#each Object.entries(MASTERY_LEVELS) as [level, info]}
				<div class="flex items-center gap-1.5">
					<div class="w-3 h-3 rounded-full bg-{info.color}"></div>
					<span class="text-surface-400">{info.name}</span>
				</div>
			{/each}
		</div>

		<!-- Mastery items -->
		{#if $masteryList.length > 0}
			<div class="grid gap-3">
				{#each $masteryList as mastery}
					{@const primitive = getPrimitive(mastery.primitiveId)}
					{@const levelInfo = MASTERY_LEVELS[mastery.level]}
					<a
						href="/learn/{mastery.primitiveId}"
						class="flex items-center gap-4 p-4 bg-surface-800/50 rounded-lg hover:bg-surface-800 transition-colors group"
					>
						<div class="text-2xl">{primitive?.icon || '📚'}</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<span class="font-medium">{primitive?.name || mastery.primitiveId}</span>
								<span class="text-xs px-2 py-0.5 rounded bg-{levelInfo.color}/20 text-{levelInfo.color}">
									{levelInfo.name}
								</span>
							</div>
							<div class="flex items-center gap-4 text-xs text-surface-500">
								<span>{mastery.exercisesCompleted}/{mastery.exercisesAvailable} exercises</span>
								<span>Avg: {mastery.averageScore}%</span>
								<span>Best: {mastery.bestScore}%</span>
							</div>
							<!-- Mastery bar -->
							<div class="mt-2 h-1.5 bg-surface-700 rounded-full overflow-hidden">
								<div 
									class="h-full bg-gradient-to-r from-{levelInfo.color} to-{levelInfo.color} transition-all duration-500"
									style="width: {(mastery.level / 5) * 100}%"
								></div>
							</div>
						</div>
						{#if mastery.suggestedReview}
							<div class="text-yellow-500" title={mastery.suggestedReview}>
								<AlertTriangle size={18} />
							</div>
						{/if}
						<ChevronRight size={18} class="text-surface-600 group-hover:text-primary-400 transition-colors" />
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12">
				<div class="text-4xl mb-4">🚀</div>
				<h3 class="font-semibold mb-2">Start Your Journey</h3>
				<p class="text-surface-400 mb-4">Complete exercises to track your mastery</p>
				<a href="/practice" class="btn btn-primary">
					Start Practicing
				</a>
			</div>
		{/if}
	</div>

	<!-- Recent Activity -->
	{#if $progress.recentActivity.length > 0}
		<div class="card p-6">
			<h2 class="font-semibold text-lg mb-4">Recent Activity</h2>
			<div class="space-y-3">
				{#each $progress.recentActivity.slice(0, 10) as activity}
					{@const primitive = activity.primitiveId ? getPrimitive(activity.primitiveId) : null}
					<div class="flex items-center gap-3 text-sm">
						<div class="w-8 h-8 rounded-lg flex items-center justify-center
							{activity.type === 'exercise_completed' ? 'bg-primary-500/20 text-primary-400' :
							 activity.type === 'level_up' ? 'bg-accent-500/20 text-accent-400' :
							 activity.type === 'streak_milestone' ? 'bg-orange-500/20 text-orange-400' :
							 activity.type === 'primitive_mastered' ? 'bg-purple-500/20 text-purple-400' :
							 'bg-surface-800 text-surface-400'}">
							{#if activity.type === 'exercise_completed'}
								<CheckCircle size={16} />
							{:else if activity.type === 'level_up'}
								<TrendingUp size={16} />
							{:else if activity.type === 'streak_milestone'}
								<Flame size={16} />
							{:else if activity.type === 'primitive_mastered'}
								<Trophy size={16} />
							{:else}
								<Target size={16} />
							{/if}
						</div>
						<div class="flex-1">
							{#if activity.type === 'exercise_completed'}
								<span>Completed exercise in <strong>{primitive?.name}</strong></span>
								{#if activity.score}<span class="text-surface-500"> ({activity.score}%)</span>{/if}
							{:else if activity.type === 'exercise_attempted'}
								<span>Attempted exercise in <strong>{primitive?.name}</strong></span>
							{:else if activity.type === 'level_up'}
								<span class="text-accent-400">Leveled up! 🎉</span>
							{:else if activity.type === 'streak_milestone'}
								<span class="text-orange-400">Streak milestone!</span>
							{:else if activity.type === 'primitive_mastered'}
								<span>Mastered <strong>{primitive?.name}</strong>! 🏆</span>
							{/if}
						</div>
						{#if activity.xpEarned && activity.xpEarned > 0}
							<span class="text-primary-400 font-medium">+{activity.xpEarned} XP</span>
						{/if}
						<span class="text-xs text-surface-500">
							{new Date(activity.timestamp).toLocaleDateString()}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

