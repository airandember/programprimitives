<script lang="ts">
	import { user, isAuthenticated } from '$lib/stores/auth';
	import { progress, MASTERY_LEVELS } from '$lib/stores/progress';
	import { gamification, getLevelTitle, unlockedAchievements } from '$lib/stores/gamification';
	import ProgressDashboard from '$lib/components/progress/ProgressDashboard.svelte';
	import AchievementsPanel from '$lib/components/gamification/AchievementsPanel.svelte';
	import DailyChallenges from '$lib/components/gamification/DailyChallenges.svelte';
	import { Flame, Trophy, Zap, Target, TrendingUp, BookOpen, ChevronRight, Star, Lock, LogIn } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Dashboard | ProgramPrimitives</title>
</svelte:head>

{#if !$isAuthenticated}
	<!-- Auth Required -->
	<div class="min-h-screen flex items-center justify-center py-12">
		<div class="max-w-md mx-auto px-4 text-center">
			<div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6">
				<Lock size={40} class="text-primary-400" />
			</div>
			<h1 class="text-3xl font-display font-bold mb-4">Sign in to view your Dashboard</h1>
			<p class="text-surface-400 mb-8">
				Track your progress, see your achievements, and continue your learning journey.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a href="/login" class="btn btn-primary">
					<LogIn size={18} />
					Sign In
				</a>
				<a href="/register" class="btn btn-secondary">
					Create Account
				</a>
			</div>
			<p class="text-sm text-surface-500 mt-6">
				Want to try first? <a href="/try" class="text-primary-400 hover:underline">Start for free</a>
			</p>
		</div>
	</div>
{:else}
<div class="min-h-screen py-12">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-display font-bold mb-2">
						Welcome back{#if $user}, {$user.displayName || $user.email.split('@')[0]}{/if}! 👋
					</h1>
					<p class="text-surface-400">
						Level {$progress.currentLevel} {getLevelTitle($progress.currentLevel)} • 
						{$progress.totalXp.toLocaleString()} XP
					</p>
				</div>
				<div class="hidden sm:flex items-center gap-4">
					<a href="/learn" class="btn btn-secondary">
						<BookOpen size={18} />
						Learn
					</a>
					<a href="/practice" class="btn btn-primary">
						<Target size={18} />
						Practice
					</a>
				</div>
			</div>
		</div>

		<!-- Quick Stats -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<div class="card p-5 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
						<Flame size={24} class="text-orange-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-orange-400">{$progress.currentDailyStreak}</div>
						<div class="text-sm text-surface-500">Day Streak</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
						<Zap size={24} class="text-primary-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-400">{$gamification.weeklyXp}</div>
						<div class="text-sm text-surface-500">Weekly XP</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-accent-500/10 to-transparent border-accent-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
						<Trophy size={24} class="text-accent-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-accent-400">{$unlockedAchievements.length}</div>
						<div class="text-sm text-surface-500">Achievements</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
						<TrendingUp size={24} class="text-purple-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-purple-400">{$progress.totalExercisesCompleted}</div>
						<div class="text-sm text-surface-500">Completed</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Left Column: Progress -->
			<div class="lg:col-span-2">
				<ProgressDashboard />
			</div>

			<!-- Right Column: Gamification -->
			<div class="space-y-6">
				<!-- Daily Challenges -->
				<DailyChallenges />

				<!-- Achievements Preview -->
				<div class="card p-5">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold flex items-center gap-2">
							<Trophy size={18} class="text-yellow-400" />
							Achievements
						</h3>
						<a href="/achievements" class="text-sm text-primary-400 hover:underline flex items-center gap-1">
							View all
							<ChevronRight size={14} />
						</a>
					</div>
					
					<!-- Recent badges -->
					<div class="flex gap-3 flex-wrap">
						{#each $unlockedAchievements.slice(0, 6) as ach}
							<div
								class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-xl"
								title={ach.name}
							>
								{ach.icon}
							</div>
						{/each}
						{#if $unlockedAchievements.length === 0}
							<p class="text-sm text-surface-500">Complete exercises to earn badges!</p>
						{/if}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="card p-5">
					<h3 class="font-semibold mb-4">Continue Learning</h3>
					<div class="space-y-2">
						{#each $progress.mastery.filter(m => m.level < 5).slice(0, 3) as mastery}
							{@const levelInfo = MASTERY_LEVELS[mastery.level]}
							<a
								href="/learn/{mastery.primitiveId}"
								class="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg hover:bg-surface-800 transition-colors group"
							>
								<div class="flex-1">
									<div class="font-medium text-sm capitalize">
										{mastery.primitiveId.replace('-', ' ')}
									</div>
									<div class="text-xs text-surface-500">
										{mastery.exercisesCompleted}/{mastery.exercisesAvailable} exercises
									</div>
								</div>
								<div class="flex items-center gap-1 text-xs text-{levelInfo.color}">
									<Star size={12} class="fill-current" />
									{mastery.level}/5
								</div>
								<ChevronRight size={16} class="text-surface-600 group-hover:text-primary-400 transition-colors" />
							</a>
						{/each}
						
						{#if $progress.mastery.length === 0}
							<a href="/practice" class="btn btn-primary w-full justify-center">
								Start Your First Exercise
							</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
{/if}
