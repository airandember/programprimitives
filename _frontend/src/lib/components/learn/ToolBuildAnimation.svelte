<script lang="ts">
	import { onMount } from 'svelte';
	
	export let metaphorIcon: string = '🔧';
	export let metaphorName: string = 'Tool';
	export let blueprintProgress: number = 0;
	export let craftingProgress: number = 0;
	export let masteryProgress: number = 0;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	
	let mounted = false;
	
	onMount(() => {
		setTimeout(() => mounted = true, 100);
	});
	
	$: totalProgress = (blueprintProgress + craftingProgress + masteryProgress) / 3;
	$: phase = blueprintProgress < 100 ? 'blueprint' 
		: craftingProgress < 100 ? 'crafting' 
		: masteryProgress < 100 ? 'mastery' 
		: 'complete';
	
	$: sizeClasses = {
		sm: 'w-24 h-24',
		md: 'w-36 h-36',
		lg: 'w-48 h-48'
	}[size];
	
	$: iconSize = {
		sm: 'text-3xl',
		md: 'text-5xl',
		lg: 'text-6xl'
	}[size];
</script>

<div class="tool-build-animation {sizeClasses} relative mx-auto">
	<!-- Outer Glow Ring -->
	<div class="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 via-amber-500/20 to-emerald-500/20 blur-xl animate-pulse"></div>
	
	<!-- Main Container -->
	<div class="relative w-full h-full rounded-full bg-surface-800 border-2 border-surface-700 overflow-hidden">
		
		<!-- Blueprint Layer - Drawing Lines -->
		<svg 
			viewBox="0 0 100 100" 
			class="absolute inset-0 w-full h-full transition-opacity duration-500"
			style="opacity: {phase === 'blueprint' ? 1 : 0.3}"
		>
			<!-- Grid Pattern -->
			<defs>
				<pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
					<path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="0.5"/>
				</pattern>
			</defs>
			<rect width="100" height="100" fill="url(#grid)" />
			
			<!-- Blueprint outline drawing -->
			<circle
				cx="50" cy="50"
				r="35"
				fill="none"
				stroke="rgba(56, 189, 248, 0.5)"
				stroke-width="1"
				stroke-dasharray="220"
				stroke-dashoffset="{220 - (mounted ? blueprintProgress / 100 * 220 : 0)}"
				class="transition-all duration-1000"
			/>
			
			<!-- Blueprint inner details -->
			<path
				d="M 30 50 L 50 30 L 70 50 L 50 70 Z"
				fill="none"
				stroke="rgba(56, 189, 248, 0.4)"
				stroke-width="1"
				stroke-dasharray="120"
				stroke-dashoffset="{120 - (mounted ? Math.min(blueprintProgress * 1.5, 100) / 100 * 120 : 0)}"
				class="transition-all duration-700"
			/>
		</svg>
		
		<!-- Crafting Layer - Building the tool -->
		<div 
			class="absolute inset-0 flex items-center justify-center transition-all duration-700"
			style="
				opacity: {craftingProgress > 0 ? 0.2 + (craftingProgress / 100) * 0.8 : 0};
				transform: scale({0.5 + (craftingProgress / 100) * 0.5});
			"
		>
			<!-- Hammer Animation Overlay -->
			{#if phase === 'crafting' && craftingProgress < 100}
				<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div class="text-2xl animate-bounce opacity-50" style="animation-duration: 0.6s;">
						🔨
					</div>
				</div>
			{/if}
			
			<!-- The Tool Icon -->
			<span class="{iconSize} filter drop-shadow-lg transition-transform duration-500">
				{metaphorIcon}
			</span>
		</div>
		
		<!-- Mastery Layer - Glowing/Hardening -->
		{#if masteryProgress > 0}
			<div 
				class="absolute inset-0 pointer-events-none"
				style="opacity: {masteryProgress / 100}"
			>
				<!-- Glow effect -->
				<div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/20 to-yellow-500/30 animate-pulse"></div>
				
				<!-- Sparkles -->
				{#each Array(6) as _, i}
					<div 
						class="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
						style="
							animation-delay: {i * 0.3}s;
							animation-duration: 1.5s;
							top: {15 + Math.random() * 70}%;
							left: {15 + Math.random() * 70}%;
							opacity: {masteryProgress / 100};
						"
					></div>
				{/each}
			</div>
		{/if}
		
		<!-- Completion Crown -->
		{#if totalProgress >= 100}
			<div class="absolute -top-2 left-1/2 -translate-x-1/2 text-xl animate-bounce" style="animation-duration: 1.5s;">
				👑
			</div>
		{/if}
		
		<!-- Progress Ring -->
		<svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full -rotate-90">
			<circle
				cx="50" cy="50" r="48"
				fill="none"
				stroke="rgba(255,255,255,0.1)"
				stroke-width="2"
			/>
			<!-- Blue (Blueprint) segment -->
			<circle
				cx="50" cy="50" r="48"
				fill="none"
				stroke="rgb(56, 189, 248)"
				stroke-width="2"
				stroke-dasharray="{blueprintProgress * 1.005} 301"
				stroke-dashoffset="0"
				class="transition-all duration-700"
			/>
			<!-- Amber (Crafting) segment -->
			<circle
				cx="50" cy="50" r="48"
				fill="none"
				stroke="rgb(251, 191, 36)"
				stroke-width="2"
				stroke-dasharray="{craftingProgress * 1.005} 301"
				stroke-dashoffset="{-100.5}"
				class="transition-all duration-700"
			/>
			<!-- Green (Mastery) segment -->
			<circle
				cx="50" cy="50" r="48"
				fill="none"
				stroke="rgb(52, 211, 153)"
				stroke-width="2"
				stroke-dasharray="{masteryProgress * 1.005} 301"
				stroke-dashoffset="{-201}"
				class="transition-all duration-700"
			/>
		</svg>
	</div>
	
	<!-- Phase Label -->
	<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium
		{phase === 'blueprint' ? 'bg-sky-500/20 text-sky-400' : ''}
		{phase === 'crafting' ? 'bg-amber-500/20 text-amber-400' : ''}
		{phase === 'mastery' ? 'bg-emerald-500/20 text-emerald-400' : ''}
		{phase === 'complete' ? 'bg-yellow-500/20 text-yellow-400' : ''}
	">
		{phase === 'complete' ? '✨ Mastered' : phase.charAt(0).toUpperCase() + phase.slice(1)}
	</div>
</div>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-5px); }
	}
</style>
