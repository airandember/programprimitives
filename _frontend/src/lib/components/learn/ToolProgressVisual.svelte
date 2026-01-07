<script lang="ts">
	import { onMount } from 'svelte';
	import type { ToolMetaphor } from '@braids/core/types';
	
	export let metaphor: ToolMetaphor | null = null;
	export let blueprintProgress: number = 0; // 0-100
	export let craftingProgress: number = 0;
	export let masteryProgress: number = 0;
	export let compact: boolean = false;
	
	// Calculate overall phase
	$: currentPhase = blueprintProgress < 100 ? 'blueprint' 
		: craftingProgress < 100 ? 'crafting' 
		: masteryProgress < 100 ? 'mastery' 
		: 'complete';
	
	$: overallProgress = (blueprintProgress + craftingProgress + masteryProgress) / 3;
	
	// Animation state
	let mounted = false;
	onMount(() => {
		setTimeout(() => mounted = true, 100);
	});
</script>

<div class="tool-progress-visual {compact ? 'compact' : ''}">
	<!-- Main Visual Container -->
	<div class="relative">
		<!-- Background Glow -->
		<div class="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent rounded-2xl blur-xl opacity-50"></div>
		
		<!-- Tool Display -->
		<div class="relative bg-surface-800/50 rounded-2xl border border-surface-700 overflow-hidden">
			<!-- Phase Progress Indicators -->
			<div class="flex border-b border-surface-700">
				<!-- Blueprint Phase -->
				<div class="flex-1 p-3 border-r border-surface-700 {currentPhase === 'blueprint' ? 'bg-sky-500/10' : ''}">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-lg">📐</span>
						<span class="text-xs font-medium {blueprintProgress >= 100 ? 'text-sky-400' : 'text-surface-400'}">
							Blueprint
						</span>
					</div>
					<div class="h-1 bg-surface-700 rounded-full overflow-hidden">
						<div 
							class="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-700 ease-out"
							style="width: {mounted ? blueprintProgress : 0}%"
						></div>
					</div>
				</div>
				
				<!-- Crafting Phase -->
				<div class="flex-1 p-3 border-r border-surface-700 {currentPhase === 'crafting' ? 'bg-amber-500/10' : ''}">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-lg">🔨</span>
						<span class="text-xs font-medium {craftingProgress >= 100 ? 'text-amber-400' : 'text-surface-400'}">
							Crafting
						</span>
					</div>
					<div class="h-1 bg-surface-700 rounded-full overflow-hidden">
						<div 
							class="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 ease-out"
							style="width: {mounted ? craftingProgress : 0}%"
						></div>
					</div>
				</div>
				
				<!-- Mastery Phase -->
				<div class="flex-1 p-3 {currentPhase === 'mastery' ? 'bg-emerald-500/10' : ''}">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-lg">🔩</span>
						<span class="text-xs font-medium {masteryProgress >= 100 ? 'text-emerald-400' : 'text-surface-400'}">
							Mastery
						</span>
					</div>
					<div class="h-1 bg-surface-700 rounded-full overflow-hidden">
						<div 
							class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
							style="width: {mounted ? masteryProgress : 0}%"
						></div>
					</div>
				</div>
			</div>
			
			<!-- Tool Visualization -->
			<div class="p-6 flex items-center justify-center" class:p-4={compact}>
				<div class="relative">
					<!-- Blueprint Layer (fades as completed) -->
					<div 
						class="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
						style="opacity: {blueprintProgress < 100 ? 0.3 + (blueprintProgress / 100) * 0.7 : 1}"
					>
						<!-- Blueprint Lines Animation -->
						<svg viewBox="0 0 100 100" class="w-32 h-32 {compact ? 'w-20 h-20' : ''}">
							<!-- Blueprint grid -->
							<defs>
								<pattern id="blueprint-grid" width="10" height="10" patternUnits="userSpaceOnUse">
									<path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.1)" stroke-width="0.5"/>
								</pattern>
							</defs>
							<rect width="100" height="100" fill="url(#blueprint-grid)" />
							
							<!-- Tool outline - draws as blueprint progresses -->
							<path
								d="M 50 10 L 80 30 L 80 70 L 50 90 L 20 70 L 20 30 Z"
								fill="none"
								stroke="rgba(56, 189, 248, 0.5)"
								stroke-width="2"
								stroke-dasharray="200"
								stroke-dashoffset="{200 - (blueprintProgress / 100) * 200}"
								class="transition-all duration-1000"
							/>
							
							<!-- Center detail -->
							<circle
								cx="50"
								cy="50"
								r="{10 + (blueprintProgress / 100) * 10}"
								fill="none"
								stroke="rgba(56, 189, 248, 0.3)"
								stroke-width="1"
								class="transition-all duration-700"
							/>
						</svg>
					</div>
					
					<!-- Tool Icon (reveals as crafting progresses) -->
					<div 
						class="relative flex items-center justify-center w-32 h-32 {compact ? 'w-20 h-20' : ''}"
						style="opacity: {craftingProgress > 0 ? 0.3 + (craftingProgress / 100) * 0.7 : 0}"
					>
						<div 
							class="text-6xl {compact ? 'text-4xl' : ''} transition-transform duration-500"
							style="transform: scale({0.5 + (craftingProgress / 100) * 0.5})"
						>
							{metaphor?.metaphorIcon || '🔧'}
						</div>
					</div>
					
					<!-- Mastery Glow (appears as mastery progresses) -->
					{#if masteryProgress > 0}
						<div 
							class="absolute inset-0 flex items-center justify-center pointer-events-none"
							style="opacity: {masteryProgress / 100}"
						>
							<div class="w-full h-full rounded-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 animate-pulse"></div>
						</div>
					{/if}
					
					<!-- Completion sparkles -->
					{#if overallProgress >= 100}
						<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
							{#each Array(6) as _, i}
								<div 
									class="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
									style="
										animation-delay: {i * 0.2}s;
										top: {20 + Math.sin(i * 60 * Math.PI / 180) * 40}%;
										left: {20 + Math.cos(i * 60 * Math.PI / 180) * 40}%;
									"
								></div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Stage Progress Text -->
			{#if metaphor && !compact}
				<div class="px-6 pb-4">
					<div class="bg-surface-900/50 rounded-lg p-3">
						<div class="text-xs text-surface-500 mb-1">Current Stage</div>
						<div class="font-medium">
							{#if currentPhase === 'blueprint'}
								<span class="text-sky-400">{metaphor.stage1Name}</span>
								<span class="text-surface-500"> → {metaphor.stage2Name} → {metaphor.stage3Name}</span>
							{:else if currentPhase === 'crafting'}
								<span class="text-surface-500">{metaphor.stage1Name} → </span>
								<span class="text-amber-400">{metaphor.stage2Name}</span>
								<span class="text-surface-500"> → {metaphor.stage3Name}</span>
							{:else if currentPhase === 'mastery'}
								<span class="text-surface-500">{metaphor.stage1Name} → {metaphor.stage2Name} → </span>
								<span class="text-emerald-400">{metaphor.stage3Name}</span>
							{:else}
								<span class="text-yellow-400">✨ {metaphor.stage3Name} - Mastered!</span>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.tool-progress-visual {
		@apply w-full;
	}
	
	.tool-progress-visual.compact {
		@apply max-w-xs;
	}
	
	/* Animations */
	@keyframes draw-line {
		from { stroke-dashoffset: 200; }
		to { stroke-dashoffset: 0; }
	}
</style>
