<script lang="ts">
	import { Clock, Check, Zap } from 'lucide-svelte';
	import { gamification, dailyChallengeProgress } from '../stores/gamification';

	function formatTimeRemaining(expiresAt: string): string {
		const now = new Date();
		const expires = new Date(expiresAt);
		const diff = expires.getTime() - now.getTime();
		
		if (diff <= 0) return 'Expired';
		
		const hours = Math.floor(diff / 3600000);
		const minutes = Math.floor((diff % 3600000) / 60000);
		
		if (hours > 0) return `${hours}h ${minutes}m left`;
		return `${minutes}m left`;
	}
</script>

<div class="card p-5">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
				<Zap size={20} class="text-primary-400" />
			</div>
			<div>
				<h3 class="font-semibold">Daily Challenges</h3>
				<p class="text-sm text-surface-500">{$dailyChallengeProgress}% complete</p>
			</div>
		</div>
		<div class="flex items-center gap-1.5 text-xs text-surface-500">
			<Clock size={14} />
			{formatTimeRemaining($gamification.dailyChallenges[0]?.expiresAt || '')}
		</div>
	</div>

	<div class="space-y-3">
		{#each $gamification.dailyChallenges as challenge}
			{@const isComplete = challenge.current >= challenge.target}
			<div
				class="p-4 rounded-lg border transition-colors
					{isComplete 
						? 'bg-primary-500/10 border-primary-500/30' 
						: 'bg-surface-800/50 border-surface-700'}"
			>
				<div class="flex items-start justify-between gap-3 mb-2">
					<div class="flex items-center gap-2">
						{#if isComplete}
							<div class="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
								<Check size={14} class="text-white" />
							</div>
						{:else}
							<div class="w-6 h-6 rounded-full bg-surface-700 flex items-center justify-center text-xs font-medium">
								{challenge.current}
							</div>
						{/if}
						<div>
							<div class="font-medium text-sm">{challenge.title}</div>
							<div class="text-xs text-surface-500">{challenge.description}</div>
						</div>
					</div>
					<div class="text-sm font-medium text-primary-400 shrink-0">
						+{challenge.xpReward} XP
					</div>
				</div>

				<!-- Progress bar -->
				<div class="flex items-center gap-2">
					<div class="flex-1 h-2 bg-surface-700 rounded-full overflow-hidden">
						<div
							class="h-full transition-all duration-500
								{isComplete ? 'bg-primary-500' : 'bg-gradient-to-r from-primary-500/50 to-accent-500/50'}"
							style="width: {Math.min(100, (challenge.current / challenge.target) * 100)}%"
						></div>
					</div>
					<span class="text-xs text-surface-500 min-w-fit">
						{challenge.current} / {challenge.target}
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>

