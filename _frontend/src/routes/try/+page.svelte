<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import { 
		BookOpen, Code2, Play, Clock, Star, Lock, ChevronRight, Sparkles, 
		Check, Zap, Trophy, ArrowRight, ArrowLeft, Target, Lightbulb,
		RotateCcw, ChevronLeft, X, Home
	} from 'lucide-svelte';
	import { 
		freeZone, 
		completedLessonsCount,
		completedExercisesCount,
		FREE_ZONE_CONFIG,
		FREE_LESSONS_DATA,
		FREE_EXERCISES_DATA,
		type FreeLesson,
		type FreeExercise,
	} from '@braids/free-zone/frontend/stores/free-zone';
	import { funnelTracking } from '@braids/free-zone/frontend/stores/funnel-tracking';

	// ============================================
	// State
	// ============================================
	
	type ViewMode = 'overview' | 'lesson' | 'exercise';
	
	let viewMode: ViewMode = 'overview';
	let currentLessonIndex = 0;
	let currentExerciseIndex = 0;
	
	// Exercise state
	let code = '';
	let output = '';
	let isRunning = false;
	let showHint = false;
	let hintIndex = 0;
	let startTime = Date.now();

	// ============================================
	// Computed
	// ============================================
	
	$: currentLesson = FREE_LESSONS_DATA[currentLessonIndex];
	$: currentExercise = FREE_EXERCISES_DATA[currentExerciseIndex];
	
	$: lessonsProgress = ($completedLessonsCount / FREE_ZONE_CONFIG.maxFreeLessons) * 100;
	$: exercisesProgress = ($completedExercisesCount / FREE_ZONE_CONFIG.maxFreeExercises) * 100;
	$: totalProgress = (($completedLessonsCount + $completedExercisesCount) / 
		(FREE_ZONE_CONFIG.maxFreeLessons + FREE_ZONE_CONFIG.maxFreeExercises)) * 100;
	$: allLessonsComplete = $completedLessonsCount >= FREE_ZONE_CONFIG.maxFreeLessons;
	$: allComplete = allLessonsComplete && $completedExercisesCount >= FREE_ZONE_CONFIG.maxFreeExercises;

	// ============================================
	// Lesson Logic
	// ============================================
	
	function isLessonComplete(lesson: FreeLesson): boolean {
		return $freeZone.lessonsCompleted.includes(lesson.id);
	}

	function isLessonUnlocked(index: number): boolean {
		if (index === 0) return true;
		const prevLesson = FREE_LESSONS_DATA[index - 1];
		return prevLesson && $freeZone.lessonsCompleted.includes(prevLesson.id);
	}

	function openLesson(index: number) {
		if (!isLessonUnlocked(index)) return;
		currentLessonIndex = index;
		viewMode = 'lesson';
		freeZone.startLesson(FREE_LESSONS_DATA[index].id);
		
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: 'try_lesson_view',
			lessonId: FREE_LESSONS_DATA[index].id,
		});
	}

	function completeLesson() {
		const lesson = currentLesson;
		if (!lesson || $freeZone.lessonsCompleted.includes(lesson.id)) return;
		
		freeZone.completeLesson(lesson.id);
		
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: `try_lesson_complete_${currentLessonIndex + 1}`,
			lessonId: lesson.id,
		});
	}

	function nextLesson() {
		if (currentLessonIndex < FREE_LESSONS_DATA.length - 1) {
			openLesson(currentLessonIndex + 1);
		} else {
			viewMode = 'overview';
		}
	}

	function prevLesson() {
		if (currentLessonIndex > 0) {
			openLesson(currentLessonIndex - 1);
		}
	}

	// ============================================
	// Exercise Logic
	// ============================================
	
	function isExerciseComplete(exercise: FreeExercise): boolean {
		return $freeZone.exercisesCompleted.includes(exercise.id);
	}

	function isExerciseUnlocked(index: number): boolean {
		if (!allLessonsComplete) return false;
		if (index === 0) return true;
		const prevExercise = FREE_EXERCISES_DATA[index - 1];
		return prevExercise && $freeZone.exercisesCompleted.includes(prevExercise.id);
	}

	function openExercise(index: number) {
		if (!isExerciseUnlocked(index)) return;
		currentExerciseIndex = index;
		viewMode = 'exercise';
		
		const exercise = FREE_EXERCISES_DATA[index];
		code = exercise.starterCode.javascript || '';
		output = '';
		showHint = false;
		hintIndex = 0;
		startTime = Date.now();
		
		freeZone.startExercise(exercise.id);
		
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: 'try_exercise_view',
			exerciseId: exercise.id,
		});
	}

	function runCode() {
		if (isRunning || !currentExercise) return;
		
		isRunning = true;
		output = '';

		try {
			const result = evaluateCode(code, currentExercise);
			if (result.success) {
				output = '✅ All tests passed!\n\n' + result.output;
				completeExercise();
			} else {
				output = '❌ Tests failed:\n\n' + result.output;
			}
		} catch (e: any) {
			output = `❌ Error: ${e.message}`;
		} finally {
			isRunning = false;
		}
	}

	function evaluateCode(code: string, exercise: FreeExercise): { success: boolean; output: string } {
		// Exercise 1: Simple pattern matching
		if (exercise.id === 'free-ex-001') {
			return validateExercise1(code);
		}
		
		// Exercise 2: Text vs Numbers
		if (exercise.id === 'free-ex-002') {
			return validateExercise2(code);
		}
		
		// Exercise 3: Combine Variables
		if (exercise.id === 'free-ex-003') {
			return validateExercise3(code);
		}

		return { success: false, output: 'Unknown exercise' };
	}

	// ============================================
	// Exercise Validators with Friendly Feedback
	// ============================================

	// Helper: Remove comments from code
	function cleanCode(code: string): string {
		return code
			.split('\n')
			.filter(line => !line.trim().startsWith('//'))
			.join('\n')
			.trim();
	}

	// Helper: Try to run code and get variable values
	function tryRunCode(code: string): { success: boolean; values: Record<string, any>; error?: string } {
		try {
			const sandbox = new Function(`
				${code}
				return { 
					firstName: typeof firstName !== 'undefined' ? firstName : undefined,
					lastName: typeof lastName !== 'undefined' ? lastName : undefined,
					age: typeof age !== 'undefined' ? age : undefined,
					fullName: typeof fullName !== 'undefined' ? fullName : undefined,
				};
			`);
			return { success: true, values: sandbox() };
		} catch (e: any) {
			return { success: false, values: {}, error: e.message };
		}
	}

	// Exercise 1: Create Your First Variable
	function validateExercise1(code: string): { success: boolean; output: string } {
		const clean = cleanCode(code);

		if (!clean) {
			return { 
				success: false, 
				output: '👆 Type your variable above!\n\nExample: let name = "Alex"' 
			};
		}

		// Pattern: let/const variableName = "string" or 'string'
		const pattern = /^(let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*["'](.+?)["']\s*;?\s*$/;
		const match = clean.match(pattern);

		if (match) {
			const [, keyword, varName, value] = match;
			return {
				success: true,
				output: `✓ ${keyword} ${varName} = "${value}"\n\n` +
					`🎉 Perfect! You created a variable called "${varName}"!\n\n` +
					`The computer now remembers that ${varName} = "${value}"`
			};
		}

		// Helpful feedback
		if (!clean.startsWith('let') && !clean.startsWith('const')) {
			return { success: false, output: '💡 Start with "let" or "const"\n\nExample: let name = "Alex"' };
		} else if (!clean.includes('=')) {
			return { success: false, output: '💡 Use = to assign a value\n\nExample: let name = "Alex"' };
		} else if (!clean.includes('"') && !clean.includes("'")) {
			return { success: false, output: '💡 Put your text in quotes\n\nExample: let name = "Alex"' };
		}
		
		return { success: false, output: '💡 Almost there! Try this format:\n\nlet variableName = "your text"' };
	}

	// Exercise 2: Text vs Numbers
	function validateExercise2(code: string): { success: boolean; output: string } {
		const clean = cleanCode(code);

		if (!clean) {
			return { 
				success: false, 
				output: '👆 Create your two variables above!\n\n' +
					'Example:\nlet firstName = "Alex"\nlet age = 25' 
			};
		}

		const result = tryRunCode(code);

		if (!result.success) {
			// Parse the error to give friendly feedback
			if (result.error?.includes('Unexpected identifier')) {
				return { 
					success: false, 
					output: '💡 Syntax tip: Each variable needs its own "let"\n\n' +
						'let firstName = "Alex"\nlet age = 25'
				};
			}
			return { 
				success: false, 
				output: `💡 Something's not quite right:\n${result.error}\n\n` +
					'Try this format:\nlet firstName = "Alex"\nlet age = 25'
			};
		}

		const { firstName, age } = result.values;
		let output = '';
		let checks = { firstName: false, age: false };

		// Check firstName
		if (firstName === undefined) {
			output += '⬜ firstName - not found yet\n';
			output += '   → Add: let firstName = "YourName"\n\n';
		} else if (typeof firstName !== 'string') {
			output += `⚠️ firstName = ${firstName}\n`;
			output += '   → This should be text in quotes!\n';
			output += '   → Try: let firstName = "Alex"\n\n';
		} else if (firstName.length === 0) {
			output += '⚠️ firstName is empty\n';
			output += '   → Put some text between the quotes\n\n';
		} else {
			output += `✓ firstName = "${firstName}" ✨\n\n`;
			checks.firstName = true;
		}

		// Check age
		if (age === undefined) {
			output += '⬜ age - not found yet\n';
			output += '   → Add: let age = 25\n\n';
		} else if (typeof age === 'string') {
			output += `⚠️ age = "${age}"\n`;
			output += '   → This is text! Numbers don\'t need quotes\n';
			output += '   → Try: let age = 25 (no quotes)\n\n';
		} else if (typeof age !== 'number') {
			output += `⚠️ age = ${age}\n`;
			output += '   → This should be a number\n';
			output += '   → Try: let age = 25\n\n';
		} else {
			output += `✓ age = ${age} ✨\n\n`;
			checks.age = true;
		}

		if (checks.firstName && checks.age) {
			return {
				success: true,
				output: output + 
					'🎉 Awesome! You understand the difference:\n' +
					`   • "${firstName}" is text (string)\n` +
					`   • ${age} is a number\n\n` +
					'Text uses quotes, numbers don\'t!'
			};
		}

		return { success: false, output };
	}

	// Exercise 3: Combine Variables
	function validateExercise3(code: string): { success: boolean; output: string } {
		const clean = cleanCode(code);

		if (!clean) {
			return { 
				success: false, 
				output: '👆 Create your three variables above!\n\n' +
					'Example:\nlet firstName = "Alex"\nlet lastName = "Smith"\nlet fullName = firstName + " " + lastName' 
			};
		}

		const result = tryRunCode(code);

		if (!result.success) {
			if (result.error?.includes('is not defined')) {
				const missing = result.error.match(/(\w+) is not defined/)?.[1];
				return { 
					success: false, 
					output: `💡 "${missing}" doesn't exist yet!\n\n` +
						'Create variables in order:\n' +
						'1. let firstName = "YourName"\n' +
						'2. let lastName = "YourLastName"\n' +
						'3. let fullName = firstName + " " + lastName'
				};
			}
			return { 
				success: false, 
				output: `💡 Something's not quite right:\n${result.error}`
			};
		}

		const { firstName, lastName, fullName } = result.values;
		let output = '';
		let checks = { firstName: false, lastName: false, fullName: false };

		// Check firstName - any non-empty string is fine
		if (firstName === undefined) {
			output += '⬜ Step 1: firstName - not found\n';
			output += '   → Add: let firstName = "YourName"\n\n';
		} else if (typeof firstName !== 'string') {
			output += `⚠️ Step 1: firstName = ${firstName}\n`;
			output += '   → This should be text in quotes\n';
			output += '   → Try: let firstName = "Alex"\n\n';
		} else if (firstName.length === 0) {
			output += '⚠️ Step 1: firstName is empty\n';
			output += '   → Put a name between the quotes!\n\n';
		} else {
			output += `✓ Step 1: firstName = "${firstName}" ✨\n\n`;
			checks.firstName = true;
		}

		// Check lastName - any non-empty string is fine
		if (lastName === undefined) {
			output += '⬜ Step 2: lastName - not found\n';
			output += '   → Add: let lastName = "YourLastName"\n\n';
		} else if (typeof lastName !== 'string') {
			output += `⚠️ Step 2: lastName = ${lastName}\n`;
			output += '   → This should be text in quotes\n';
			output += '   → Try: let lastName = "Smith"\n\n';
		} else if (lastName.length === 0) {
			output += '⚠️ Step 2: lastName is empty\n';
			output += '   → Put a name between the quotes!\n\n';
		} else {
			output += `✓ Step 2: lastName = "${lastName}" ✨\n\n`;
			checks.lastName = true;
		}

		// Check fullName - should be firstName + " " + lastName
		const expectedFullName = checks.firstName && checks.lastName 
			? `${firstName} ${lastName}` 
			: null;

		if (fullName === undefined) {
			output += '⬜ Step 3: fullName - not found\n';
			output += '   → Add: let fullName = firstName + " " + lastName\n\n';
		} else if (!checks.firstName || !checks.lastName) {
			output += '⬜ Step 3: Complete steps 1 & 2 first!\n\n';
		} else if (fullName === firstName + lastName) {
			output += `⚠️ Step 3: fullName = "${fullName}"\n`;
			output += '   → So close! Don\'t forget the space between names\n';
			output += '   → Use: firstName + " " + lastName\n\n';
		} else if (fullName !== expectedFullName) {
			output += `⚠️ Step 3: fullName = "${fullName}"\n`;
			output += `   → Expected: "${expectedFullName}"\n`;
			output += '   → Try: firstName + " " + lastName\n\n';
		} else {
			output += `✓ Step 3: fullName = "${fullName}" ✨\n\n`;
			checks.fullName = true;
		}

		if (checks.firstName && checks.lastName && checks.fullName) {
			return {
				success: true,
				output: output + 
					'🎉 You did it! You combined two variables!\n\n' +
					`"${firstName}" + " " + "${lastName}" = "${fullName}"\n\n` +
					'The + symbol joins text together. The " " adds a space!'
			};
		}

		return { success: false, output };
	}

	function completeExercise() {
		const exercise = currentExercise;
		if (!exercise || $freeZone.exercisesCompleted.includes(exercise.id)) return;
		
		freeZone.completeExercise(exercise.id);
		const duration = Math.round((Date.now() - startTime) / 1000);
		
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: `try_exercise_complete_${currentExerciseIndex + 1}`,
			exerciseId: exercise.id,
			metadata: { duration },
		});
	}

	function resetCode() {
		if (currentExercise) {
			code = currentExercise.starterCode.javascript || '';
			output = '';
		}
	}

	function nextExercise() {
		if (currentExerciseIndex < FREE_EXERCISES_DATA.length - 1) {
			openExercise(currentExerciseIndex + 1);
		} else {
			viewMode = 'overview';
		}
	}

	function showNextHint() {
		if (currentExercise && hintIndex < currentExercise.hints.length) {
			showHint = true;
			freeZone.useHint();
		}
	}

	// ============================================
	// Markdown Renderer
	// ============================================
	
	function renderMarkdown(md: string): string {
		if (!md) return '';
		return md
			.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-surface-950 border border-surface-700 rounded-lg p-4 my-4 overflow-x-auto"><code class="font-mono text-sm text-surface-300">$2</code></pre>')
			.replace(/\|(.+)\|/g, (match) => {
				// Simple table handling
				return match;
			})
			.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-sky-400">$1</h3>')
			.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-surface-100">$1</h2>')
			.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-surface-100">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code class="bg-surface-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-sm">$1</code>')
			.replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-surface-300">• $1</li>')
			.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1 text-surface-300">$1. $2</li>')
			.replace(/\n\n/g, '</p><p class="mb-4 text-surface-300 leading-relaxed">');
	}

	// ============================================
	// Lifecycle
	// ============================================
	
	onMount(() => {
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: 'try_page_view',
		});
	});

	function trackSignupClick(touchpoint: string) {
		funnelTracking.track({
			eventType: 'click',
			funnelName: 'try_signup',
			touchpoint,
		});
	}
</script>

<svelte:head>
	<title>Try Free | ProgramPrimitives</title>
	<meta name="description" content="Try ProgramPrimitives for free! Learn variables with 3 lessons and 3 exercises. No account required." />
</svelte:head>

<div class="min-h-screen">
	<!-- ============================================ -->
	<!-- OVERVIEW MODE -->
	<!-- ============================================ -->
	{#if viewMode === 'overview'}
		<div class="pb-20" in:fade={{ duration: 200 }}>
			<!-- Hero Section -->
			<div class="bg-gradient-to-b from-sky-500/20 via-primary-500/10 to-transparent py-16">
				<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div class="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-500/30 rounded-full px-4 py-1.5 mb-6">
						<Sparkles size={16} class="text-sky-400" />
						<span class="text-sm font-medium text-sky-300">Free Preview — No account required</span>
					</div>
					
					<h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
						Learn <span class="text-gradient">Variables</span>
					</h1>
					
					<p class="text-xl text-surface-400 mb-8 max-w-2xl mx-auto">
						Master the building blocks of programming. Complete 3 lessons and 3 exercises 
						to experience the full learning journey.
					</p>

					<!-- Overall Progress -->
					<div class="inline-flex flex-col items-center gap-3 bg-surface-800/50 rounded-2xl px-8 py-4 border border-surface-700">
						<div class="flex items-center gap-4">
							<div class="text-center">
								<div class="text-2xl font-bold text-sky-400">{$completedLessonsCount}/{FREE_ZONE_CONFIG.maxFreeLessons}</div>
								<div class="text-xs text-surface-500">Lessons</div>
							</div>
							<div class="w-px h-8 bg-surface-700"></div>
							<div class="text-center">
								<div class="text-2xl font-bold text-amber-400">{$completedExercisesCount}/{FREE_ZONE_CONFIG.maxFreeExercises}</div>
								<div class="text-xs text-surface-500">Exercises</div>
							</div>
						</div>
						<div class="w-64 h-2 bg-surface-700 rounded-full overflow-hidden">
							<div 
								class="h-full bg-gradient-to-r from-sky-500 via-primary-500 to-amber-500 transition-all duration-500"
								style="width: {totalProgress}%"
							></div>
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
				<!-- Tool Metaphor Card -->
				<div class="card p-6 mb-12 bg-gradient-to-br from-sky-500/5 to-transparent border-sky-500/20">
					<div class="flex items-center gap-6">
						<div class="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center text-4xl">
							📦
						</div>
						<div class="flex-1">
							<h2 class="text-xl font-bold mb-1">Variables: The Container</h2>
							<p class="text-surface-400">
								A variable is like a labeled box that holds information. You can put data in, 
								take it out, and change what's inside.
							</p>
						</div>
					</div>
				</div>

				<!-- Phase 1: Lessons -->
				<section class="mb-16">
					<div class="flex items-center justify-between mb-6">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
								<BookOpen size={20} class="text-sky-400" />
							</div>
							<div>
								<h2 class="text-xl font-bold">📐 Blueprint Phase</h2>
								<p class="text-sm text-surface-500">Learn the WHY behind variables</p>
							</div>
						</div>
						<div class="flex items-center gap-2 text-sm text-surface-400">
							<div class="w-24 h-2 bg-surface-800 rounded-full overflow-hidden">
								<div 
									class="h-full bg-sky-500 transition-all"
									style="width: {lessonsProgress}%"
								></div>
							</div>
							<span>{$completedLessonsCount}/{FREE_ZONE_CONFIG.maxFreeLessons}</span>
						</div>
					</div>

					<div class="space-y-3">
						{#each FREE_LESSONS_DATA as lesson, i}
							{@const completed = isLessonComplete(lesson)}
							{@const unlocked = isLessonUnlocked(i)}
							<button
								on:click={() => openLesson(i)}
								disabled={!unlocked}
								class="w-full card p-5 flex items-center gap-4 group transition-all text-left
									{!unlocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-sky-500/50 cursor-pointer'}
									{completed ? 'border-sky-500/30 bg-sky-500/5' : ''}"
							>
								<!-- Step indicator -->
								<div class="relative">
									<div
										class="w-12 h-12 rounded-xl flex items-center justify-center transition-all
											{completed 
												? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
												: unlocked
													? 'bg-surface-800 text-surface-300 group-hover:bg-sky-500/10 group-hover:text-sky-400'
													: 'bg-surface-800 text-surface-600'}"
									>
										{#if completed}
											<Check size={24} />
										{:else if unlocked}
											<span class="text-lg font-bold">{i + 1}</span>
										{:else}
											<Lock size={20} />
										{/if}
									</div>
									{#if i < FREE_LESSONS_DATA.length - 1}
										<div class="absolute top-full left-1/2 w-0.5 h-3 -translate-x-1/2 
											{completed ? 'bg-sky-500/50' : 'bg-surface-700'}"></div>
									{/if}
								</div>

								<!-- Content -->
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-lg mb-1 
										{unlocked ? 'group-hover:text-sky-400' : ''} transition-colors">
										{lesson.title}
									</h3>
									<p class="text-sm text-surface-500 line-clamp-1">{lesson.description}</p>
								</div>

								<!-- Meta -->
								<div class="flex items-center gap-4 shrink-0">
									<div class="flex items-center gap-1.5 text-surface-500 text-sm">
										<Clock size={14} />
										{lesson.estimatedMinutes} min
									</div>
									{#if unlocked && !completed}
										<ChevronRight size={20} class="text-surface-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</section>

				<!-- Phase 2: Exercises -->
				<section class="mb-16">
					<div class="flex items-center justify-between mb-6">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
								<Code2 size={20} class="text-amber-400" />
							</div>
							<div>
								<h2 class="text-xl font-bold">🔨 Practice Phase</h2>
								<p class="text-sm text-surface-500">Apply what you learned</p>
							</div>
						</div>
						<div class="flex items-center gap-2 text-sm text-surface-400">
							<div class="w-24 h-2 bg-surface-800 rounded-full overflow-hidden">
								<div 
									class="h-full bg-amber-500 transition-all"
									style="width: {exercisesProgress}%"
								></div>
							</div>
							<span>{$completedExercisesCount}/{FREE_ZONE_CONFIG.maxFreeExercises}</span>
						</div>
					</div>

					{#if !allLessonsComplete}
						<div class="card p-8 text-center border-dashed">
							<Lock size={32} class="mx-auto text-surface-600 mb-4" />
							<h3 class="font-semibold mb-2">Complete All Lessons First</h3>
							<p class="text-sm text-surface-500">
								Finish the 3 Blueprint lessons above to unlock practice exercises.
							</p>
						</div>
					{:else}
						<div class="space-y-3">
							{#each FREE_EXERCISES_DATA as exercise, i}
								{@const completed = isExerciseComplete(exercise)}
								{@const unlocked = isExerciseUnlocked(i)}
								<button
									on:click={() => openExercise(i)}
									disabled={!unlocked}
									class="w-full card p-5 flex items-center gap-4 group transition-all text-left
										{!unlocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-amber-500/50 cursor-pointer'}
										{completed ? 'border-amber-500/30 bg-amber-500/5' : ''}"
								>
									<!-- Step indicator -->
									<div class="relative">
										<div
											class="w-12 h-12 rounded-xl flex items-center justify-center transition-all
												{completed 
													? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
													: unlocked
														? 'bg-surface-800 text-surface-300 group-hover:bg-amber-500/10 group-hover:text-amber-400'
														: 'bg-surface-800 text-surface-600'}"
										>
											{#if completed}
												<Check size={24} />
											{:else if unlocked}
												<Play size={20} />
											{:else}
												<Lock size={20} />
											{/if}
										</div>
										{#if i < FREE_EXERCISES_DATA.length - 1}
											<div class="absolute top-full left-1/2 w-0.5 h-3 -translate-x-1/2 
												{completed ? 'bg-amber-500/50' : 'bg-surface-700'}"></div>
										{/if}
									</div>

									<!-- Content -->
									<div class="flex-1 min-w-0">
										<h3 class="font-semibold text-lg mb-1 
											{unlocked ? 'group-hover:text-amber-400' : ''} transition-colors">
											{exercise.title}
										</h3>
										<p class="text-sm text-surface-500 line-clamp-1">{exercise.description}</p>
									</div>

									<!-- Meta -->
									<div class="flex items-center gap-4 shrink-0">
										<div class="flex items-center gap-1.5 text-surface-500 text-sm">
											<Clock size={14} />
											{exercise.estimatedMinutes} min
										</div>
										<div class="flex items-center gap-0.5">
											{#each Array(exercise.difficulty) as _}
												<Star size={12} class="fill-amber-500 text-amber-500" />
											{/each}
											{#each Array(3 - exercise.difficulty) as _}
												<Star size={12} class="text-surface-700" />
											{/each}
										</div>
										{#if unlocked && !completed}
											<ChevronRight size={20} class="text-surface-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
										{/if}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</section>

				<!-- Completion / Upgrade CTA -->
				{#if allComplete}
					<div class="card p-8 bg-gradient-to-br from-primary-500/20 via-accent-500/10 to-primary-500/20 border-primary-500/30 text-center">
						<div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
							<Trophy size={40} class="text-white" />
						</div>
						<h2 class="text-2xl font-bold mb-3">You've Completed the Free Preview! 🎉</h2>
						<p class="text-surface-400 mb-6 max-w-md mx-auto">
							Great job! You've learned the basics of variables. Ready to master all 8 programming tools 
							across multiple languages?
						</p>
						<div class="flex items-center justify-center gap-4">
							<a 
								href="/register" 
								class="btn btn-primary text-lg px-8"
								on:click={() => trackSignupClick('try_complete_signup_cta')}
							>
								<Sparkles size={20} />
								Continue Learning Free
							</a>
							<a href="/pricing" class="btn btn-ghost">
								View Plans
							</a>
						</div>
					</div>
				{:else}
					<div class="card p-6 bg-gradient-to-r from-surface-800/50 to-surface-900/50 border-surface-700">
						<div class="flex items-center gap-6">
							<div class="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
								<Target size={28} class="text-primary-400" />
							</div>
							<div class="flex-1">
								<h3 class="font-semibold mb-1">Like what you see?</h3>
								<p class="text-sm text-surface-400">
									Create a free account to unlock all 8 tools, track your progress, and learn in any language.
								</p>
							</div>
							<a 
								href="/register" 
								class="btn btn-primary shrink-0"
								on:click={() => trackSignupClick('try_page_signup_cta')}
							>
								Get Started
								<ArrowRight size={18} />
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- ============================================ -->
	<!-- LESSON MODE -->
	<!-- ============================================ -->
	{#if viewMode === 'lesson' && currentLesson}
		<div class="min-h-screen flex flex-col" in:fly={{ x: 50, duration: 200 }}>
			<!-- Header -->
			<div class="bg-surface-900 border-b border-surface-800 py-3 px-4 sticky top-0 z-10">
				<div class="max-w-4xl mx-auto flex items-center justify-between">
					<div class="flex items-center gap-4">
						<button on:click={() => viewMode = 'overview'} class="btn btn-ghost btn-sm">
							<ArrowLeft size={16} />
							Back
						</button>
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
								<BookOpen size={16} class="text-sky-400" />
							</div>
							<div>
								<h1 class="font-semibold">{currentLesson.title}</h1>
								<div class="flex items-center gap-2 text-xs text-surface-500">
									<span>Lesson {currentLessonIndex + 1} of {FREE_LESSONS_DATA.length}</span>
									{#if isLessonComplete(currentLesson)}
										<span class="text-sky-400 flex items-center gap-1">
											<Check size={12} />
											Complete
										</span>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<!-- Progress -->
					<div class="flex items-center gap-2">
						{#each FREE_LESSONS_DATA as lesson, i}
							<div 
								class="w-10 h-1.5 rounded-full transition-colors cursor-pointer
									{$freeZone.lessonsCompleted.includes(lesson.id) 
										? 'bg-sky-500' 
										: lesson.id === currentLesson.id 
											? 'bg-sky-500/50' 
											: 'bg-surface-700'}
									{isLessonUnlocked(i) ? 'hover:bg-sky-500/70' : ''}"
								on:click={() => isLessonUnlocked(i) && openLesson(i)}
								on:keydown={(e) => e.key === 'Enter' && isLessonUnlocked(i) && openLesson(i)}
								role="button"
								tabindex={isLessonUnlocked(i) ? 0 : -1}
							></div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto">
				<div class="max-w-3xl mx-auto px-4 py-8">
					<div class="prose prose-invert max-w-none">
						{@html renderMarkdown(currentLesson.content)}
					</div>

					<!-- Completion Section -->
					<div class="mt-12 pt-8 border-t border-surface-800">
						{#if !isLessonComplete(currentLesson)}
							<button
								on:click={completeLesson}
								class="w-full btn btn-primary py-4 text-lg mb-6"
							>
								<Check size={20} />
								Mark as Complete
							</button>
						{:else}
							<div class="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
								<div class="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
									<Check size={20} class="text-sky-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-medium text-sky-400">Lesson Complete!</h4>
									<p class="text-sm text-surface-400">Great job understanding {currentLesson.title.toLowerCase()}.</p>
								</div>
							</div>
						{/if}

						<!-- Navigation -->
						<div class="flex items-center justify-between gap-4">
							{#if currentLessonIndex > 0}
								<button
									on:click={prevLesson}
									class="flex-1 card p-4 hover:border-surface-600 transition-colors group text-left"
								>
									<div class="flex items-center gap-3">
										<ChevronLeft size={20} class="text-surface-500 group-hover:text-sky-400 transition-colors" />
										<div>
											<span class="text-xs text-surface-500">Previous</span>
											<h4 class="font-medium group-hover:text-sky-400 transition-colors truncate">
												{FREE_LESSONS_DATA[currentLessonIndex - 1].title}
											</h4>
										</div>
									</div>
								</button>
							{:else}
								<div class="flex-1"></div>
							{/if}

							<button
								on:click={nextLesson}
								disabled={!isLessonComplete(currentLesson)}
								class="flex-1 card p-4 transition-colors group bg-gradient-to-r from-transparent to-sky-500/5 flex items-center justify-end gap-3 text-right
									{isLessonComplete(currentLesson) ? 'hover:border-sky-500/50' : 'opacity-50 cursor-not-allowed'}"
							>
								<div>
									<span class="text-xs text-surface-500">
										{currentLessonIndex < FREE_LESSONS_DATA.length - 1 ? 'Next Lesson' : 'Start Practicing'}
									</span>
									<h4 class="font-medium group-hover:text-sky-400 transition-colors truncate">
										{currentLessonIndex < FREE_LESSONS_DATA.length - 1 
											? FREE_LESSONS_DATA[currentLessonIndex + 1].title 
											: 'Go to Exercises'}
									</h4>
								</div>
								<ArrowRight size={20} class="text-sky-400 group-hover:translate-x-1 transition-transform" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- ============================================ -->
	<!-- EXERCISE MODE -->
	<!-- ============================================ -->
	{#if viewMode === 'exercise' && currentExercise}
		<div class="h-screen flex flex-col" in:fly={{ x: 50, duration: 200 }}>
			<!-- Header -->
			<div class="bg-surface-900 border-b border-surface-800 py-3 px-4 shrink-0">
				<div class="max-w-7xl mx-auto flex items-center justify-between">
					<div class="flex items-center gap-4">
						<button on:click={() => viewMode = 'overview'} class="btn btn-ghost btn-sm">
							<ArrowLeft size={16} />
							Back
						</button>
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
								<Code2 size={16} class="text-amber-400" />
							</div>
							<div>
								<h1 class="font-semibold">{currentExercise.title}</h1>
								<div class="flex items-center gap-2 text-xs text-surface-500">
									<span>Exercise {currentExerciseIndex + 1} of {FREE_EXERCISES_DATA.length}</span>
									{#if isExerciseComplete(currentExercise)}
										<span class="text-primary-400 flex items-center gap-1">
											<Check size={12} />
											Complete
										</span>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<!-- Progress -->
					<div class="flex items-center gap-2">
						{#each FREE_EXERCISES_DATA as exercise, i}
							<div 
								class="w-10 h-1.5 rounded-full transition-colors
									{$freeZone.exercisesCompleted.includes(exercise.id) 
										? 'bg-amber-500' 
										: exercise.id === currentExercise.id 
											? 'bg-amber-500/50' 
											: 'bg-surface-700'}"
							></div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="flex-1 flex overflow-hidden">
				<!-- Left Panel: Instructions -->
				<div class="w-[400px] shrink-0 border-r border-surface-800 overflow-y-auto p-6 bg-surface-900/50">
					<div class="prose prose-sm prose-invert max-w-none">
						{@html renderMarkdown(currentExercise.instructions)}
					</div>

					<!-- Hints -->
					{#if currentExercise.hints.length > 0}
						<div class="mt-6 pt-4 border-t border-surface-800">
							{#if showHint}
								<div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4" transition:slide>
									<div class="flex items-start gap-2 mb-2">
										<Lightbulb size={16} class="text-amber-400 shrink-0 mt-0.5" />
										<span class="text-sm font-medium text-amber-400">Hint</span>
									</div>
									<p class="text-sm text-surface-300">
										{currentExercise.hints[Math.min(hintIndex, currentExercise.hints.length - 1)]}
									</p>
									{#if hintIndex < currentExercise.hints.length - 1}
										<button
											on:click={() => hintIndex++}
											class="text-xs text-amber-400 hover:underline mt-2"
										>
											Show another hint
										</button>
									{/if}
								</div>
							{:else}
								<button
									on:click={showNextHint}
									class="text-sm text-surface-500 hover:text-amber-400 transition-colors flex items-center gap-2"
								>
									<Lightbulb size={14} />
									Need a hint?
								</button>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Right Panel: Code Editor & Output -->
				<div class="flex-1 flex flex-col overflow-hidden">
					<!-- Editor Header -->
					<div class="bg-surface-900 border-b border-surface-800 py-2 px-4 flex items-center justify-between shrink-0">
						<div class="flex items-center gap-4">
							<span class="text-sm font-mono text-surface-400">solution.js</span>
						</div>
						<div class="flex items-center gap-2">
							<button
								on:click={resetCode}
								class="btn btn-ghost btn-sm text-surface-500 hover:text-surface-300"
							>
								<RotateCcw size={14} />
								Reset
							</button>
							<button
								on:click={runCode}
								disabled={isRunning}
								class="btn btn-primary btn-sm"
							>
								{#if isRunning}
									<div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
								{:else}
									<Play size={14} />
								{/if}
								Run
							</button>
						</div>
					</div>

					<!-- Code Editor -->
					<div class="flex-1 overflow-hidden">
						<textarea
							bind:value={code}
							class="w-full h-full bg-surface-950 text-surface-200 font-mono text-sm p-4 resize-none focus:outline-none"
							placeholder="Write your code here..."
							spellcheck="false"
						></textarea>
					</div>

					<!-- Output Panel -->
					<div class="h-48 border-t border-surface-800 bg-surface-900 shrink-0">
						<div class="px-4 py-2 border-b border-surface-800 text-xs text-surface-500 uppercase tracking-wide">
							Output
						</div>
						<pre class="p-4 text-sm font-mono overflow-auto h-[calc(100%-32px)] whitespace-pre-wrap
							{output.startsWith('✅') ? 'text-primary-400' : output.startsWith('❌') ? 'text-error-400' : 'text-surface-400'}"
						>{output || 'Click "Run" to see results...'}</pre>
					</div>
				</div>
			</div>

			<!-- Completion Footer -->
			{#if isExerciseComplete(currentExercise)}
				<div class="bg-surface-900 border-t border-surface-800 p-4 shrink-0" transition:slide>
					<div class="max-w-4xl mx-auto flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
								<Trophy size={20} class="text-primary-400" />
							</div>
							<div>
								<h3 class="font-semibold text-primary-400">Exercise Complete!</h3>
								<p class="text-sm text-surface-500">
									{currentExerciseIndex < FREE_EXERCISES_DATA.length - 1 
										? 'Ready for the next challenge?' 
										: 'You\'ve completed all free exercises!'}
								</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							{#if currentExerciseIndex === FREE_EXERCISES_DATA.length - 1}
								<a 
									href="/register" 
									class="btn btn-primary"
									on:click={() => trackSignupClick('try_all_complete_signup')}
								>
									<Sparkles size={16} />
									Get Full Access
								</a>
							{/if}
							<button 
								on:click={nextExercise} 
								class="btn {currentExerciseIndex < FREE_EXERCISES_DATA.length - 1 ? 'btn-primary' : 'btn-secondary'}"
							>
								{currentExerciseIndex < FREE_EXERCISES_DATA.length - 1 ? 'Next Exercise' : 'Back to Overview'}
								<ArrowRight size={16} />
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
