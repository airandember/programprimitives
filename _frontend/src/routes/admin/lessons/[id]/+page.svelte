<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ArrowLeft, Save, Eye, Trash2, Check, AlertTriangle } from 'lucide-svelte';
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
		isPremium: false,
		isPublished: false
	};
	
	let loading = !isNew;
	let saving = false;
	let error = '';
	let success = '';
	
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
				error = data.error || 'Failed to save';
			}
		} catch (e) {
			error = 'Failed to save lesson';
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
				
				<!-- Content -->
				<div class="card p-6 space-y-4">
					<h2 class="text-lg font-semibold">Lesson Content (Markdown)</h2>
					<textarea
						bind:value={lesson.contentMarkdown}
						placeholder="# Introduction&#10;&#10;Write your lesson content here using Markdown...&#10;&#10;## Key Concept&#10;&#10;- Point 1&#10;- Point 2&#10;&#10;```javascript&#10;// Code example&#10;for (let i = 0; i < 10; i++) {&#10;  console.log(i);&#10;}&#10;```"
						rows="20"
						class="w-full px-4 py-3 bg-surface-900 border border-surface-700 rounded-lg focus:outline-none focus:border-primary-500 font-mono text-sm resize-y"
					></textarea>
					<p class="text-xs text-surface-500">
						Supports Markdown: headers, bold, italic, code blocks, lists, links, blockquotes
					</p>
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
