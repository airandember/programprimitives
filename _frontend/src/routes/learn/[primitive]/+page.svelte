<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		ArrowLeft,
		Play,
		ChevronRight,
		Check,
		X,
		Lightbulb,
		AlertTriangle,
		BookOpen,
		Hammer,
		GraduationCap,
		ExternalLink
	} from 'lucide-svelte';
	import { 
		selectedLanguage, 
		getPrimitive, 
		getPrimitiveSyntax,
		setLanguage,
		TOOL_TIERS,
	} from '$lib/stores/primitives';
	import { SUPPORTED_LANGUAGES } from '@braids/core/constants';
	import type { ToolMetaphor, Lesson } from '@braids/core/types';

	$: primitiveId = $page.params.primitive;
	$: primitive = getPrimitive(primitiveId);
	$: syntax = getPrimitiveSyntax(primitiveId, $selectedLanguage);
	$: tierInfo = primitive ? TOOL_TIERS.find(t => t.tier === primitive.tier) : null;
	
	// Lesson data from API
	let lessons: { blueprint: Lesson[]; crafting: Lesson[]; mastery: Lesson[] } = {
		blueprint: [],
		crafting: [],
		mastery: []
	};
	let metaphor: ToolMetaphor | null = null;
	let docs: Record<string, any[]> = {};
	let loadingLessons = true;
	
	onMount(async () => {
		try {
			const [lessonsRes, metaphorRes, docsRes] = await Promise.all([
				fetch(`/api/tools/${primitiveId}/lessons`),
				fetch(`/api/tools/${primitiveId}/metaphor`),
				fetch(`/api/tools/${primitiveId}/docs`)
			]);
			
			if (lessonsRes.ok) {
				const data = await lessonsRes.json();
				const lessonsData = data.data || data;
				lessons = {
					blueprint: lessonsData.blueprint || [],
					crafting: lessonsData.crafting || [],
					mastery: lessonsData.mastery || []
				};
			}
			
			if (metaphorRes.ok) {
				const data = await metaphorRes.json();
				metaphor = data.data || data;
			}
			
			if (docsRes.ok) {
				const data = await docsRes.json();
				docs = data.data || data;
			}
		} catch (e) {
			console.error('Failed to load lessons:', e);
		} finally {
			loadingLessons = false;
		}
	});
	
	$: totalLessons = lessons.blueprint.length + lessons.crafting.length + lessons.mastery.length;

	// Mock exercises (will come from exercises braid)
	$: exercises = primitive ? [
		{
			id: `ex-${primitiveId}-001`,
			title: `${primitive.name} Basics`,
			estimatedMinutes: 5,
			difficulty: 1,
		},
		{
			id: `ex-${primitiveId}-002`,
			title: `Practice ${primitive.name}`,
			estimatedMinutes: 10,
			difficulty: 2,
		},
	] : [];

	// Mock refinement (will come from progress braid)
	const mockRefinement: Record<string, string> = {
		'variables': 'iron',
		'operators': 'bronze',
		'conditionals': 'wood',
		'for-loop': 'wood',
		'while-loop': 'stone',
		'arrays': 'stone',
		'objects': 'unstarted',
		'functions': 'unstarted',
	};
	$: refinement = mockRefinement[primitiveId] || 'unstarted';

	function getRefinementName(stage: string): string {
		const names: Record<string, string> = {
			'unstarted': 'Not Started',
			'stone': 'Stone',
			'wood': 'Wood',
			'bronze': 'Bronze',
			'iron': 'Iron',
			'steel': 'Steel',
			'mastered': 'Mastered'
		};
		return names[stage] || 'Unknown';
	}

	function getRefinementProgress(stage: string): number {
		const progress: Record<string, number> = {
			'unstarted': 0,
			'stone': 17,
			'wood': 33,
			'bronze': 50,
			'iron': 67,
			'steel': 83,
			'mastered': 100,
		};
		return progress[stage] || 0;
	}

	function getRefinementColorClass(stage: string): string {
		const classes: Record<string, string> = {
			'unstarted': 'text-surface-500',
			'stone': 'text-stone-400',
			'wood': 'text-amber-500',
			'bronze': 'text-orange-500',
			'iron': 'text-slate-400',
			'steel': 'text-blue-400',
			'mastered': 'text-yellow-400'
		};
		return classes[stage] || 'text-surface-500';
	}

	function getRefinementIcon(stage: string): string {
		const icons: Record<string, string> = {
			'unstarted': '○',
			'stone': '🪨',
			'wood': '🪵',
			'bronze': '🔩',
			'iron': '⚙️',
			'steel': '🔧',
			'mastered': '✨',
		};
		return icons[stage] || '○';
	}
</script>

<svelte:head>
	<title>{primitive?.name || 'Tool'} | ProgramPrimitives</title>
</svelte:head>

{#if primitive}
	<div class="min-h-screen">
		<!-- Header -->
		<div class="bg-gradient-to-b from-surface-800 via-surface-900 to-transparent py-12 border-b border-surface-800">
			<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<!-- Back link -->
				<a
					href="/learn"
					class="inline-flex items-center gap-2 text-surface-400 hover:text-surface-200 mb-6 transition-colors"
				>
					<ArrowLeft size={18} />
					Back to Tools
				</a>

				<div class="flex flex-col md:flex-row md:items-start gap-6">
					<!-- Icon -->
					<div
						class="w-20 h-20 rounded-2xl bg-gradient-to-br {tierInfo?.bgGradient || 'from-surface-700 to-surface-800'} border border-surface-700 flex items-center justify-center text-4xl shrink-0"
					>
						{primitive.icon || '🔧'}
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-3 mb-2">
							{#if tierInfo}
								<span class="badge {tierInfo.color} bg-surface-800 border border-surface-700">
									{tierInfo.icon} {tierInfo.displayName}
								</span>
							{/if}
							<span class="badge badge-primary">{primitive.category}</span>
							{#if primitive.isPremium}
								<span class="badge badge-accent">Premium</span>
							{/if}
						</div>
						<h1 class="text-3xl sm:text-4xl font-display font-bold mb-3">{primitive.name}</h1>
						<p class="text-surface-400 text-lg">{primitive.description}</p>
					</div>

					<!-- Refinement Card -->
					<div class="card p-4 min-w-52">
						<div class="text-sm text-surface-500 mb-1 flex items-center gap-2">
							<Hammer size={14} />
							Your Refinement
						</div>
						<div class="flex items-center gap-2 mb-2">
							<span class="text-2xl">{getRefinementIcon(refinement)}</span>
							<span class="text-xl font-bold {getRefinementColorClass(refinement)}">
								{getRefinementName(refinement)}
							</span>
						</div>
						<div class="text-xs text-surface-400 mb-3">{getRefinementProgress(refinement)}% complete</div>
						<div class="h-2 bg-surface-800 rounded-full overflow-hidden">
							<div 
								class="h-full bg-gradient-to-r from-stone-500 via-amber-500 via-orange-500 via-slate-400 via-blue-400 to-yellow-400 transition-all duration-500"
								style="width: {getRefinementProgress(refinement)}%"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
			<!-- Language Selector -->
			<div class="flex items-center gap-4 mb-8 -mt-4">
				<span class="text-surface-500 text-sm">View syntax in:</span>
				<div class="flex gap-2 flex-wrap">
					{#each SUPPORTED_LANGUAGES.slice(0, 4) as lang}
						<button
							on:click={() => setLanguage(lang.id)}
							class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                     {$selectedLanguage === lang.id
								? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
								: 'bg-surface-800/50 text-surface-400 border border-transparent hover:border-surface-700'}"
						>
							{lang.icon} {lang.name}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid lg:grid-cols-3 gap-8">
				<!-- Main Content -->
				<div class="lg:col-span-2 space-y-8">
					<!-- Why It Matters -->
					<section class="card p-6">
						<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
							<BookOpen size={20} class="text-primary-400" />
							Why It Matters
						</h2>
						<p class="text-surface-300 leading-relaxed whitespace-pre-line">{primitive.whyItMatters}</p>
					</section>

					<!-- Syntax -->
					{#if syntax}
						<section class="card overflow-hidden">
							<div class="p-4 border-b border-surface-800 flex items-center justify-between">
								<h2 class="text-lg font-semibold">Syntax</h2>
								<span class="text-surface-500 text-sm">{$selectedLanguage}</span>
							</div>
							<div class="bg-surface-950 p-4">
								<pre class="font-mono text-sm text-surface-300 overflow-x-auto">{syntax.syntaxTemplate}</pre>
							</div>
							{#if syntax.explanation}
								<div class="p-4 border-t border-surface-800 text-sm text-surface-400">
									{syntax.explanation}
								</div>
							{/if}
						</section>

						<!-- Example -->
						<section class="card overflow-hidden">
							<div class="p-4 border-b border-surface-800 flex items-center justify-between">
								<h2 class="text-lg font-semibold">Example</h2>
								<button class="btn btn-ghost text-sm py-1">
									<Play size={14} />
									Run
								</button>
							</div>
							<div class="bg-surface-950 p-4">
								<pre class="font-mono text-sm text-surface-300 overflow-x-auto">{syntax.fullExample}</pre>
							</div>
						</section>

						<!-- Tips -->
						{#if syntax.tips && syntax.tips.length > 0}
							<section class="card p-6">
								<h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-accent-400">
									<Lightbulb size={18} />
									Pro Tips for {$selectedLanguage}
								</h2>
								<ul class="space-y-2">
									{#each syntax.tips as tip}
										<li class="flex items-start gap-2 text-sm">
											<span class="text-accent-500">→</span>
											<span class="text-surface-300">{tip}</span>
										</li>
									{/each}
								</ul>
							</section>
						{/if}
					{:else}
						<section class="card p-6 text-center text-surface-400">
							<p>Syntax examples for {$selectedLanguage} coming soon!</p>
						</section>
					{/if}

					<!-- Best Practices & Pitfalls -->
					<div class="grid sm:grid-cols-2 gap-6">
						<!-- Best Practices -->
						<section class="card p-6">
							<h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-primary-400">
								<Lightbulb size={18} />
								Best Practices
							</h2>
							<ul class="space-y-3">
								{#each primitive.bestPractices || [] as practice}
									<li class="flex items-start gap-2 text-sm">
										<Check size={16} class="text-primary-500 mt-0.5 shrink-0" />
										<span class="text-surface-300">{practice}</span>
									</li>
								{/each}
							</ul>
						</section>

						<!-- Pitfalls -->
						<section class="card p-6">
							<h2 class="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-400">
								<AlertTriangle size={18} />
								Common Pitfalls
							</h2>
							<ul class="space-y-3">
								{#each primitive.pitfalls || [] as pitfall}
									<li class="flex items-start gap-2 text-sm">
										<X size={16} class="text-orange-500 mt-0.5 shrink-0" />
										<span class="text-surface-300">{pitfall}</span>
									</li>
								{/each}
							</ul>
						</section>
					</div>
				</div>

				<!-- Sidebar -->
				<div class="space-y-6">
					<!-- Lessons Section (NEW) -->
					<div class="card p-6 bg-gradient-to-br from-surface-800/80 to-surface-900/80 border-primary-500/20">
						<div class="flex items-center gap-3 mb-4">
							<div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
								<GraduationCap size={20} class="text-primary-400" />
							</div>
							<div>
								<h2 class="text-lg font-semibold">Lessons</h2>
								<p class="text-xs text-surface-400">
									{#if loadingLessons}
										Loading...
									{:else}
										{totalLessons} lessons in 3 phases
									{/if}
								</p>
							</div>
						</div>
						
						{#if metaphor}
							<div class="bg-surface-900/50 rounded-lg p-3 mb-4">
								<div class="flex items-center gap-2 mb-2">
									<span class="text-xl">{metaphor.metaphorIcon}</span>
									<span class="font-medium text-sm">{metaphor.metaphorName}</span>
								</div>
								<div class="text-xs text-surface-400">
									{metaphor.stage1Name} → {metaphor.stage2Name} → {metaphor.stage3Name}
								</div>
							</div>
						{/if}
						
						<!-- Phase breakdown -->
						{#if !loadingLessons && totalLessons > 0}
							<div class="space-y-2 mb-4">
								<div class="flex items-center justify-between text-xs">
									<span class="text-sky-400">📐 Blueprint</span>
									<span class="text-surface-400">{lessons.blueprint.length} lessons</span>
								</div>
								<div class="flex items-center justify-between text-xs">
									<span class="text-amber-400">🔨 Crafting</span>
									<span class="text-surface-400">{lessons.crafting.length} lessons</span>
								</div>
								<div class="flex items-center justify-between text-xs">
									<span class="text-emerald-400">🔩 Mastery</span>
									<span class="text-surface-400">{lessons.mastery.length} lessons</span>
								</div>
							</div>
						{/if}
						
						<a
							href="/learn/{primitive.id}/lessons"
							class="btn btn-primary w-full justify-center"
						>
							Start Learning
							<ChevronRight size={18} />
						</a>
					</div>
					
					<!-- Documentation Links -->
					{#if Object.keys(docs).length > 0}
						<div class="card p-6">
							<h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
								<BookOpen size={18} class="text-primary-400" />
								Official Docs
							</h2>
							<div class="space-y-2">
								{#each Object.entries(docs) as [lang, langDocs]}
									{#each langDocs.slice(0, 1) as doc}
										<a
											href={doc.url}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-800/50 transition-colors group"
										>
											<span class="text-sm font-medium capitalize">{lang}</span>
											<span class="flex-1 text-xs text-surface-500 truncate">{doc.title}</span>
											<ExternalLink size={14} class="text-surface-600 group-hover:text-primary-400" />
										</a>
									{/each}
								{/each}
							</div>
						</div>
					{/if}
					
					<!-- Practice Exercises -->
					<div class="card p-6">
						<h2 class="text-lg font-semibold mb-4">Practice Exercises</h2>

						{#if exercises.length > 0}
							<div class="space-y-3">
								{#each exercises as exercise}
									<a
										href="/practice/{primitive.id}/{exercise.id}"
										class="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors group"
									>
										<div
											class="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center"
										>
											<Play
												size={14}
												class="text-surface-400 group-hover:text-primary-400 transition-colors"
											/>
										</div>
										<div class="flex-1 min-w-0">
											<div
												class="font-medium text-sm truncate group-hover:text-primary-400 transition-colors"
											>
												{exercise.title}
											</div>
											<div class="text-xs text-surface-500">
												{exercise.estimatedMinutes} min · Difficulty {exercise.difficulty}
											</div>
										</div>
										<ChevronRight
											size={16}
											class="text-surface-600 group-hover:text-primary-400 transition-colors"
										/>
									</a>
								{/each}
							</div>
						{:else}
							<p class="text-surface-500 text-sm">No exercises available yet.</p>
						{/if}

						<a
							href="/practice?primitive={primitive.id}"
							class="btn btn-secondary w-full mt-4 justify-center"
						>
							Start Practicing
							<ChevronRight size={18} />
						</a>
					</div>

					<!-- Related Tools -->
					{#if primitive.related && primitive.related.length > 0}
						<div class="card p-6">
							<h2 class="text-lg font-semibold mb-4">Related Tools</h2>
							<div class="space-y-2">
								{#each primitive.related.slice(0, 4) as relatedId}
									{@const related = getPrimitive(relatedId)}
									{#if related}
										{@const relatedTier = TOOL_TIERS.find(t => t.tier === related.tier)}
										<a
											href="/learn/{relatedId}"
											class="block p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
										>
											<div class="flex items-center gap-2">
												<span class="text-lg">{related.icon}</span>
												<div class="font-medium text-sm">{related.name}</div>
												{#if relatedTier}
													<span class="text-xs {relatedTier.color}">{relatedTier.icon}</span>
												{/if}
											</div>
											<div class="text-xs text-surface-500 mt-1 line-clamp-1">{related.description}</div>
										</a>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<!-- Prerequisites -->
					{#if primitive.prerequisites && primitive.prerequisites.length > 0}
						<div class="card p-6">
							<h2 class="text-lg font-semibold mb-4">Prerequisites</h2>
							<div class="space-y-2">
								{#each primitive.prerequisites as prereqId}
									{@const prereq = getPrimitive(prereqId)}
									{#if prereq}
										<a
											href="/learn/{prereqId}"
											class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-800/50 transition-colors"
										>
											<span>{prereq.icon}</span>
											<span class="text-sm">{prereq.name}</span>
										</a>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="text-6xl mb-4">🔍</div>
			<h2 class="text-2xl font-bold mb-2">Tool not found</h2>
			<p class="text-surface-400 mb-6">The tool "{primitiveId}" doesn't exist.</p>
			<a href="/learn" class="btn btn-primary">Back to Tools</a>
		</div>
	</div>
{/if}
