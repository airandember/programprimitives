<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { admin } from '$lib/stores/admin';
	import type { PrimitiveInput } from '$lib/api/admin';
	import { 
		Plus, Pencil, Trash2, Eye, EyeOff, Crown, 
		Search, Loader2, Save, X, ChevronRight
	} from 'lucide-svelte';

	let showEditor = false;
	let editingPrimitive: any = null;
	let searchQuery = '';
	let saving = false;

	// Form state
	let form: PrimitiveInput = getEmptyForm();

	function getEmptyForm(): PrimitiveInput {
		return {
			id: '',
			name: '',
			category: 'fundamentals',
			subcategory: '',
			description: '',
			whyItMatters: '',
			bestPractices: [],
			pitfalls: [],
			difficulty: 1,
			prerequisites: [],
			related: [],
			icon: '📦',
			categoryOrder: 0,
			isPremium: false,
			isPublished: true
		};
	}

	onMount(() => {
		admin.loadPrimitives();
		
		// Check for ?new=true
		if ($page.url.searchParams.get('new') === 'true') {
			openNewEditor();
		}
	});

	function openNewEditor() {
		editingPrimitive = null;
		form = getEmptyForm();
		showEditor = true;
	}

	function openEditEditor(primitive: any) {
		editingPrimitive = primitive;
		form = {
			...primitive,
			bestPractices: primitive.bestPractices || [],
			pitfalls: primitive.pitfalls || [],
			prerequisites: primitive.prerequisites || [],
			related: primitive.related || []
		};
		showEditor = true;
	}

	function closeEditor() {
		showEditor = false;
		editingPrimitive = null;
		form = getEmptyForm();
	}

	async function savePrimitive() {
		saving = true;
		try {
			if (editingPrimitive) {
				await admin.updatePrimitive(editingPrimitive.id, form);
			} else {
				await admin.createPrimitive(form);
			}
			closeEditor();
		} catch (e: any) {
			alert('Error: ' + e.message);
		}
		saving = false;
	}

	async function deletePrimitive(id: string) {
		if (confirm('Are you sure you want to delete this primitive? This will also delete all associated exercises.')) {
			await admin.deletePrimitive(id);
		}
	}

	// Filter primitives
	$: filteredPrimitives = $admin.primitives.filter(p => 
		p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		p.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Array field helpers
	let bestPracticeInput = '';
	let pitfallInput = '';
	
	function addBestPractice() {
		if (bestPracticeInput.trim()) {
			form.bestPractices = [...form.bestPractices, bestPracticeInput.trim()];
			bestPracticeInput = '';
		}
	}
	
	function removeBestPractice(index: number) {
		form.bestPractices = form.bestPractices.filter((_, i) => i !== index);
	}
	
	function addPitfall() {
		if (pitfallInput.trim()) {
			form.pitfalls = [...form.pitfalls, pitfallInput.trim()];
			pitfallInput = '';
		}
	}
	
	function removePitfall(index: number) {
		form.pitfalls = form.pitfalls.filter((_, i) => i !== index);
	}
</script>

<div class="p-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-display font-bold">Primitives</h1>
			<p class="text-surface-400">Manage programming concepts and tools</p>
		</div>
		<button on:click={openNewEditor} class="btn btn-primary">
			<Plus size={18} />
			Add Primitive
		</button>
	</div>

	<!-- Search -->
	<div class="relative mb-6">
		<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search primitives..."
			class="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
		/>
	</div>

	{#if $admin.loading && $admin.primitives.length === 0}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={32} class="animate-spin text-primary-400" />
		</div>
	{:else if filteredPrimitives.length === 0}
		<div class="text-center py-20 text-surface-500">
			<p>No primitives found. Create your first one!</p>
		</div>
	{:else}
		<!-- Primitives Table -->
		<div class="card overflow-hidden">
			<table class="w-full">
				<thead class="bg-surface-800/50">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Icon</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Name</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Category</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Difficulty</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Status</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-surface-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-800">
					{#each filteredPrimitives as primitive}
						<tr class="hover:bg-surface-800/30">
							<td class="px-4 py-3 text-2xl">{primitive.icon}</td>
							<td class="px-4 py-3">
								<div class="font-medium">{primitive.name}</div>
								<div class="text-xs text-surface-500">{primitive.id}</div>
							</td>
							<td class="px-4 py-3">
								<span class="badge badge-secondary capitalize">{primitive.category}</span>
							</td>
							<td class="px-4 py-3">
								<span class="text-yellow-400">{'★'.repeat(primitive.difficulty)}{'☆'.repeat(5 - primitive.difficulty)}</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-2">
									{#if primitive.isPublished}
										<span class="flex items-center gap-1 text-green-400 text-sm">
											<Eye size={14} /> Published
										</span>
									{:else}
										<span class="flex items-center gap-1 text-surface-500 text-sm">
											<EyeOff size={14} /> Draft
										</span>
									{/if}
									{#if primitive.isPremium}
										<Crown size={14} class="text-yellow-400" />
									{/if}
								</div>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-end gap-2">
									<a 
										href="/admin/exercises?primitive={primitive.id}"
										class="btn btn-ghost btn-sm"
										title="View exercises"
									>
										<ChevronRight size={16} />
									</a>
									<button
										on:click={() => openEditEditor(primitive)}
										class="btn btn-ghost btn-sm"
										title="Edit"
									>
										<Pencil size={16} />
									</button>
									<button
										on:click={() => deletePrimitive(primitive.id)}
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
		<!-- Backdrop -->
		<button 
			class="fixed inset-0 bg-black/60" 
			on:click={closeEditor}
			on:keydown={(e) => e.key === 'Escape' && closeEditor()}
		></button>
		
		<!-- Modal -->
		<div class="relative bg-surface-900 rounded-xl border border-surface-700 w-full max-w-3xl shadow-2xl">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-surface-800">
				<h2 class="text-xl font-semibold">
					{editingPrimitive ? 'Edit Primitive' : 'New Primitive'}
				</h2>
				<button on:click={closeEditor} class="btn btn-ghost btn-sm">
					<X size={18} />
				</button>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={savePrimitive} class="p-6 space-y-6 max-h-[70vh] overflow-auto">
				<!-- Basic Info -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1.5">ID (slug)</label>
						<input
							type="text"
							bind:value={form.id}
							placeholder="e.g., for-loop"
							class="input w-full"
							disabled={!!editingPrimitive}
							required
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1.5">Name</label>
						<input
							type="text"
							bind:value={form.name}
							placeholder="e.g., For Loop"
							class="input w-full"
							required
						/>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1.5">Category</label>
						<select bind:value={form.category} class="input w-full">
							<option value="fundamentals">Fundamentals</option>
							<option value="data-structures">Data Structures</option>
							<option value="control-flow">Control Flow</option>
							<option value="functions">Functions</option>
							<option value="advanced">Advanced</option>
						</select>
					</div>
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
						<label class="block text-sm font-medium mb-1.5">Icon (emoji)</label>
						<input
							type="text"
							bind:value={form.icon}
							placeholder="📦"
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
						placeholder="A brief description of this primitive..."
						required
					></textarea>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1.5">Why It Matters</label>
					<textarea
						bind:value={form.whyItMatters}
						rows="3"
						class="input w-full"
						placeholder="Explain why this concept is important..."
					></textarea>
				</div>

				<!-- Best Practices -->
				<div>
					<label class="block text-sm font-medium mb-1.5">Best Practices</label>
					<div class="flex gap-2 mb-2">
						<input
							type="text"
							bind:value={bestPracticeInput}
							placeholder="Add a best practice..."
							class="input flex-1"
							on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addBestPractice())}
						/>
						<button type="button" on:click={addBestPractice} class="btn btn-secondary">
							<Plus size={16} />
						</button>
					</div>
					{#if form.bestPractices.length > 0}
						<div class="space-y-1">
							{#each form.bestPractices as bp, i}
								<div class="flex items-center gap-2 bg-surface-800 rounded px-3 py-1.5 text-sm">
									<span class="flex-1">{bp}</span>
									<button type="button" on:click={() => removeBestPractice(i)} class="text-red-400 hover:text-red-300">
										<X size={14} />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Pitfalls -->
				<div>
					<label class="block text-sm font-medium mb-1.5">Common Pitfalls</label>
					<div class="flex gap-2 mb-2">
						<input
							type="text"
							bind:value={pitfallInput}
							placeholder="Add a pitfall..."
							class="input flex-1"
							on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addPitfall())}
						/>
						<button type="button" on:click={addPitfall} class="btn btn-secondary">
							<Plus size={16} />
						</button>
					</div>
					{#if form.pitfalls.length > 0}
						<div class="space-y-1">
							{#each form.pitfalls as p, i}
								<div class="flex items-center gap-2 bg-surface-800 rounded px-3 py-1.5 text-sm">
									<span class="flex-1">{p}</span>
									<button type="button" on:click={() => removePitfall(i)} class="text-red-400 hover:text-red-300">
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

			<!-- Footer -->
			<div class="flex items-center justify-end gap-3 p-6 border-t border-surface-800">
				<button type="button" on:click={closeEditor} class="btn btn-ghost">
					Cancel
				</button>
				<button on:click={savePrimitive} class="btn btn-primary" disabled={saving}>
					{#if saving}
						<Loader2 size={16} class="animate-spin" />
					{:else}
						<Save size={16} />
					{/if}
					{editingPrimitive ? 'Update' : 'Create'} Primitive
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
