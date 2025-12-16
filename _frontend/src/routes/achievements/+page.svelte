<script lang="ts">
	import { Trophy, Lock, Star, Zap, Flame, Target } from 'lucide-svelte';
	import { mockAchievements } from '$lib/mock-data';
	import type { Achievement } from '$lib/types';

	let selectedCategory = 'all';

	const categories = [
		{ id: 'all', name: 'All', icon: Trophy },
		{ id: 'milestone', name: 'Milestones', icon: Target },
		{ id: 'consistency', name: 'Consistency', icon: Flame },
		{ id: 'skill', name: 'Skills', icon: Zap },
		{ id: 'mastery', name: 'Mastery', icon: Star }
	];

	function getRarityColor(rarity: string): string {
		const colors: Record<string, string> = {
			common: 'from-surface-600 to-surface-700 border-surface-500',
			rare: 'from-blue-600 to-blue-800 border-blue-500',
			epic: 'from-purple-600 to-purple-800 border-purple-500',
			legendary: 'from-yellow-500 to-orange-600 border-yellow-400'
		};
		return colors[rarity] || colors.common;
	}

	function getRarityTextColor(rarity: string): string {
		const colors: Record<string, string> = {
			common: 'text-surface-400',
			rare: 'text-blue-400',
			epic: 'text-purple-400',
			legendary: 'text-yellow-400'
		};
		return colors[rarity] || colors.common;
	}

	$: filteredAchievements = mockAchievements.filter(
		(a) => selectedCategory === 'all' || a.category === selectedCategory
	);

	$: unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
	$: totalXpEarned = mockAchievements
		.filter((a) => a.unlocked)
		.reduce((sum, a) => sum + a.xpReward, 0);
</script>

<div class="min-h-screen">
	<!-- Header -->
	<div class="bg-gradient-to-b from-accent-500/10 via-surface-900/50 to-transparent py-16">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<h1 class="text-4xl sm:text-5xl font-display font-bold mb-4">
						<span class="text-gradient">Achievements</span>
					</h1>
					<p class="text-surface-400 text-lg">
						Unlock badges, earn rewards, and showcase your coding journey.
					</p>
				</div>

				<!-- Stats -->
				<div class="flex gap-6">
					<div class="text-center">
						<div class="text-3xl font-bold text-primary-400">{unlockedCount}</div>
						<div class="text-sm text-surface-500">Unlocked</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-surface-400">
							{mockAchievements.length - unlockedCount}
						</div>
						<div class="text-sm text-surface-500">Locked</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-accent-400">{totalXpEarned}</div>
						<div class="text-sm text-surface-500">XP Earned</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-4">
		<!-- Category Tabs -->
		<div class="flex gap-2 mb-8 overflow-x-auto pb-2">
			{#each categories as cat}
				<button
					on:click={() => (selectedCategory = cat.id)}
					class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                   {selectedCategory === cat.id
						? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
						: 'bg-surface-800/50 text-surface-400 border border-transparent hover:border-surface-700'}"
				>
					<svelte:component this={cat.icon} size={16} />
					{cat.name}
				</button>
			{/each}
		</div>

		<!-- Achievements Grid -->
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{#each filteredAchievements as achievement}
				<div
					class="card overflow-hidden group {achievement.unlocked
						? ''
						: 'opacity-60'}"
				>
					<!-- Badge Header -->
					<div
						class="h-24 bg-gradient-to-br {getRarityColor(
							achievement.rarity
						)} border-b flex items-center justify-center relative"
					>
						<span class="text-5xl {achievement.unlocked ? '' : 'grayscale opacity-50'}">
							{achievement.icon}
						</span>

						{#if !achievement.unlocked}
							<div class="absolute inset-0 flex items-center justify-center bg-black/40">
								<Lock size={24} class="text-surface-400" />
							</div>
						{/if}

						<!-- Rarity badge -->
						<div
							class="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium capitalize {getRarityTextColor(
								achievement.rarity
							)} bg-black/30"
						>
							{achievement.rarity}
						</div>
					</div>

					<!-- Content -->
					<div class="p-4">
						<h3 class="font-semibold mb-1">{achievement.name}</h3>
						<p class="text-sm text-surface-400 mb-3">{achievement.description}</p>

						<div class="flex items-center justify-between text-sm">
							<div class="flex items-center gap-1 text-accent-400">
								<Zap size={14} />
								<span>+{achievement.xpReward} XP</span>
							</div>

							{#if achievement.unlocked && achievement.unlockedAt}
								<span class="text-surface-500 text-xs">
									{new Date(achievement.unlockedAt).toLocaleDateString()}
								</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Empty state -->
		{#if filteredAchievements.length === 0}
			<div class="text-center py-20">
				<div class="text-6xl mb-4">🏆</div>
				<h3 class="text-xl font-semibold mb-2">No achievements in this category</h3>
				<p class="text-surface-400">Keep practicing to unlock more!</p>
			</div>
		{/if}
	</div>
</div>

