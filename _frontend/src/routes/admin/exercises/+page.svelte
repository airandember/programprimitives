<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { admin } from '$lib/stores/admin';
	import type { ExerciseInput } from '$lib/api/admin';
	import { 
		Plus, Pencil, Trash2, Eye, EyeOff, Crown, 
		Search, Loader2, Save, X, Code, FileCode, Play
	} from 'lucide-svelte';

	let showEditor = false;
	let editingExercise: any = null;
	let searchQuery = '';
	let primitiveFilter = '';
	let saving = false;

	// Form state
	let form: ExerciseInput = getEmptyForm();

	function getEmptyForm(): ExerciseInput {
		return {
			primitiveId: '',
			title: '',
			slug: '',
			description: '',
			difficulty: 1,
			estimatedMinutes: 5,
			instructions: '',
			hints: [],
			sequenceOrder: 0,
			isPremium: false,
			isPublished: true
		};
	}

	onMount(() => {
		// Check for primitive filter
		const primitive = $page.url.searchParams.get('primitive');
		if (primitive) {
			primitiveFilter = primitive;
		}
		
		admin.loadExercises(primitiveFilter || undefined);
		admin.loadPrimitives();
		
		if ($page.url.searchParams.get('new') === 'true') {
			openNewEditor();
		}
	});

	function openNewEditor() {
		editingExercise = null;
		form = getEmptyForm();
		if (primitiveFilter) {
			form.primitiveId = primitiveFilter;
		}
		showEditor = true;
	}

	function openEditEditor(exercise: any) {
		editingExercise = exercise;
		form = {
			...exercise,
			hints: exercise.hints || []
		};
		showEditor = true;
	}

	function closeEditor() {
		showEditor = false;
		editingExercise = null;
		form = getEmptyForm();
	}

	async function saveExercise() {
		saving = true;
		try {
			if (editingExercise) {
				await admin.updateExercise(editingExercise.id, form);
			} else {
				await admin.createExercise(form);
			}
			closeEditor();
		} catch (e: any) {
			alert('Error: ' + e.message);
		}
		saving = false;
	}

	async function deleteExercise(id: string) {
		if (confirm('Are you sure you want to delete this exercise?')) {
			await admin.deleteExercise(id);
		}
	}

	// Filter exercises
	$: filteredExercises = $admin.exercises.filter(e => {
		const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			e.primitiveId.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesPrimitive = !primitiveFilter || e.primitiveId === primitiveFilter;
		return matchesSearch && matchesPrimitive;
	});

	// Hint helpers
	let hintInput = '';
	
	function addHint() {
		if (hintInput.trim()) {
			form.hints = [...form.hints, hintInput.trim()];
			hintInput = '';
		}
	}
	
	function removeHint(index: number) {
		form.hints = form.hints.filter((_, i) => i !== index);
	}
</script>

<div class="p-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-display font-bold">Exercises</h1>
			<p class="text-surface-400">
				{#if primitiveFilter}
					Exercises for <span class="text-primary-400">{primitiveFilter}</span>
					<button on:click={() => { primitiveFilter = ''; admin.loadExercises(); }} class="text-sm text-surface-500 hover:text-surface-300 ml-2">
						(show all)
					</button>
				{:else}
					Manage coding exercises
				{/if}
			</p>
		</div>
		<button on:click={openNewEditor} class="btn btn-primary">
			<Plus size={18} />
			Add Exercise
		</button>
	</div>

	<!-- Filters -->
	<div class="flex gap-4 mb-6">
		<div class="relative flex-1">
			<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search exercises..."
				class="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
			/>
		</div>
		<select 
			bind:value={primitiveFilter} 
			on:change={() => admin.loadExercises(primitiveFilter || undefined)}
			class="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm min-w-48"
		>
			<option value="">All Primitives</option>
			{#each $admin.primitives as p}
				<option value={p.id}>{p.icon} {p.name}</option>
			{/each}
		</select>
	</div>

	{#if $admin.loading && $admin.exercises.length === 0}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={32} class="animate-spin text-primary-400" />
		</div>
	{:else if filteredExercises.length === 0}
		<div class="text-center py-20 text-surface-500">
			<p>No exercises found. Create your first one!</p>
		</div>
	{:else}
		<!-- Exercises Table -->
		<div class="card overflow-hidden">
			<table class="w-full">
				<thead class="bg-surface-800/50">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Title</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Primitive</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Difficulty</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Time</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Status</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-surface-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-800">
					{#each filteredExercises as exercise}
						<tr class="hover:bg-surface-800/30">
							<td class="px-4 py-3">
								<div class="font-medium">{exercise.title}</div>
								<div class="text-xs text-surface-500">{exercise.id}</div>
							</td>
							<td class="px-4 py-3">
								<span class="badge badge-secondary">{exercise.primitiveName || exercise.primitiveId}</span>
							</td>
							<td class="px-4 py-3">
								<span class="text-yellow-400">{'★'.repeat(exercise.difficulty)}{'☆'.repeat(5 - exercise.difficulty)}</span>
							</td>
							<td class="px-4 py-3 text-surface-400">
								{exercise.estimatedMinutes} min
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-2">
									{#if exercise.isPublished}
										<span class="flex items-center gap-1 text-green-400 text-sm">
											<Eye size={14} /> Published
										</span>
									{:else}
										<span class="flex items-center gap-1 text-surface-500 text-sm">
											<EyeOff size={14} /> Draft
										</span>
									{/if}
									{#if exercise.isPremium}
										<Crown size={14} class="text-yellow-400" />
									{/if}
								</div>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-end gap-2">
									<a 
										href="/admin/exercises/{exercise.id}/code"
										class="btn btn-ghost btn-sm"
										title="Manage starter code"
									>
										<FileCode size={16} />
									</a>
									<a 
										href="/admin/exercises/{exercise.id}/tests"
										class="btn btn-ghost btn-sm"
										title="Manage test cases"
									>
										<Play size={16} />
									</a>
									<button
										on:click={() => openEditEditor(exercise)}
										class="btn btn-ghost btn-sm"
										title="Edit"
									>
										<Pencil size={16} />
									</button>
									<button
										on:click={() => deleteExercise(exercise.id)}
										class="btn btn-ghost btn-sm text-red-400 hover:bg-red-500/10"
										title="Delete"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Editor Modal -->
{#if showEditor}
	<div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-auto">
		<button 
			class="fixed inset-0 bg-black/60" 
			on:click={closeEditor}
			on:keydown={(e) => e.key === 'Escape' && closeEditor()}
		></button>
		
		<div class="relative bg-surface-900 rounded-xl border border-surface-700 w-full max-w-3xl shadow-2xl">
			<div class="flex items-center justify-between p-6 border-b border-surface-800">
				<h2 class="text-xl font-semibold">
					{editingExercise ? 'Edit Exercise' : 'New Exercise'}
				</h2>
				<button on:click={closeEditor} class="btn btn-ghost btn-sm">
					<X size={18} />
				</button>
			</div>

			<form on:submit|preventDefault={saveExercise} class="p-6 space-y-6 max-h-[70vh] overflow-auto">
				<!-- Basic Info -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1.5">Primitive</label>
						<select bind:value={form.primitiveId} class="input w-full" required>
							<option value="">Select primitive...</option>
							{#each $admin.primitives as p}
								<option value={p.id}>{p.icon} {p.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1.5">Title</label>
						<input
							type="text"
							bind:value={form.title}
							placeholder="e.g., Sum of Numbers"
							class="input w-full"
							required
						/>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1.5">Difficulty (1-5)</label>
						<input
							type="number"
							bind:value={form.difficulty}
							min="1"
							max="5"
							class="input w-full"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1.5">Est. Minutes</label>
						<input
							type="number"
							bind:value={form.estimatedMinutes}
							min="1"
							class="input w-full"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1.5">Order</label>
						<input
							type="number"
							bind:value={form.sequenceOrder}
							min="0"
							class="input w-full"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1.5">Description</label>
					<textarea
						bind:value={form.description}
						rows="2"
						class="input w-full"
						placeholder="Brief description of what the user will learn..."
						required
					></textarea>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1.5">Instructions (Markdown supported)</label>
					<textarea
						bind:value={form.instructions}
						rows="8"
						class="input w-full font-mono text-sm"
						placeholder="## Your Task&#10;&#10;Write detailed instructions here..."
						required
					></textarea>
				</div>

				<!-- Hints -->
				<div>
					<label class="block text-sm font-medium mb-1.5">Hints (progressive, shown one at a time)</label>
					<div class="flex gap-2 mb-2">
						<input
							type="text"
							bind:value={hintInput}
							placeholder="Add a hint..."
							class="input flex-1"
							on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addHint())}
						/>
						<button type="button" on:click={addHint} class="btn btn-secondary">
							<Plus size={16} />
						</button>
					</div>
					{#if form.hints.length > 0}
						<div class="space-y-1">
							{#each form.hints as hint, i}
								<div class="flex items-center gap-2 bg-surface-800 rounded px-3 py-1.5 text-sm">
									<span class="text-surface-500 text-xs">#{i + 1}</span>
									<span class="flex-1">{hint}</span>
									<button type="button" on:click={() => removeHint(i)} class="text-red-400 hover:text-red-300">
										<X size={14} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Flags -->
				<div class="flex gap-6">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={form.isPublished} class="toggle" />
						<span class="text-sm">Published</span>
					</label>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={form.isPremium} class="toggle" />
						<span class="text-sm">Premium Only</span>
					</label>
				</div>
			</form>

			<div class="flex items-center justify-end gap-3 p-6 border-t border-surface-800">
				<button type="button" on:click={closeEditor} class="btn btn-ghost">
					Cancel
				</button>
				<button on:click={saveExercise} class="btn btn-primary" disabled={saving}>
					{#if saving}
						<Loader2 size={16} class="animate-spin" />
					{:else}
						<Save size={16} />
					{/if}
					{editingExercise ? 'Update' : 'Create'} Exercise
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.input {
		@apply bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500;
	}
	.toggle {
		@apply w-10 h-5 rounded-full bg-surface-700 cursor-pointer relative appearance-none;
	}
	.toggle::before {
		content: '';
		@apply absolute w-4 h-4 rounded-full bg-surface-400 top-0.5 left-0.5 transition-all;
	}
	.toggle:checked {
		@apply bg-primary-500;
	}
	.toggle:checked::before {
		@apply translate-x-5 bg-white;
	}
</style>
