<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		ArrowLeft,
		Play,
		Send,
		RotateCcw,
		Lightbulb,
		Check,
		X,
		Clock,
		ChevronRight,
		Trophy
	} from 'lucide-svelte';
	import {
		currentExercise,
		currentCode,
		currentLanguage,
		testResults,
		runOutput,
		isRunning,
		visibleHints,
		canRevealMoreHints,
		allTestsPassed,
		loadExercise,
		setLanguage,
		updateCode,
		revealHint,
		runCode,
		submitSolution,
		resetExercise,
	} from '$lib/stores/exercises';
	import { getPrimitive, selectedLanguage } from '$lib/stores/primitives';
	import { SUPPORTED_LANGUAGES } from '@braids/core/constants';

	$: exerciseId = $page.params.exercise;
	$: primitiveId = $page.params.primitive;
	$: primitive = getPrimitive(primitiveId);

	let showSuccess = false;

	onMount(() => {
		loadExercise(exerciseId);
	});

	// Sync language with primitives store
	$: setLanguage($selectedLanguage);

	let editorElement: HTMLTextAreaElement;

	function handleKeyDown(event: KeyboardEvent) {
		// Handle Tab key for indentation
		if (event.key === 'Tab') {
			event.preventDefault();
			const start = editorElement.selectionStart;
			const end = editorElement.selectionEnd;
			const value = $currentCode;
			updateCode(value.substring(0, start) + '  ' + value.substring(end));
			// Set cursor position after indent
			setTimeout(() => {
				editorElement.selectionStart = editorElement.selectionEnd = start + 2;
			}, 0);
		}
		// Ctrl/Cmd + Enter to run
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			runCode();
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		updateCode(target.value);
	}

	async function handleSubmit() {
		const result = await submitSolution();
		if (result.success) {
			showSuccess = true;
		}
	}

	function getFileExtension(lang: string): string {
		const extensions: Record<string, string> = {
			javascript: 'js',
			typescript: 'ts',
			python: 'py',
			go: 'go',
			cpp: 'cpp',
		};
		return extensions[lang] || 'txt';
	}
</script>

<svelte:head>
	<title>{$currentExercise?.title || 'Exercise'} | ProgramPrimitives</title>
</svelte:head>

{#if $currentExercise}
	<div class="min-h-screen flex flex-col">
		<!-- Header -->
		<header class="bg-surface-900 border-b border-surface-800 px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<a
						href="/practice"
						class="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors"
					>
						<ArrowLeft size={20} />
					</a>
					<div>
						<div class="text-sm text-surface-500 flex items-center gap-2">
							<span>{primitive?.icon}</span>
							{primitive?.name || primitiveId}
						</div>
						<h1 class="font-semibold">{$currentExercise.title}</h1>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<!-- Language selector -->
					<select bind:value={$selectedLanguage} class="input py-1.5 text-sm w-36">
						{#each SUPPORTED_LANGUAGES.slice(0, 3) as lang}
							<option value={lang.id}>{lang.icon} {lang.name}</option>
						{/each}
					</select>

					<!-- Timer -->
					<div class="flex items-center gap-2 text-surface-400 text-sm">
						<Clock size={16} />
						<span>{$currentExercise.estimatedMinutes} min</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<div class="flex-1 flex overflow-hidden">
			<!-- Left Panel: Instructions -->
			<div class="w-96 border-r border-surface-800 overflow-y-auto bg-surface-950/50">
				<div class="p-6">
					<h2 class="text-lg font-semibold mb-4">Instructions</h2>

					<!-- Render markdown-like instructions -->
					<div class="prose prose-invert prose-sm max-w-none">
						{@html $currentExercise.instructions
							.replace(/^## (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2">$1</h3>')
							.replace(/^### (.+)$/gm, '<h4 class="text-sm font-medium mt-4 mb-2">$1</h4>')
							.replace(/^- (.+)$/gm, '<li class="text-surface-300">$1</li>')
							.replace(
								/```([^`]+)```/g,
								'<pre class="bg-surface-900 rounded p-3 text-sm overflow-x-auto my-3"><code>$1</code></pre>'
							)
							.replace(/`([^`]+)`/g, '<code class="bg-surface-800 px-1.5 py-0.5 rounded text-primary-400">$1</code>')
							.replace(/\n\n/g, '</p><p class="text-surface-300 mb-3">')
							.replace(/^(?!<)(.+)$/gm, '<p class="text-surface-300 mb-3">$1</p>')}
					</div>

					<!-- Hints Section -->
					<div class="mt-8 pt-6 border-t border-surface-800">
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-semibold flex items-center gap-2">
								<Lightbulb size={18} class="text-yellow-500" />
								Hints
							</h3>
							<span class="text-sm text-surface-500">
								{$visibleHints.length}/{$currentExercise.hints.length} used
							</span>
						</div>

						<!-- Show revealed hints -->
						{#each $visibleHints as hint, i}
							<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-3">
								<div class="text-xs text-yellow-400 mb-1">Hint {i + 1}</div>
								<p class="text-sm text-yellow-200">{hint}</p>
							</div>
						{/each}

						<button
							on:click={() => revealHint()}
							disabled={!$canRevealMoreHints}
							class="btn btn-secondary w-full justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Lightbulb size={16} />
							{$canRevealMoreHints ? 'Get a Hint' : 'No more hints'}
						</button>

						{#if $visibleHints.length > 0}
							<p class="text-xs text-surface-500 mt-2 text-center">
								Using hints reduces your score (-10% per hint)
							</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Center Panel: Code Editor -->
			<div class="flex-1 flex flex-col overflow-hidden">
				<!-- Editor Header -->
				<div class="bg-surface-900 border-b border-surface-800 px-4 py-2 flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full bg-red-500"></div>
						<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div class="w-3 h-3 rounded-full bg-green-500"></div>
						<span class="ml-2 text-surface-500 text-sm">
							solution.{getFileExtension($currentLanguage)}
						</span>
					</div>

					<div class="flex items-center gap-2">
						<button on:click={() => resetExercise()} class="btn btn-ghost text-sm py-1" title="Reset code">
							<RotateCcw size={16} />
							Reset
						</button>
					</div>
				</div>

				<!-- Code Editor (simplified textarea - would use Monaco in production) -->
				<div class="flex-1 bg-surface-950 relative overflow-hidden">
					<textarea
						bind:this={editorElement}
						value={$currentCode}
						on:input={handleInput}
						on:keydown={handleKeyDown}
						spellcheck="false"
						class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent text-surface-200 resize-none focus:outline-none leading-relaxed"
						style="tab-size: 2;"
					></textarea>
				</div>

				<!-- Action Buttons -->
				<div class="bg-surface-900 border-t border-surface-800 px-4 py-3 flex items-center justify-between">
					<div class="text-sm text-surface-500">
						<kbd class="px-1.5 py-0.5 rounded bg-surface-800 text-xs">Ctrl</kbd> +
						<kbd class="px-1.5 py-0.5 rounded bg-surface-800 text-xs">Enter</kbd> to run
					</div>

					<div class="flex items-center gap-3">
						<button
							on:click={() => runCode()}
							disabled={$isRunning}
							class="btn btn-secondary"
						>
							{#if $isRunning}
								<div class="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin"></div>
							{:else}
								<Play size={18} />
							{/if}
							Run
						</button>

						<button
							on:click={handleSubmit}
							disabled={$isRunning}
							class="btn btn-primary"
						>
							{#if $isRunning}
								<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							{:else}
								<Send size={18} />
							{/if}
							Submit
						</button>
					</div>
				</div>
			</div>

			<!-- Right Panel: Output & Tests -->
			<div class="w-96 border-l border-surface-800 flex flex-col bg-surface-950/50">
				<!-- Output -->
				<div class="flex-1 flex flex-col overflow-hidden">
					<div class="px-4 py-3 border-b border-surface-800">
						<h3 class="font-semibold">Output</h3>
					</div>
					<div class="flex-1 overflow-y-auto p-4">
						<pre class="font-mono text-sm text-surface-300 whitespace-pre-wrap">{$runOutput || 'Run your code to see output...'}</pre>
					</div>
				</div>

				<!-- Test Results -->
				{#if $testResults.length > 0}
					<div class="border-t border-surface-800">
						<div class="px-4 py-3 border-b border-surface-800 flex items-center justify-between">
							<h3 class="font-semibold">Test Results</h3>
							<span class="text-sm {$allTestsPassed ? 'text-primary-400' : 'text-surface-500'}">
								{$testResults.filter(r => r.passed).length}/{$testResults.length} passed
							</span>
						</div>
						<div class="p-4 space-y-2 max-h-64 overflow-y-auto">
							{#each $testResults as result}
								<div
									class="flex items-center gap-3 p-3 rounded-lg {result.passed
										? 'bg-primary-500/10 border border-primary-500/30'
										: 'bg-red-500/10 border border-red-500/30'}"
								>
									{#if result.passed}
										<Check size={18} class="text-primary-500 shrink-0" />
									{:else}
										<X size={18} class="text-red-500 shrink-0" />
									{/if}
									<div class="flex-1 min-w-0">
										<div class="font-medium text-sm">{result.name}</div>
										{#if !result.passed}
											<div class="text-xs text-surface-500 mt-1">
												Expected: <code class="text-primary-400">{result.expected}</code>
											</div>
										{/if}
									</div>
									<div class="text-xs text-surface-500">
										{result.executionTimeMs}ms
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Success Modal -->
		{#if showSuccess}
			<div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
				<div class="card p-8 max-w-md mx-4 text-center animate-slide-up">
					<div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
						<Trophy size={40} class="text-white" />
					</div>
					<h2 class="text-2xl font-bold mb-2">Exercise Complete! 🎉</h2>
					<p class="text-surface-400 mb-6">Great job! You've mastered this challenge.</p>

					<div class="flex items-center justify-center gap-8 mb-8">
						<div>
							<div class="text-3xl font-bold text-primary-400">+{$currentExercise.difficulty * 25}</div>
							<div class="text-sm text-surface-500">XP Earned</div>
						</div>
						<div>
							<div class="text-3xl font-bold text-accent-400">
								{100 - ($visibleHints.length * 10)}%
							</div>
							<div class="text-sm text-surface-500">Score</div>
						</div>
					</div>

					<div class="flex gap-3">
						<button
							on:click={() => showSuccess = false}
							class="btn btn-secondary flex-1 justify-center"
						>
							Review Solution
						</button>
						<a href="/practice" class="btn btn-primary flex-1 justify-center">
							Next Exercise
							<ChevronRight size={18} />
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-surface-400">Loading exercise...</p>
		</div>
	</div>
{/if}
