<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Edit2, Trash2, Search, Filter, Eye, ChevronDown } from 'lucide-svelte';
	import type { Lesson, ToolMetaphor } from '@braids/core/types';
	
	let lessons: Lesson[] = [];
	let metaphors: ToolMetaphor[] = [];
	let loading = true;
	let error = '';
	
	// Filters
	let searchQuery = '';
	let selectedTool = '';
	let selectedPhase = '';
	
	// Unique tools from lessons
	$: tools = [...new Set(lessons.map(l => l.toolId))].sort();
	
	// Filtered lessons
	$: filteredLessons = lessons.filter(lesson => {
		const matchesSearch = !searchQuery || 
			lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesTool = !selectedTool || lesson.toolId === selectedTool;
		const matchesPhase = !selectedPhase || lesson.phase === selectedPhase;
		return matchesSearch && matchesTool && matchesPhase;
	});
	
	// Group by tool
	$: lessonsByTool = filteredLessons.reduce((acc, lesson) => {
		if (!acc[lesson.toolId]) {
			acc[lesson.toolId] = [];
		}
		acc[lesson.toolId].push(lesson);
		return acc;
	}, {} as Record<string, Lesson[]>);
	
	onMount(async () => {
		try {
			const [lessonsRes, metaphorsRes] = await Promise.all([
				fetch('/api/admin/lessons'),
				fetch('/api/admin/metaphors')
			]);
			
			if (lessonsRes.ok) {
				const data = await lessonsRes.json();
				lessons = data.data || data || [];
			}
			
			if (metaphorsRes.ok) {
				const data = await metaphorsRes.json();
				metaphors = data.data || data || [];
			}
		} catch (e) {
			error = 'Failed to load lessons';
		} finally {
			loading = false;
		}
	});
	
	function getMetaphor(toolId: string): ToolMetaphor | undefined {
		return metaphors.find(m => m.toolId === toolId);
	}
	
	function getPhaseColor(phase: string): string {
		const colors: Record<string, string> = {
			'blueprint': 'text-sky-400 bg-sky-500/10',
			'crafting': 'text-amber-400 bg-amber-500/10',
			'mastery': 'text-emerald-400 bg-emerald-500/10'
		};
		return colors[phase] || 'text-surface-400';
	}
	
	function getPhaseIcon(phase: string): string {
		const icons: Record<string, string> = {
			'blueprint': '📐',
			'crafting': '🔨',
			'mastery': '🔩'
		};
		return icons[phase] || '📚';
	}
	
	async function deleteLesson(id: string) {
		if (!confirm('Are you sure you want to delete this lesson?')) return;
		
		try {
			const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
			if (res.ok) {
				lessons = lessons.filter(l => l.id !== id);
			} else {
				alert('Failed to delete lesson');
			}
		} catch (e) {
			alert('Failed to delete lesson');
		}
	}
</script>

<svelte:head>
	<title>Lessons Management | Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-display font-bold">Lessons</h1>
			<p class="text-surface-400">Manage lesson content for all tools</p>
		</div>
		<a href="/admin/lessons/new" class="btn btn-primary">
			<Plus size={18} />
			New Lesson
		</a>
	</div>
	
	<!-- Stats -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
		<div class="card p-4">
			<div class="text-3xl font-bold">{lessons.length}</div>
			<div class="text-sm text-surface-400">Total Lessons</div>
		</div>
		<div class="card p-4">
			<div class="text-3xl font-bold text-sky-400">{lessons.filter(l => l.phase === 'blueprint').length}</div>
			<div class="text-sm text-surface-400">📐 Blueprint</div>
		</div>
		<div class="card p-4">
			<div class="text-3xl font-bold text-amber-400">{lessons.filter(l => l.phase === 'crafting').length}</div>
			<div class="text-sm text-surface-400">🔨 Crafting</div>
		</div>
		<div class="card p-4">
			<div class="text-3xl font-bold text-emerald-400">{lessons.filter(l => l.phase === 'mastery').length}</div>
			<div class="text-sm text-surface-400">🔩 Mastery</div>
		</div>
	</div>
	
	<!-- Filters -->
	<div class="card p-4">
		<div class="flex flex-wrap gap-4">
			<!-- Search -->
			<div class="flex-1 min-w-64 relative">
				<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
				<input
					type="text"
					placeholder="Search lessons..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>
			
			<!-- Tool Filter -->
			<select
				bind:value={selectedTool}
				class="px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
			>
				<option value="">All Tools</option>
				{#each tools as tool}
					<option value={tool}>{tool}</option>
				{/each}
			</select>
			
			<!-- Phase Filter -->
			<select
				bind:value={selectedPhase}
				class="px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
			>
				<option value="">All Phases</option>
				<option value="blueprint">📐 Blueprint</option>
				<option value="crafting">🔨 Crafting</option>
				<option value="mastery">🔩 Mastery</option>
			</select>
		</div>
	</div>
	
	<!-- Content -->
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
		</div>
	{:else if error}
		<div class="card p-8 text-center">
			<p class="text-error-400">{error}</p>
		</div>
	{:else if filteredLessons.length === 0}
		<div class="card p-8 text-center">
			<div class="text-4xl mb-4">📚</div>
			<h3 class="text-lg font-semibold mb-2">No Lessons Found</h3>
			<p class="text-surface-400 mb-4">
				{searchQuery || selectedTool || selectedPhase 
					? 'Try adjusting your filters' 
					: 'Create your first lesson to get started'}
			</p>
			<a href="/admin/lessons/new" class="btn btn-primary">
				<Plus size={18} />
				Create Lesson
			</a>
		</div>
	{:else}
		<!-- Lessons grouped by tool -->
		<div class="space-y-6">
			{#each Object.entries(lessonsByTool) as [toolId, toolLessons]}
				{@const metaphor = getMetaphor(toolId)}
				<div class="card overflow-hidden">
					<!-- Tool Header -->
					<div class="p-4 border-b border-surface-800 bg-surface-800/50 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<span class="text-2xl">{metaphor?.metaphorIcon || '🔧'}</span>
							<div>
								<h3 class="font-semibold capitalize">{toolId.replace('-', ' ')}</h3>
								<p class="text-xs text-surface-400">
									{metaphor?.metaphorName || 'Tool'} • {toolLessons.length} lessons
								</p>
							</div>
						</div>
						<a href="/learn/{toolId}/lessons" class="btn btn-ghost text-sm py-1" target="_blank">
							<Eye size={14} />
							Preview
						</a>
					</div>
					
					<!-- Lessons Table -->
					<table class="w-full">
						<thead class="text-sm text-surface-500 border-b border-surface-800">
							<tr>
								<th class="text-left p-3">#</th>
								<th class="text-left p-3">Title</th>
								<th class="text-left p-3">Phase</th>
								<th class="text-left p-3">Time</th>
								<th class="text-left p-3">Status</th>
								<th class="text-right p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each toolLessons.sort((a, b) => a.sequenceOrder - b.sequenceOrder) as lesson}
								<tr class="border-b border-surface-800/50 hover:bg-surface-800/30">
									<td class="p-3 text-surface-500">{lesson.sequenceOrder}</td>
									<td class="p-3">
										<div class="font-medium">{lesson.title}</div>
										{#if lesson.description}
											<div class="text-xs text-surface-500 truncate max-w-sm">{lesson.description}</div>
										{/if}
									</td>
									<td class="p-3">
										<span class="px-2 py-1 rounded text-xs {getPhaseColor(lesson.phase)}">
											{getPhaseIcon(lesson.phase)} {lesson.phase}
										</span>
									</td>
									<td class="p-3 text-sm text-surface-400">{lesson.estimatedMinutes || 10}m</td>
									<td class="p-3">
										{#if lesson.isPublished}
											<span class="px-2 py-1 rounded text-xs text-emerald-400 bg-emerald-500/10">Published</span>
										{:else}
											<span class="px-2 py-1 rounded text-xs text-surface-400 bg-surface-700">Draft</span>
										{/if}
									</td>
									<td class="p-3 text-right">
										<div class="flex items-center justify-end gap-2">
											<a 
												href="/admin/lessons/{lesson.id}"
												class="p-2 hover:bg-surface-700 rounded-lg transition-colors"
												title="Edit"
											>
												<Edit2 size={16} class="text-surface-400" />
											</a>
											<button
												on:click={() => deleteLesson(lesson.id)}
												class="p-2 hover:bg-error-500/10 rounded-lg transition-colors"
												title="Delete"
											>
												<Trash2 size={16} class="text-error-400" />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
		</div>
	{/if}
</div>
