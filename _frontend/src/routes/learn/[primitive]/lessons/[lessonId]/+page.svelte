<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { ChevronRight, ChevronLeft, Clock, Check, BookOpen, ArrowRight, ExternalLink } from 'lucide-svelte';
	import type { Lesson, ToolMetaphor } from '@braids/core/types';
	
	const toolId = $page.params.primitive;
	const lessonId = $page.params.lessonId;
	
	let lesson: Lesson | null = null;
	let metaphor: ToolMetaphor | null = null;
	let allLessons: Lesson[] = [];
	let docs: Record<string, any[]> = {};
	let loading = true;
	let error = '';
	let isCompleted = false;
	
	// Navigation
	let prevLesson: Lesson | null = null;
	let nextLesson: Lesson | null = null;
	let currentIndex = 0;
	
	onMount(async () => {
		try {
			const [lessonRes, allLessonsRes, metaphorRes, docsRes] = await Promise.all([
				fetch(`/api/lessons/${lessonId}`),
				fetch(`/api/tools/${toolId}/lessons`),
				fetch(`/api/tools/${toolId}/metaphor`),
				fetch(`/api/tools/${toolId}/docs`)
			]);
			
			if (lessonRes.ok) {
				const data = await lessonRes.json();
				lesson = data.data || data;
			}
			
			if (allLessonsRes.ok) {
				const data = await allLessonsRes.json();
				const lessonsData = data.data || data;
				allLessons = [
					...(lessonsData.blueprint || []),
					...(lessonsData.crafting || []),
					...(lessonsData.mastery || [])
				];
				
				// Find current position
				currentIndex = allLessons.findIndex(l => l.id === lessonId);
				if (currentIndex > 0) {
					prevLesson = allLessons[currentIndex - 1];
				}
				if (currentIndex < allLessons.length - 1) {
					nextLesson = allLessons[currentIndex + 1];
				}
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
			error = 'Failed to load lesson';
		} finally {
			loading = false;
		}
	});
	
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
	
	function getPhaseGradient(phase: string): string {
		const gradients: Record<string, string> = {
			'blueprint': 'from-sky-500/20 to-sky-700/20',
			'crafting': 'from-amber-500/20 to-amber-700/20',
			'mastery': 'from-emerald-500/20 to-emerald-700/20'
		};
		return gradients[phase] || 'from-surface-700 to-surface-800';
	}
	
	function markComplete() {
		isCompleted = true;
		// TODO: Call API to mark lesson complete
	}
	
	// Simple markdown renderer (can be replaced with a proper library)
	function renderMarkdown(md: string): string {
		if (!md) return '';
		
		return md
			// Headers
			.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-surface-200">$1</h3>')
			.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4 text-surface-100">$1</h2>')
			.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h1>')
			// Bold
			.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
			// Italic
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			// Code blocks
			.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-surface-900 border border-surface-700 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-surface-300">$2</code></pre>')
			// Inline code
			.replace(/`([^`]+)`/g, '<code class="bg-surface-800 px-1.5 py-0.5 rounded text-primary-400 text-sm">$1</code>')
			// Tables
			.replace(/\|(.+)\|/g, (match) => {
				const cells = match.split('|').filter(c => c.trim());
				const isHeader = match.includes('---');
				if (isHeader) return '';
				return `<tr>${cells.map(c => `<td class="border border-surface-700 px-3 py-2">${c.trim()}</td>`).join('')}</tr>`;
			})
			// Blockquotes
			.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 text-surface-300 italic">$1</blockquote>')
			// Lists
			.replace(/^- (.*$)/gim, '<li class="ml-4 text-surface-300">$1</li>')
			.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 text-surface-300">$2</li>')
			// Links
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-primary-400 hover:underline">$1</a>')
			// Paragraphs
			.replace(/\n\n/g, '</p><p class="my-4 text-surface-300 leading-relaxed">')
			// Line breaks
			.replace(/\n/g, '<br>');
	}
	
	$: progressPercent = allLessons.length > 0 ? Math.round(((currentIndex + (isCompleted ? 1 : 0)) / allLessons.length) * 100) : 0;
</script>

<svelte:head>
	<title>{lesson?.title || 'Lesson'} | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen pb-20">
	{#if loading}
		<div class="flex items-center justify-center min-h-[50vh]">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
		</div>
	{:else if error || !lesson}
		<div class="max-w-4xl mx-auto px-4 py-20 text-center">
			<p class="text-error-400">{error || 'Lesson not found'}</p>
			<a href="/learn/{toolId}/lessons" class="btn btn-secondary mt-4">Back to Lessons</a>
		</div>
	{:else}
		<!-- Top Navigation Bar -->
		<div class="sticky top-0 z-40 bg-surface-900/95 backdrop-blur-sm border-b border-surface-800">
			<div class="max-w-5xl mx-auto px-4 py-3">
				<div class="flex items-center justify-between">
					<!-- Breadcrumb -->
					<div class="flex items-center gap-2 text-sm text-surface-400">
						<a href="/learn/{toolId}" class="hover:text-primary-400 capitalize">{toolId.replace('-', ' ')}</a>
						<ChevronRight size={14} />
						<a href="/learn/{toolId}/lessons" class="hover:text-primary-400">Lessons</a>
						<ChevronRight size={14} />
						<span class="text-surface-300 truncate max-w-[150px]">{lesson.title}</span>
					</div>
					
					<!-- Progress indicator -->
					<div class="flex items-center gap-4">
						<div class="hidden sm:flex items-center gap-2 text-sm">
							<span class="text-surface-500">{currentIndex + 1} / {allLessons.length}</span>
							<div class="w-24 h-1.5 bg-surface-700 rounded-full overflow-hidden">
								<div 
									class="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
									style="width: {progressPercent}%"
								></div>
							</div>
						</div>
						<span class="px-2 py-1 rounded text-xs font-medium bg-{getPhaseColor(lesson.phase)}-500/20 text-{getPhaseColor(lesson.phase)}-400">
							{getPhaseIcon(lesson.phase)} {lesson.phase}
						</span>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Main Content -->
		<div class="max-w-4xl mx-auto px-4 py-8">
			<!-- Lesson Header -->
			<header class="mb-8">
				<div class="flex items-start gap-4 mb-4">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br {getPhaseGradient(lesson.phase)} flex items-center justify-center text-2xl border border-surface-700">
						{getPhaseIcon(lesson.phase)}
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-2 text-sm text-surface-400 mb-1">
							<span class="text-{getPhaseColor(lesson.phase)}-400">{lesson.phase.charAt(0).toUpperCase() + lesson.phase.slice(1)} Phase</span>
							<span>•</span>
							<span>Lesson {lesson.phaseOrder || currentIndex + 1}</span>
							{#if lesson.estimatedMinutes}
								<span>•</span>
								<Clock size={14} />
								<span>{lesson.estimatedMinutes} min</span>
							{/if}
						</div>
						<h1 class="text-3xl font-display font-bold">{lesson.title}</h1>
					</div>
				</div>
				
				{#if lesson.metaphorProgress}
					<div class="bg-surface-800/50 rounded-lg px-4 py-3 border border-surface-700 flex items-center gap-3">
						<span class="text-2xl">{metaphor?.metaphorIcon || '🔧'}</span>
						<span class="text-surface-400">{lesson.metaphorProgress}</span>
					</div>
				{/if}
			</header>
			
			<!-- Lesson Content -->
			<article class="prose prose-invert max-w-none">
				{#if lesson.contentMarkdown}
					{@html renderMarkdown(lesson.contentMarkdown)}
				{:else}
					<p class="text-surface-400">Lesson content is being prepared...</p>
				{/if}
			</article>
			
			<!-- Documentation References -->
			{#if Object.keys(docs).length > 0}
				<section class="mt-12 pt-8 border-t border-surface-800">
					<h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
						<BookOpen size={20} class="text-primary-400" />
						Official Documentation
					</h2>
					<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each Object.entries(docs) as [lang, langDocs]}
							{#each langDocs as doc}
								<a 
									href={doc.url}
									target="_blank"
									rel="noopener noreferrer"
									class="card p-4 hover:border-primary-500/50 transition-colors group"
								>
									<div class="flex items-start justify-between">
										<div>
											<span class="text-xs text-surface-500 uppercase">{doc.source}</span>
											<h4 class="font-medium group-hover:text-primary-400 transition-colors line-clamp-2">
												{doc.title}
											</h4>
											<span class="text-sm text-surface-500">{lang}</span>
										</div>
										<ExternalLink size={16} class="text-surface-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
									</div>
								</a>
							{/each}
						{/each}
					</div>
				</section>
			{/if}
			
			<!-- Completion & Navigation -->
			<div class="mt-12 pt-8 border-t border-surface-800">
				{#if !isCompleted}
					<button 
						on:click={markComplete}
						class="w-full btn btn-primary py-4 text-lg mb-6"
					>
						<Check size={20} />
						Mark as Complete
					</button>
				{:else}
					<div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
						<div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
							<Check size={20} class="text-emerald-400" />
						</div>
						<div>
							<h4 class="font-medium text-emerald-400">Lesson Completed!</h4>
							<p class="text-sm text-surface-400">Great job! Continue to the next lesson.</p>
						</div>
					</div>
				{/if}
				
				<!-- Navigation -->
				<div class="flex items-center justify-between gap-4">
					{#if prevLesson}
						<a 
							href="/learn/{toolId}/lessons/{prevLesson.id}"
							class="flex-1 card p-4 hover:border-surface-600 transition-colors group"
						>
							<div class="flex items-center gap-3">
								<ChevronLeft size={20} class="text-surface-500 group-hover:text-primary-400 transition-colors" />
								<div class="text-left">
									<span class="text-xs text-surface-500">Previous</span>
									<h4 class="font-medium group-hover:text-primary-400 transition-colors truncate">
										{prevLesson.title}
									</h4>
								</div>
							</div>
						</a>
					{:else}
						<div class="flex-1"></div>
					{/if}
					
					{#if nextLesson}
						<a 
							href="/learn/{toolId}/lessons/{nextLesson.id}"
							class="flex-1 card p-4 hover:border-primary-500/50 transition-colors group bg-gradient-to-r from-transparent to-primary-500/5"
						>
							<div class="flex items-center justify-end gap-3">
								<div class="text-right">
									<span class="text-xs text-surface-500">Next</span>
									<h4 class="font-medium group-hover:text-primary-400 transition-colors truncate">
										{nextLesson.title}
									</h4>
								</div>
								<ArrowRight size={20} class="text-primary-400 group-hover:translate-x-1 transition-transform" />
							</div>
						</a>
					{:else}
						<a 
							href="/learn/{toolId}"
							class="flex-1 card p-4 hover:border-primary-500/50 transition-colors group bg-gradient-to-r from-transparent to-emerald-500/5"
						>
							<div class="flex items-center justify-end gap-3">
								<div class="text-right">
									<span class="text-xs text-emerald-400">Finished!</span>
									<h4 class="font-medium group-hover:text-emerald-400 transition-colors">
										Back to Tool Overview
									</h4>
								</div>
								<Check size={20} class="text-emerald-400" />
							</div>
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Prose overrides */
	:global(.prose h1) { @apply text-white; }
	:global(.prose h2) { @apply text-surface-100; }
	:global(.prose h3) { @apply text-surface-200; }
	:global(.prose p) { @apply text-surface-300; }
	:global(.prose strong) { @apply text-white; }
	:global(.prose code) { @apply bg-surface-800 text-primary-400; }
	:global(.prose pre) { @apply bg-surface-900 border border-surface-700; }
	:global(.prose blockquote) { @apply border-l-primary-500 text-surface-300; }
	:global(.prose a) { @apply text-primary-400 hover:underline; }
	:global(.prose li) { @apply text-surface-300; }
	
	/* Dynamic color classes */
	:global(.text-sky-400) { color: rgb(56 189 248); }
	:global(.text-amber-400) { color: rgb(251 191 36); }
	:global(.text-emerald-400) { color: rgb(52 211 153); }
	:global(.bg-sky-500\/20) { background-color: rgba(14, 165, 233, 0.2); }
	:global(.bg-amber-500\/20) { background-color: rgba(245, 158, 11, 0.2); }
	:global(.bg-emerald-500\/20) { background-color: rgba(16, 185, 129, 0.2); }
</style>
