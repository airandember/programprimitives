<script lang="ts">
	import { Trophy, Star, Flame, BookOpen, Sparkles } from 'lucide-svelte';
	import {
		gamification,
		unlockedAchievements,
		inProgressAchievements,
		ACHIEVEMENTS,
		RARITY_COLORS,
		type AchievementCategory,
	} from '$lib/stores/gamification';
	import AchievementBadge from './AchievementBadge.svelte';

	export let compact = false;

	const categories: { id: AchievementCategory; name: string; icon: typeof Trophy }[] = [
		{ id: 'completion', name: 'Completion', icon: Trophy },
		{ id: 'streak', name: 'Streaks', icon: Flame },
		{ id: 'mastery', name: 'Mastery', icon: Star },
		{ id: 'special', name: 'Special', icon: Sparkles },
	];

	let selectedCategory: AchievementCategory | 'all' = 'all';

	$: filteredAchievements = selectedCategory === 'all'
		? ACHIEVEMENTS
		: ACHIEVEMENTS.filter(a => a.category === selectedCategory);

	function getProgressForAchievement(id: string) {
		return $gamification.achievements.find(ua => ua.achievementId === id);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
				<Trophy size={20} class="text-yellow-400" />
			</div>
			<div>
				<h2 class="font-semibold text-lg">Achievements</h2>
				<p class="text-sm text-surface-500">
					{$unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
				</p>
			</div>
		</div>
	</div>

	<!-- Recently Unlocked -->
	{#if $unlockedAchievements.length > 0 && !compact}
		<div>
			<h3 class="text-sm font-medium text-surface-400 mb-3">Recently Unlocked</h3>
			<div class="flex gap-4 overflow-x-auto pb-2">
				{#each $unlockedAchievements.slice(0, 5) as ach}
					<div class="flex flex-col items-center gap-2 min-w-fit">
						<AchievementBadge
							achievement={ach}
							userAchievement={{ achievementId: ach.id, progress: 100, isUnlocked: true, unlockedAt: ach.unlockedAt }}
							size="md"
						/>
						<span class="text-xs text-surface-400 text-center max-w-16 truncate">
							{ach.name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- In Progress -->
	{#if $inProgressAchievements.length > 0}
		<div>
			<h3 class="text-sm font-medium text-surface-400 mb-3">Almost There!</h3>
			<div class="grid grid-cols-2 gap-3">
				{#each $inProgressAchievements.slice(0, 4) as ach}
					{@const userAch = getProgressForAchievement(ach.id)}
					<div class="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
						<AchievementBadge
							achievement={ach}
							userAchievement={userAch}
							size="sm"
							showProgress={false}
						/>
						<div class="flex-1 min-w-0">
							<div class="font-medium text-sm truncate">{ach.name}</div>
							<div class="flex items-center gap-2 mt-1">
								<div class="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
									<div
										class="h-full bg-gradient-to-r from-{RARITY_COLORS[ach.rarity]} to-{RARITY_COLORS[ach.rarity]}"
										style="width: {ach.progress}%"
									></div>
								</div>
								<span class="text-xs text-surface-500">{ach.progress}%</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- All Achievements (not in compact mode) -->
	{#if !compact}
		<div>
			<!-- Category tabs -->
			<div class="flex gap-2 mb-4 overflow-x-auto pb-1">
				<button
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
						{selectedCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-surface-800 text-surface-400 hover:text-surface-200'}"
					on:click={() => selectedCategory = 'all'}
				>
					All
				</button>
				{#each categories as cat}
					<button
						class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5
							{selectedCategory === cat.id ? 'bg-primary-500 text-white' : 'bg-surface-800 text-surface-400 hover:text-surface-200'}"
						on:click={() => selectedCategory = cat.id}
					>
						<svelte:component this={cat.icon} size={14} />
						{cat.name}
					</button>
				{/each}
			</div>

			<!-- Achievement grid -->
			<div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
				{#each filteredAchievements as achievement}
					{@const userAch = getProgressForAchievement(achievement.id)}
					<div class="flex flex-col items-center gap-2">
						<AchievementBadge
							{achievement}
							userAchievement={userAch}
							size="md"
						/>
						<span class="text-xs text-surface-400 text-center truncate max-w-full">
							{achievement.name}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

