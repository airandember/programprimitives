<script lang="ts">
	import {
		Flame,
		Zap,
		Target,
		Clock,
		TrendingUp,
		Calendar,
		Award,
		ChevronRight
	} from 'lucide-svelte';

	// Mock data - would come from progress store
	const stats = {
		currentStreak: 7,
		longestStreak: 23,
		totalXp: 2450,
		level: 8,
		exercisesCompleted: 47,
		timeSpentHours: 12,
		primitivesStarted: 12,
		primitivesMastered: 5
	};

	// Mock mastery data
	const masteryData = [
		{ name: 'For Loop', language: 'javascript', level: 5, progress: 100 },
		{ name: 'While Loop', language: 'javascript', level: 4, progress: 80 },
		{ name: 'If/Else', language: 'javascript', level: 5, progress: 100 },
		{ name: 'Arrays', language: 'javascript', level: 3, progress: 60 },
		{ name: 'Functions', language: 'javascript', level: 2, progress: 40 },
		{ name: 'For Loop', language: 'python', level: 3, progress: 60 }
	];

	// Mock activity for calendar (last 7 weeks)
	const activityCalendar = Array(49)
		.fill(0)
		.map(() => Math.floor(Math.random() * 5));

	// Recent achievements
	const recentAchievements = [
		{ name: 'Week Warrior', icon: '🔥', date: '2 days ago' },
		{ name: 'Loop Legend', icon: '🔄', date: '5 days ago' },
		{ name: 'First Steps', icon: '👣', date: '2 weeks ago' }
	];

	function getActivityColor(level: number): string {
		const colors = [
			'bg-surface-800',
			'bg-primary-900',
			'bg-primary-700',
			'bg-primary-500',
			'bg-primary-400'
		];
		return colors[level] || colors[0];
	}

	function getMasteryColor(level: number): string {
		const colors = ['text-surface-500', 'text-surface-400', 'text-yellow-500', 'text-orange-500', 'text-primary-500', 'text-accent-400'];
		return colors[level] || colors[0];
	}
</script>

<div class="min-h-screen">
	<!-- Header -->
	<div class="bg-gradient-to-b from-surface-900 to-transparent py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl sm:text-4xl font-display font-bold mb-4">Dashboard</h1>
			<p class="text-surface-400">Track your progress and keep the momentum going!</p>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
		<!-- Stats Grid -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<!-- Streak -->
			<div class="card p-5">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
						<Flame size={20} class="text-orange-500" />
					</div>
					<span class="text-surface-400 text-sm">Current Streak</span>
				</div>
				<div class="text-3xl font-bold">{stats.currentStreak} <span class="text-surface-500 text-lg font-normal">days</span></div>
				<div class="text-surface-500 text-sm mt-1">Best: {stats.longestStreak} days</div>
			</div>

			<!-- XP -->
			<div class="card p-5">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
						<Zap size={20} class="text-accent-500" />
					</div>
					<span class="text-surface-400 text-sm">Total XP</span>
				</div>
				<div class="text-3xl font-bold">{stats.totalXp.toLocaleString()}</div>
				<div class="text-surface-500 text-sm mt-1">Level {stats.level}</div>
			</div>

			<!-- Exercises -->
			<div class="card p-5">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
						<Target size={20} class="text-primary-500" />
					</div>
					<span class="text-surface-400 text-sm">Exercises</span>
				</div>
				<div class="text-3xl font-bold">{stats.exercisesCompleted}</div>
				<div class="text-surface-500 text-sm mt-1">completed</div>
			</div>

			<!-- Time -->
			<div class="card p-5">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
						<Clock size={20} class="text-purple-500" />
					</div>
					<span class="text-surface-400 text-sm">Time Spent</span>
				</div>
				<div class="text-3xl font-bold">{stats.timeSpentHours} <span class="text-surface-500 text-lg font-normal">hrs</span></div>
				<div class="text-surface-500 text-sm mt-1">learning</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Left Column -->
			<div class="lg:col-span-2 space-y-8">
				<!-- Activity Calendar -->
				<div class="card p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="font-semibold text-lg flex items-center gap-2">
							<Calendar size={20} class="text-primary-400" />
							Activity
						</h2>
						<span class="text-surface-500 text-sm">Last 7 weeks</span>
					</div>

					<div class="grid grid-cols-7 gap-1">
						{#each activityCalendar as level}
							<div
								class="aspect-square rounded {getActivityColor(level)}"
								title="{level} activities"
							></div>
						{/each}
					</div>

					<div class="flex items-center justify-end gap-2 mt-4 text-sm text-surface-500">
						<span>Less</span>
						{#each [0, 1, 2, 3, 4] as level}
							<div class="w-3 h-3 rounded {getActivityColor(level)}"></div>
						{/each}
						<span>More</span>
					</div>
				</div>

				<!-- Mastery Progress -->
				<div class="card p-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="font-semibold text-lg flex items-center gap-2">
							<TrendingUp size={20} class="text-primary-400" />
							Primitive Mastery
						</h2>
						<a href="/dashboard/primitives" class="text-primary-400 text-sm hover:underline"
							>View all</a
						>
					</div>

					<div class="space-y-4">
						{#each masteryData.slice(0, 5) as item}
							<div>
								<div class="flex items-center justify-between mb-2">
									<div class="flex items-center gap-2">
										<span class="font-medium">{item.name}</span>
										<span class="text-surface-500 text-xs">({item.language})</span>
									</div>
									<span class={getMasteryColor(item.level)}>Level {item.level}</span>
								</div>
								<div class="progress-bar">
									<div class="progress-fill" style="width: {item.progress}%"></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Column -->
			<div class="space-y-8">
				<!-- Level Progress -->
				<div class="card p-6">
					<h2 class="font-semibold text-lg mb-4">Level Progress</h2>
					<div class="text-center mb-4">
						<div
							class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold"
						>
							{stats.level}
						</div>
					</div>
					<div class="text-center mb-4">
						<div class="text-surface-400 text-sm mb-1">Practitioner</div>
						<div class="text-surface-500 text-xs">550 XP to next level</div>
					</div>
					<div class="progress-bar">
						<div class="progress-fill" style="width: 78%"></div>
					</div>
				</div>

				<!-- Recent Achievements -->
				<div class="card p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="font-semibold text-lg flex items-center gap-2">
							<Award size={20} class="text-primary-400" />
							Achievements
						</h2>
						<a href="/achievements" class="text-primary-400 text-sm hover:underline">View all</a>
					</div>

					<div class="space-y-3">
						{#each recentAchievements as achievement}
							<div class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50">
								<span class="text-2xl">{achievement.icon}</span>
								<div class="flex-1">
									<div class="font-medium">{achievement.name}</div>
									<div class="text-surface-500 text-xs">{achievement.date}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="card p-6">
					<h2 class="font-semibold text-lg mb-4">Continue Learning</h2>
					<div class="space-y-2">
						<a
							href="/practice/for-loop/ex-003"
							class="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
						>
							<div>
								<div class="font-medium">Nested Loops</div>
								<div class="text-surface-500 text-sm">For Loop</div>
							</div>
							<ChevronRight size={18} class="text-surface-500" />
						</a>
						<a
							href="/learn/arrays"
							class="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
						>
							<div>
								<div class="font-medium">Learn Arrays</div>
								<div class="text-surface-500 text-sm">Next primitive</div>
							</div>
							<ChevronRight size={18} class="text-surface-500" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

