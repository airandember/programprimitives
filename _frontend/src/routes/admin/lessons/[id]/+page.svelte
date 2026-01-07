<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ArrowLeft, Save, Eye, EyeOff, Trash2, Check, AlertTriangle, Maximize2, Minimize2 } from 'lucide-svelte';
	import type { Lesson } from '@braids/core/types';
	
	const lessonId = $page.params.id;
	const isNew = lessonId === 'new';
	
	let lesson: Partial<Lesson> = {
		toolId: '',
		slug: '',
		title: '',
		description: '',
		phase: 'blueprint',
		phaseOrder: 1,
		sequenceOrder: 1,
		metaphorProgress: '',
		contentMarkdown: '',
		estimatedMinutes: 10,
		difficultyModifier: 0,
		xpReward: 25,
		isPremium: false,
		isPublished: false
	};
	
	let loading = !isNew;
	let saving = false;
	let error = '';
	let success = '';
	let showPreview = true;
	let fullscreenEditor = false;
	
	// Simple markdown to HTML converter
	function renderMarkdown(md: string): string {
		if (!md) return '<p class="text-surface-500 italic">Start writing to see preview...</p>';
		
		let html = md
			// Escape HTML first
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			// Code blocks (must be before inline code)
			.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-surface-900 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$2</code></pre>')
			// Inline code
			.replace(/`([^`]+)`/g, '<code class="bg-surface-800 px-1.5 py-0.5 rounded text-primary-400">$1</code>')
			// Headers
			.replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
			.replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
			.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
			// Bold and italic
			.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
			.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
			// Links
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-400 hover:underline" target="_blank">$1</a>')
			// Blockquotes
			.replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 my-4 text-surface-300 italic">$1</blockquote>')
			// Unordered lists
			.replace(/^- (.*)$/gm, '<li class="ml-4">• $1</li>')
			// Ordered lists
			.replace(/^\d+\. (.*)$/gm, '<li class="ml-4 list-decimal">$1</li>')
			// Horizontal rules
			.replace(/^---$/gm, '<hr class="border-surface-700 my-6" />')
			// Paragraphs (double newlines)
			.replace(/\n\n/g, '</p><p class="my-4">')
			// Single newlines become <br>
			.replace(/\n/g, '<br />');
		
		return `<p class="my-4">${html}</p>`;
	}
	
	// Available tools (from primitives)
	let tools = ['variables', 'operators', 'conditionals', 'for-loop', 'while-loop', 'arrays', 'objects', 'functions'];
	
	onMount(async () => {
		if (!isNew) {
			try {
				const res = await fetch(`/api/admin/lessons/${lessonId}`);
				if (res.ok) {
					const data = await res.json();
					lesson = data.data || data;
				} else {
					error = 'Lesson not found';
				}
			} catch (e) {
				error = 'Failed to load lesson';
			} finally {
				loading = false;
			}
		}
	});
	
	function generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}
	
	$: if (isNew && lesson.title) {
		lesson.slug = generateSlug(lesson.title);
	}
	
	async function save() {
		saving = true;
		error = '';
		success = '';
		
		try {
			const url = isNew ? '/api/admin/lessons' : `/api/admin/lessons/${lessonId}`;
			const method = isNew ? 'POST' : 'PUT';
			
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(lesson)
			});
			
			if (res.ok) {
				success = isNew ? 'Lesson created!' : 'Lesson saved!';
				if (isNew) {
					const data = await res.json();
					goto(`/admin/lessons/${data.data?.id || data.id}`);
				}
			} else {
				const data = await res.json();
				// Handle various error response formats
				if (typeof data === 'string') {
					error = data;
				} else if (data.message) {
					error = data.message;
				} else if (data.error) {
					error = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
				} else {
					error = `Failed to save (${res.status})`;
				}
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to save lesson';
		} finally {
			saving = false;
		}
	}
	
	async function deleteLesson() {
		if (!confirm('Are you sure you want to delete this lesson? This cannot be undone.')) return;
		
		try {
			const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' });
			if (res.ok) {
				goto('/admin/lessons');
			} else {
				error = 'Failed to delete';
			}
		} catch (e) {
			error = 'Failed to delete';
		}
	}
</script>

<svelte:head>
	<title>{isNew ? 'New Lesson' : `Edit: ${lesson.title}`} | Admin</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/admin/lessons" class="btn btn-ghost">
				<ArrowLeft size={18} />
			</a>
			<div>
				<h1 class="text-2xl font-display font-bold">
					{isNew ? 'Create New Lesson' : 'Edit Lesson'}
				</h1>
				{#if !isNew}
					<p class="text-sm text-surface-400">ID: {lessonId}</p>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if !isNew}
				<a 
					href="/learn/{lesson.toolId}/lessons/{lessonId}"
					target="_blank"
					class="btn btn-ghost"
				>
					<Eye size={18} />
					Preview
				</a>
				<button on:click={deleteLesson} class="btn btn-ghost text-error-400">
					<Trash2 size={18} />
				</button>
			{/if}
			<button on:click={save} disabled={saving} class="btn btn-primary">
				{#if saving}
					<div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
				{:else}
					<Save size={18} />
				{/if}
				Save
			</button>
		</div>
	</div>
	
	<!-- Messages -->
	{#if error}
		<div class="bg-error-500/10 border border-error-500/30 text-error-400 px-4 py-3 rounded-lg flex items-center gap-2">
			<AlertTriangle size={18} />
			{error}
		</div>
	{/if}
	{#if success}
		<div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2">
			<Check size={18} />
			{success}
		</div>
	{/if}
	
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
		</div>
	{:else}
		<div class="grid lg:grid-cols-3 gap-6">
			<!-- Main Form -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Basic Info -->
				<div class="card p-6 space-y-4">
					<h2 class="text-lg font-semibold">Basic Information</h2>
					
					<div class="grid sm:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm text-surface-400 mb-1">Tool</label>
							<select
								bind:value={lesson.toolId}
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
								disabled={!isNew}
							>
								<option value="">Select tool...</option>
								{#each tools as tool}
									<option value={tool}>{tool}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="block text-sm text-surface-400 mb-1">Phase</label>
							<select
								bind:value={lesson.phase}
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							>
								<option value="blueprint">📐 Blueprint</option>
								<option value="crafting">🔨 Crafting</option>
								<option value="mastery">🔩 Mastery</option>
							</select>
						</div>
					</div>
					
					<div>
						<label class="block text-sm text-surface-400 mb-1">Title</label>
						<input
							type="text"
							bind:value={lesson.title}
							placeholder="What is a For Loop?"
							class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
						/>
					</div>
					
					<div>
						<label class="block text-sm text-surface-400 mb-1">Slug (URL)</label>
						<input
							type="text"
							bind:value={lesson.slug}
							placeholder="what-is-for-loop"
							class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							disabled={!isNew}
						/>
					</div>
					
					<div>
						<label class="block text-sm text-surface-400 mb-1">Description</label>
						<textarea
							bind:value={lesson.description}
							placeholder="A brief description of what this lesson covers..."
							rows="2"
							class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
						></textarea>
					</div>
					
					<div>
						<label class="block text-sm text-surface-400 mb-1">Metaphor Progress (visual hint)</label>
						<input
							type="text"
							bind:value={lesson.metaphorProgress}
							placeholder="e.g. Drawing the axle of the counting wheel"
							class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
						/>
					</div>
				</div>
				
				<!-- Content Editor with Preview -->
				<div class="card p-6 space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold">Lesson Content (Markdown)</h2>
						<div class="flex items-center gap-2">
							<button
								on:click={() => showPreview = !showPreview}
								class="btn btn-ghost text-sm px-3 py-1"
								title={showPreview ? 'Hide preview' : 'Show preview'}
							>
								{#if showPreview}
									<EyeOff size={16} />
								{:else}
									<Eye size={16} />
								{/if}
								{showPreview ? 'Hide Preview' : 'Show Preview'}
							</button>
							<button
								on:click={() => fullscreenEditor = !fullscreenEditor}
								class="btn btn-ghost text-sm px-3 py-1"
								title={fullscreenEditor ? 'Exit fullscreen' : 'Fullscreen editor'}
							>
								{#if fullscreenEditor}
									<Minimize2 size={16} />
								{:else}
									<Maximize2 size={16} />
								{/if}
							</button>
						</div>
					</div>
					
					<div class="grid {showPreview ? 'lg:grid-cols-2' : ''} gap-4 {fullscreenEditor ? 'fixed inset-4 z-50 bg-surface-900 p-6 rounded-xl' : ''}">
						<!-- Editor -->
						<div class="flex flex-col">
							<div class="flex items-center justify-between mb-2">
								<span class="text-xs text-surface-500 uppercase tracking-wide">Editor</span>
								<span class="text-xs text-surface-500">{(lesson.contentMarkdown || '').length} chars</span>
							</div>
							<textarea
								bind:value={lesson.contentMarkdown}
								placeholder="# Welcome to Your Lesson

Start writing your lesson content here using Markdown...

## What You'll Learn
- Key concept 1
- Key concept 2

## The Principle
Explain the core principle here. Use **bold** for emphasis.

```javascript
// Code examples work too!
const example = 'hello';
```

> Use blockquotes for important notes!"
								class="w-full px-4 py-3 bg-surface-900 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500 font-mono text-sm resize-none {fullscreenEditor ? 'h-full' : 'h-96'}"
							></textarea>
						</div>
						
						<!-- Preview -->
						{#if showPreview}
							<div class="flex flex-col">
								<div class="flex items-center justify-between mb-2">
									<span class="text-xs text-surface-500 uppercase tracking-wide">Preview</span>
									<span class="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Live</span>
								</div>
								<div 
									class="flex-1 px-4 py-3 bg-surface-800/50 border border-surface-700 rounded-lg overflow-y-auto prose prose-invert max-w-none {fullscreenEditor ? 'h-full' : 'h-96'}"
								>
									{@html renderMarkdown(lesson.contentMarkdown || '')}
								</div>
							</div>
						{/if}
					</div>
					
					{#if fullscreenEditor}
						<button
							on:click={() => fullscreenEditor = false}
							class="fixed top-6 right-6 z-50 btn btn-ghost bg-surface-800"
						>
							<Minimize2 size={18} />
							Exit Fullscreen
						</button>
					{/if}
					
					<!-- Markdown cheatsheet -->
					<details class="text-xs text-surface-500">
						<summary class="cursor-pointer hover:text-surface-300">Markdown Quick Reference</summary>
						<div class="mt-2 p-3 bg-surface-800/50 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2">
							<span><code class="text-primary-400"># Header</code> - H1</span>
							<span><code class="text-primary-400">## Header</code> - H2</span>
							<span><code class="text-primary-400">**bold**</code> - <strong>bold</strong></span>
							<span><code class="text-primary-400">*italic*</code> - <em>italic</em></span>
							<span><code class="text-primary-400">`code`</code> - inline code</span>
							<span><code class="text-primary-400">- item</code> - bullet list</span>
							<span><code class="text-primary-400">[text](url)</code> - link</span>
							<span><code class="text-primary-400">&gt; quote</code> - blockquote</span>
						</div>
					</details>
				</div>
			</div>
			
			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Settings -->
				<div class="card p-6 space-y-4">
					<h2 class="text-lg font-semibold">Settings</h2>
					
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm text-surface-400 mb-1">Sequence #</label>
							<input
								type="number"
								bind:value={lesson.sequenceOrder}
								min="1"
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							/>
						</div>
						<div>
							<label class="block text-sm text-surface-400 mb-1">Phase Order</label>
							<input
								type="number"
								bind:value={lesson.phaseOrder}
								min="1"
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							/>
						</div>
					</div>
					
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm text-surface-400 mb-1">Est. Minutes</label>
							<input
								type="number"
								bind:value={lesson.estimatedMinutes}
								min="1"
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							/>
						</div>
						<div>
							<label class="block text-sm text-surface-400 mb-1">Difficulty +/-</label>
							<input
								type="number"
								bind:value={lesson.difficultyModifier}
								step="0.1"
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							/>
						</div>
					</div>
					
					<!-- XP Reward -->
					<div>
						<label class="block text-sm text-surface-400 mb-1">XP Reward</label>
						<div class="flex items-center gap-2">
							<input
								type="number"
								bind:value={lesson.xpReward}
								min="5"
								max="500"
								step="5"
								class="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500"
							/>
							<span class="text-accent-400 font-medium">XP</span>
						</div>
						<p class="text-xs text-surface-500 mt-1">Default: 25 XP. Increase for longer lessons.</p>
					</div>
				</div>
				
				<!-- Visibility -->
				<div class="card p-6 space-y-4">
					<h2 class="text-lg font-semibold">Visibility</h2>
					
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={lesson.isPublished}
							class="w-5 h-5 rounded bg-surface-800 border-surface-600 text-primary-500 focus:ring-primary-500"
						/>
						<span>Published</span>
					</label>
					
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={lesson.isPremium}
							class="w-5 h-5 rounded bg-surface-800 border-surface-600 text-accent-500 focus:ring-accent-500"
						/>
						<span>Premium Only</span>
					</label>
				</div>
				
				<!-- Info -->
				{#if lesson.lastEditedAt}
					<div class="card p-6 space-y-2 text-sm text-surface-400">
						<div class="flex justify-between">
							<span>Last edited:</span>
							<span>{new Date(lesson.lastEditedAt).toLocaleDateString()}</span>
						</div>
						{#if lesson.version}
							<div class="flex justify-between">
								<span>Version:</span>
								<span>{lesson.version}</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
