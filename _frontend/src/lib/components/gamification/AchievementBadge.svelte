<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import type { Achievement, UserAchievement } from '$lib/stores/gamification';
	import { RARITY_COLORS } from '$lib/stores/gamification';

	export let achievement: Achievement;
	export let userAchievement: UserAchievement | undefined = undefined;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let showProgress = true;

	$: isUnlocked = userAchievement?.isUnlocked ?? false;
	$: progress = userAchievement?.progress ?? 0;
	$: rarityColor = RARITY_COLORS[achievement.rarity];

	const sizes = {
		sm: {
			badge: 'w-12 h-12',
			icon: 'text-xl',
			ring: 'ring-2',
		},
		md: {
			badge: 'w-16 h-16',
			icon: 'text-2xl',
			ring: 'ring-3',
		},
		lg: {
			badge: 'w-20 h-20',
			icon: 'text-3xl',
			ring: 'ring-4',
		},
	};

	$: sizeClasses = sizes[size];
</script>

<div class="group relative">
	<!-- Badge -->
	<div
		class="{sizeClasses.badge} rounded-2xl flex items-center justify-center transition-all duration-300
			{isUnlocked 
				? `bg-${rarityColor}/20 ${sizeClasses.ring} ring-${rarityColor}/50 group-hover:ring-${rarityColor} group-hover:scale-110` 
				: 'bg-surface-800/50 ring-1 ring-surface-700 opacity-60 grayscale'}"
	>
		{#if isUnlocked}
			<span class={sizeClasses.icon}>{achievement.icon}</span>
		{:else}
			<Lock size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} class="text-surface-600" />
		{/if}
	</div>

	<!-- Progress ring (for in-progress achievements) -->
	{#if !isUnlocked && progress > 0 && showProgress}
		<svg
			class="absolute inset-0 -rotate-90"
			viewBox="0 0 100 100"
		>
			<circle
				cx="50"
				cy="50"
				r="45"
				stroke="currentColor"
				stroke-width="4"
				fill="none"
				class="text-surface-700"
			/>
			<circle
				cx="50"
				cy="50"
				r="45"
				stroke="currentColor"
				stroke-width="4"
				fill="none"
				stroke-dasharray={`${progress * 2.83} 283`}
				class="text-{rarityColor} transition-all duration-500"
			/>
		</svg>
	{/if}

	<!-- Tooltip -->
	<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
		<div class="bg-surface-900 border border-surface-700 rounded-lg p-3 shadow-xl min-w-48 text-center">
			<div class="font-semibold mb-1">{achievement.name}</div>
			<div class="text-sm text-surface-400 mb-2">{achievement.description}</div>
			{#if isUnlocked}
				<div class="text-xs text-{rarityColor}">
					Unlocked! +{achievement.xpReward} XP
				</div>
			{:else if progress > 0}
				<div class="flex items-center gap-2 justify-center">
					<div class="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
						<div class="h-full bg-{rarityColor}" style="width: {progress}%"></div>
					</div>
					<span class="text-xs text-surface-500">{progress}%</span>
				</div>
			{:else}
				<div class="text-xs text-surface-500">
					{achievement.xpReward} XP reward
				</div>
			{/if}
		</div>
	</div>
</div>

