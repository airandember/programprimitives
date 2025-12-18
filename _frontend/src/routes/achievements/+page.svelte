<script lang="ts">
	import AchievementsPanel from '@braids/gamification/frontend/components/AchievementsPanel.svelte';
	import { achievementXp, unlockedAchievements, ACHIEVEMENTS } from '$lib/stores/gamification';
	import { isAuthenticated } from '$lib/stores/auth';
	import { Trophy, Zap, Lock, LogIn } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Achievements | ProgramPrimitives</title>
</svelte:head>

{#if !$isAuthenticated}
	<!-- Auth Required -->
	<div class="min-h-screen flex items-center justify-center py-12">
		<div class="max-w-md mx-auto px-4 text-center">
			<div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
				<Trophy size={40} class="text-yellow-400" />
			</div>
			<h1 class="text-3xl font-display font-bold mb-4">Sign in to view Achievements</h1>
			<p class="text-surface-400 mb-8">
				Complete exercises, earn badges, and track your accomplishments.
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
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
				<Trophy size={40} class="text-yellow-400" />
			</div>
			<h1 class="text-4xl font-display font-bold mb-4">Achievements</h1>
			<p class="text-surface-400 mb-6">
				Collect badges, earn XP, and show off your progress
			</p>
			
			<!-- Stats -->
			<div class="inline-flex items-center gap-8 bg-surface-800/50 rounded-xl px-8 py-4 border border-surface-700">
				<div class="text-center">
					<div class="text-3xl font-bold text-yellow-400">{$unlockedAchievements.length}</div>
					<div class="text-sm text-surface-500">Unlocked</div>
				</div>
				<div class="w-px h-10 bg-surface-700"></div>
				<div class="text-center">
					<div class="text-3xl font-bold text-surface-400">{ACHIEVEMENTS.length - $unlockedAchievements.length}</div>
					<div class="text-sm text-surface-500">Remaining</div>
				</div>
				<div class="w-px h-10 bg-surface-700"></div>
				<div class="text-center">
					<div class="text-3xl font-bold text-primary-400 flex items-center gap-1">
						<Zap size={24} />
						{$achievementXp}
					</div>
					<div class="text-sm text-surface-500">XP from Badges</div>
				</div>
			</div>
		</div>

		<!-- Achievements Panel -->
		<div class="card p-6">
			<AchievementsPanel />
		</div>
	</div>
</div>
{/if}
