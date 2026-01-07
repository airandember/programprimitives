<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { ChevronRight, Lock, Check, Clock, BookOpen, Hammer, Wrench } from 'lucide-svelte';
	import type { Lesson, ToolMetaphor } from '@braids/core/types';
	import { LESSON_PHASES } from '@braids/core/types/lesson';
	import { ToolBuildAnimation, PhaseProgressCard } from '$lib/components/learn';
	
	const toolId = $page.params.primitive;
	
	let lessons: { blueprint: Lesson[]; crafting: Lesson[]; mastery: Lesson[] } = {
		blueprint: [],
		crafting: [],
		mastery: []
	};
	let metaphor: ToolMetaphor | null = null;
	let loading = true;
	let error = '';
	
	// Mock progress for now (will come from user progress braid)
	let completedLessons = new Set<string>();
	
	onMount(async () => {
		try {
			const [lessonsRes, metaphorRes] = await Promise.all([
				fetch(`/api/tools/${toolId}/lessons`),
				fetch(`/api/tools/${toolId}/metaphor`)
			]);
			
			if (lessonsRes.ok) {
				const data = await lessonsRes.json();
				lessons = {
					blueprint: data.data?.blueprint || data.blueprint || [],
					crafting: data.data?.crafting || data.crafting || [],
					mastery: data.data?.mastery || data.mastery || []
				};
			}
			
			if (metaphorRes.ok) {
				const data = await metaphorRes.json();
				metaphor = data.data || data;
			}
		} catch (e) {
			error = 'Failed to load lessons';
		} finally {
			loading = false;
		}
	});
	
	function getPhaseProgress(phaseLessons: Lesson[]): number {
		if (phaseLessons.length === 0) return 0;
		const completed = phaseLessons.filter(l => completedLessons.has(l.id)).length;
		return Math.round((completed / phaseLessons.length) * 100);
	}
	
	function isLessonUnlocked(lesson: Lesson, index: number, phaseLessons: Lesson[]): boolean {
		if (index === 0) return true; // First lesson always unlocked
		// Previous lesson in phase must be completed
		const prevLesson = phaseLessons[index - 1];
		return completedLessons.has(prevLesson?.id);
	}
	
	function getPhaseIcon(phase: string): string {
		const icons: Record<string, string> = {
			'blueprint': '📐',
			'crafting': '🔨',
			'mastery': '🔩'
		};
		return icons[phase] || '📚';
	}
	
	function getPhaseColor(phase: string): string {
		const colors: Record<string, string> = {
			'blueprint': 'sky',
			'crafting': 'amber',
			'mastery': 'emerald'
		};
		return colors[phase] || 'surface';
	}
	
	$: totalLessons = lessons.blueprint.length + lessons.crafting.length + lessons.mastery.length;
	$: completedCount = completedLessons.size;
	$: overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
</script>

<svelte:head>
	<title>Lessons: {toolId} | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen pb-20">
	{#if loading}
		<div class="flex items-center justify-center min-h-[50vh]">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
		</div>
	{:else if error}
		<div class="max-w-4xl mx-auto px-4 py-20 text-center">
			<p class="text-error-400">{error}</p>
			<a href="/learn/{toolId}" class="btn btn-secondary mt-4">Back to Tool</a>
		</div>
	{:else}
		<!-- Hero with Metaphor and Animated Progress -->
		<div class="bg-gradient-to-b from-surface-800 via-surface-900 to-transparent py-12 border-b border-surface-800">
			<div class="max-w-5xl mx-auto px-4">
				<!-- Breadcrumb -->
				<div class="flex items-center gap-2 text-sm text-surface-400 mb-6">
					<a href="/learn" class="hover:text-primary-400">Learn</a>
					<ChevronRight size={14} />
					<a href="/learn/{toolId}" class="hover:text-primary-400 capitalize">{toolId.replace('-', ' ')}</a>
					<ChevronRight size={14} />
					<span class="text-surface-300">Lessons</span>
				</div>
				
				<!-- Tool & Metaphor Header with Animation -->
				<div class="flex flex-col md:flex-row items-center gap-8 mb-8">
					<!-- Animated Tool Progress -->
					<div class="shrink-0">
						<ToolBuildAnimation
							metaphorIcon={metaphor?.metaphorIcon || '🔧'}
							metaphorName={metaphor?.metaphorName || 'Tool'}
							blueprintProgress={getPhaseProgress(lessons.blueprint)}
							craftingProgress={getPhaseProgress(lessons.crafting)}
							masteryProgress={getPhaseProgress(lessons.mastery)}
							size="lg"
						/>
					</div>
					
					<!-- Info -->
					<div class="flex-1 text-center md:text-left">
						<h1 class="text-3xl font-display font-bold mb-2 capitalize">
							{toolId.replace('-', ' ')} <span class="text-surface-400">Lessons</span>
						</h1>
						{#if metaphor}
							<p class="text-surface-400 text-lg mb-4">
								{metaphor.metaphorName}: {metaphor.stage1Name} → {metaphor.stage2Name} → {metaphor.stage3Name}
							</p>
						{/if}
						<p class="text-surface-500">{totalLessons} lessons across 3 phases • {completedCount} completed</p>
					</div>
				</div>
				
				<!-- Phase Progress Cards -->
				<div class="grid md:grid-cols-3 gap-4">
					<PhaseProgressCard
						phase="blueprint"
						title="Blueprint"
						subtitle="The WHY"
						progress={getPhaseProgress(lessons.blueprint)}
						totalLessons={lessons.blueprint.length}
						completedLessons={lessons.blueprint.filter(l => completedLessons.has(l.id)).length}
						isActive={getPhaseProgress(lessons.blueprint) < 100}
						metaphorStage={metaphor?.stage1Name || 'Understanding'}
						href="#blueprint"
					/>
					<PhaseProgressCard
						phase="crafting"
						title="Crafting"
						subtitle="The HOW"
						progress={getPhaseProgress(lessons.crafting)}
						totalLessons={lessons.crafting.length}
						completedLessons={lessons.crafting.filter(l => completedLessons.has(l.id)).length}
						isActive={getPhaseProgress(lessons.blueprint) >= 100 && getPhaseProgress(lessons.crafting) < 100}
						isLocked={getPhaseProgress(lessons.blueprint) < 100}
						metaphorStage={metaphor?.stage2Name || 'Building'}
						href="#crafting"
					/>
					<PhaseProgressCard
						phase="mastery"
						title="Mastery"
						subtitle="The COMPLETE"
						progress={getPhaseProgress(lessons.mastery)}
						totalLessons={lessons.mastery.length}
						completedLessons={lessons.mastery.filter(l => completedLessons.has(l.id)).length}
						isActive={getPhaseProgress(lessons.crafting) >= 100 && getPhaseProgress(lessons.mastery) < 100}
						isLocked={getPhaseProgress(lessons.crafting) < 100}
						metaphorStage={metaphor?.stage3Name || 'Mastering'}
						href="#mastery"
					/>
				</div>
			</div>
		</div>
		
		<!-- Lesson Phases -->
		<div class="max-w-5xl mx-auto px-4 py-8 space-y-12">
			{#each [
				{ key: 'blueprint', title: 'Blueprint Phase', subtitle: 'Understanding the WHY', icon: '📐', color: 'sky', visual: metaphor?.blueprintVisual || 'Drawing the design', lessons: lessons.blueprint },
				{ key: 'crafting', title: 'Crafting Phase', subtitle: 'Building proficiency', icon: '🔨', color: 'amber', visual: metaphor?.craftingVisual || 'Building the tool', lessons: lessons.crafting },
				{ key: 'mastery', title: 'Mastery Phase', subtitle: 'Solidifying knowledge', icon: '🔩', color: 'emerald', visual: metaphor?.masteryVisual || 'Hardening the tool', lessons: lessons.mastery }
			] as phase (phase.key)}
				{#if phase.lessons.length > 0}
					<section id={phase.key}>
						<!-- Phase Header -->
						<div class="flex items-center gap-4 mb-6">
							<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-{phase.color}-500/20 to-{phase.color}-700/20 flex items-center justify-center text-3xl border border-{phase.color}-500/30">
								{phase.icon}
							</div>
							<div class="flex-1">
								<h2 class="text-xl font-display font-semibold text-{phase.color}-400">
									{phase.title}
								</h2>
								<p class="text-surface-400 text-sm">{phase.subtitle} • {phase.visual}</p>
							</div>
							<div class="text-right">
								<div class="text-2xl font-bold text-{phase.color}-400">{getPhaseProgress(phase.lessons)}%</div>
								<div class="text-xs text-surface-500">{phase.lessons.filter(l => completedLessons.has(l.id)).length} / {phase.lessons.length}</div>
							</div>
						</div>
						
						<!-- Visual Progress Track -->
						<div class="relative mb-6 ml-7">
							<div class="absolute left-0 top-0 bottom-0 w-0.5 bg-surface-700"></div>
							<div 
								class="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-{phase.color}-400 to-{phase.color}-600 transition-all duration-500"
								style="height: {getPhaseProgress(phase.lessons)}%"
							></div>
						</div>
						
						<!-- Lesson Cards -->
						<div class="space-y-3 ml-7">
							{#each phase.lessons as lesson, i}
								{@const isUnlocked = isLessonUnlocked(lesson, i, phase.lessons)}
								{@const isCompleted = completedLessons.has(lesson.id)}
								
								<a 
									href={isUnlocked ? `/learn/${toolId}/lessons/${lesson.id}` : '#'}
									class="block relative group"
									class:pointer-events-none={!isUnlocked}
									class:opacity-50={!isUnlocked}
								>
									<!-- Connection dot -->
									<div class="absolute -left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 {isCompleted ? `bg-${phase.color}-500 border-${phase.color}-500` : isUnlocked ? 'bg-surface-800 border-surface-500' : 'bg-surface-800 border-surface-700'}">
										{#if isCompleted}
											<Check size={10} class="text-white absolute inset-0 m-auto" />
										{/if}
									</div>
									
									<div class="card p-4 transition-all duration-200 {isUnlocked ? 'hover:border-' + phase.color + '-500/50 hover:shadow-lg hover:shadow-' + phase.color + '-500/10' : ''}">
										<div class="flex items-center gap-4">
											<!-- Lesson Number -->
											<div class="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center text-lg font-bold {isCompleted ? `text-${phase.color}-400` : 'text-surface-500'}">
												{i + 1}
											</div>
											
											<!-- Content -->
											<div class="flex-1 min-w-0">
												<h3 class="font-medium {isUnlocked ? 'group-hover:text-' + phase.color + '-400' : ''} transition-colors">
													{lesson.title}
												</h3>
												<p class="text-sm text-surface-500 truncate">
													{lesson.description || lesson.metaphorProgress}
												</p>
											</div>
											
											<!-- Meta -->
											<div class="flex items-center gap-4 text-sm text-surface-500">
												{#if lesson.isPremium}
													<span class="text-accent-400">Premium</span>
												{/if}
												<div class="flex items-center gap-1">
													<Clock size={14} />
													<span>{lesson.estimatedMinutes || 10}m</span>
												</div>
												{#if isUnlocked}
													<ChevronRight size={18} class="text-surface-600 group-hover:text-{phase.color}-400 group-hover:translate-x-1 transition-all" />
												{:else}
													<Lock size={16} class="text-surface-600" />
												{/if}
											</div>
										</div>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			{/each}
			
			<!-- Empty state -->
			{#if totalLessons === 0}
				<div class="text-center py-20">
					<div class="text-6xl mb-4">📚</div>
					<h3 class="text-xl font-semibold mb-2">No Lessons Yet</h3>
					<p class="text-surface-400">Lessons for this tool are being crafted. Check back soon!</p>
					<a href="/learn/{toolId}" class="btn btn-primary mt-6">Back to Tool Overview</a>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Dynamic color classes */
	:global(.text-sky-400) { color: rgb(56 189 248); }
	:global(.text-amber-400) { color: rgb(251 191 36); }
	:global(.text-emerald-400) { color: rgb(52 211 153); }
	:global(.bg-sky-500) { background-color: rgb(14 165 233); }
	:global(.bg-amber-500) { background-color: rgb(245 158 11); }
	:global(.bg-emerald-500) { background-color: rgb(16 185 129); }
	:global(.border-sky-500\/30) { border-color: rgba(14, 165, 233, 0.3); }
	:global(.border-amber-500\/30) { border-color: rgba(245, 158, 11, 0.3); }
	:global(.border-emerald-500\/30) { border-color: rgba(16, 185, 129, 0.3); }
</style>
