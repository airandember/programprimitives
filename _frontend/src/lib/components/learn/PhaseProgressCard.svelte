<script lang="ts">
	import { ChevronRight, Lock, Check } from 'lucide-svelte';
	
	export let phase: 'blueprint' | 'crafting' | 'mastery';
	export let title: string;
	export let subtitle: string;
	export let progress: number = 0; // 0-100
	export let totalLessons: number = 0;
	export let completedLessons: number = 0;
	export let isActive: boolean = false;
	export let isLocked: boolean = false;
	export let metaphorStage: string = '';
	export let href: string = '#';
	
	const phaseConfig = {
		blueprint: {
			icon: '📐',
			color: 'sky',
			bgGradient: 'from-sky-500/10 to-sky-700/10',
			borderColor: 'border-sky-500/30',
			textColor: 'text-sky-400',
			progressColor: 'from-sky-500 to-sky-400',
		},
		crafting: {
			icon: '🔨',
			color: 'amber',
			bgGradient: 'from-amber-500/10 to-amber-700/10',
			borderColor: 'border-amber-500/30',
			textColor: 'text-amber-400',
			progressColor: 'from-amber-500 to-amber-400',
		},
		mastery: {
			icon: '🔩',
			color: 'emerald',
			bgGradient: 'from-emerald-500/10 to-emerald-700/10',
			borderColor: 'border-emerald-500/30',
			textColor: 'text-emerald-400',
			progressColor: 'from-emerald-500 to-emerald-400',
		},
	};
	
	$: config = phaseConfig[phase];
	$: isComplete = progress >= 100;
</script>

<a 
	{href}
	class="block relative group"
	class:pointer-events-none={isLocked}
	class:opacity-50={isLocked}
>
	<div 
		class="card p-5 transition-all duration-300 overflow-hidden
		{isActive ? 'ring-2 ring-' + config.color + '-500/50' : ''}
		{!isLocked ? 'hover:border-' + config.color + '-500/50 hover:shadow-lg hover:shadow-' + config.color + '-500/10' : ''}"
	>
		<!-- Background Animation Layer -->
		{#if isActive && !isComplete}
			<div class="absolute inset-0 bg-gradient-to-r {config.bgGradient} animate-pulse opacity-50"></div>
		{/if}
		
		<!-- Content -->
		<div class="relative">
			<!-- Header -->
			<div class="flex items-start gap-4 mb-4">
				<!-- Phase Icon -->
				<div class="relative">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br {config.bgGradient} border {config.borderColor} flex items-center justify-center text-2xl transition-transform group-hover:scale-105">
						{config.icon}
					</div>
					{#if isComplete}
						<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-{config.color}-500 flex items-center justify-center">
							<Check size={12} class="text-white" />
						</div>
					{/if}
					{#if isLocked}
						<div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-surface-600 flex items-center justify-center">
							<Lock size={10} class="text-surface-400" />
						</div>
					{/if}
				</div>
				
				<!-- Text -->
				<div class="flex-1 min-w-0">
					<h3 class="text-lg font-semibold {config.textColor} mb-1">{title}</h3>
					<p class="text-sm text-surface-400">{subtitle}</p>
					{#if metaphorStage}
						<p class="text-xs text-surface-500 mt-1 italic">{metaphorStage}</p>
					{/if}
				</div>
				
				<!-- Progress Badge -->
				<div class="text-right">
					<div class="text-2xl font-bold {config.textColor}">{Math.round(progress)}%</div>
					<div class="text-xs text-surface-500">{completedLessons}/{totalLessons}</div>
				</div>
			</div>
			
			<!-- Progress Bar -->
			<div class="h-2 bg-surface-800 rounded-full overflow-hidden mb-3">
				<div 
					class="h-full bg-gradient-to-r {config.progressColor} transition-all duration-700 ease-out relative"
					style="width: {progress}%"
				>
					{#if isActive && progress < 100}
						<div class="absolute inset-0 bg-white/20 animate-shimmer"></div>
					{/if}
				</div>
			</div>
			
			<!-- Footer -->
			<div class="flex items-center justify-between text-sm">
				<span class="text-surface-500">
					{#if isComplete}
						✨ Complete!
					{:else if isActive}
						In progress...
					{:else if isLocked}
						Complete previous phase to unlock
					{:else}
						Ready to start
					{/if}
				</span>
				{#if !isLocked}
					<span class="flex items-center gap-1 {config.textColor} group-hover:gap-2 transition-all">
						{isComplete ? 'Review' : 'Continue'}
						<ChevronRight size={16} />
					</span>
				{/if}
			</div>
		</div>
	</div>
</a>

<style>
	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}
	
	.animate-shimmer {
		animation: shimmer 2s infinite;
	}
	
	/* Dynamic Tailwind classes */
	:global(.ring-sky-500\/50) { --tw-ring-color: rgba(14, 165, 233, 0.5); }
	:global(.ring-amber-500\/50) { --tw-ring-color: rgba(245, 158, 11, 0.5); }
	:global(.ring-emerald-500\/50) { --tw-ring-color: rgba(16, 185, 129, 0.5); }
</style>
