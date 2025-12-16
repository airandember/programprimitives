<script lang="ts">
	import { ArrowRight, Code2, Globe, Trophy, Zap, CheckCircle, BookOpen } from 'lucide-svelte';

	const features = [
		{
			icon: Code2,
			title: 'Tool-First Learning',
			description:
				'Learn the universal primitives of programming - loops, conditionals, functions - before diving into syntax.'
		},
		{
			icon: Globe,
			title: 'Any Language',
			description:
				'Apply your knowledge to Python, JavaScript, Go, C++, and more. One concept, many implementations.'
		},
		{
			icon: Zap,
			title: 'Interactive Practice',
			description:
				'Write real code in our secure sandbox. Get instant feedback and learn from your mistakes.'
		},
		{
			icon: Trophy,
			title: 'Track Progress',
			description:
				'Build streaks, earn badges, and watch your mastery grow. Gamified learning that sticks.'
		}
	];

	const primitiveCategories = [
		{ name: 'Fundamentals', count: 12, color: 'primary' },
		{ name: 'Data Structures', count: 8, color: 'accent' },
		{ name: 'Functions', count: 10, color: 'primary' },
		{ name: 'Advanced', count: 6, color: 'accent' }
	];

	const testimonials = [
		{
			quote: "Finally, a platform that teaches HOW to think, not just what to type.",
			author: 'Sarah K.',
			role: 'Junior Developer'
		},
		{
			quote: "Switching from Python to Go was easy because I already knew the primitives.",
			author: 'Marcus R.',
			role: 'Full Stack Engineer'
		},
		{
			quote: 'The gamification keeps me coming back. 47 day streak and counting!',
			author: 'Alex T.',
			role: 'CS Student'
		}
	];
</script>

<div class="relative overflow-hidden">
	<!-- Hero Section -->
	<section class="relative py-20 sm:py-32">
		<!-- Background gradient -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"
		></div>
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[128px]"
		></div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center max-w-4xl mx-auto">
				<!-- Badge -->
				<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-800/50 border border-surface-700 mb-8">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
					</span>
					<span class="text-sm text-surface-300">Now in beta — join 2,000+ learners</span>
				</div>

				<!-- Headline -->
				<h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
					Master the
					<span class="text-gradient">Physics of Code</span>
				</h1>

				<p class="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10">
					Stop memorizing syntax. Learn the universal tools of programming that work in
					<em>any</em> language. Loops, conditionals, functions — the building blocks of everything.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
					<a href="/register" class="btn btn-primary text-lg px-8 py-3">
						Start Learning Free
						<ArrowRight size={20} />
					</a>
					<a href="/learn" class="btn btn-secondary text-lg px-8 py-3">
						<BookOpen size={20} />
						Explore Primitives
					</a>
				</div>

				<!-- Social proof -->
				<div class="flex items-center justify-center gap-8 mt-12 text-surface-500 text-sm">
					<div class="flex items-center gap-2">
						<CheckCircle size={16} class="text-primary-500" />
						<span>No credit card required</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle size={16} class="text-primary-500" />
						<span>7 languages supported</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle size={16} class="text-primary-500" />
						<span>100+ exercises</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Grid -->
	<section class="py-20 bg-surface-900/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl font-display font-bold mb-4">
					Why ProgramPrimitives?
				</h2>
				<p class="text-surface-400 max-w-2xl mx-auto">
					Traditional coding education focuses on syntax. We focus on concepts that transfer
					across every language you'll ever learn.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each features as feature, i}
					<div
						class="card p-6 animate-fade-in"
						style="animation-delay: {i * 100}ms"
					>
						<div
							class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4"
						>
							<svelte:component this={feature.icon} size={24} class="text-primary-400" />
						</div>
						<h3 class="font-semibold text-lg mb-2">{feature.title}</h3>
						<p class="text-surface-400 text-sm">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Primitive Categories Preview -->
	<section class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-2 gap-12 items-center">
				<div>
					<h2 class="text-3xl sm:text-4xl font-display font-bold mb-6">
						36 Primitives Across 4 Categories
					</h2>
					<p class="text-surface-400 mb-8">
						From basic loops to advanced concurrency patterns. Each primitive is explained,
						demonstrated, and practiced in the language of your choice.
					</p>

					<div class="space-y-4">
						{#each primitiveCategories as category}
							<div class="card-hover p-4">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div
											class="w-10 h-10 rounded-lg bg-{category.color}-500/20 flex items-center justify-center"
										>
											<Code2 size={20} class="text-{category.color}-400" />
										</div>
										<span class="font-medium">{category.name}</span>
									</div>
									<span class="text-surface-500">{category.count} primitives</span>
								</div>
							</div>
						{/each}
					</div>

					<a href="/learn" class="btn btn-primary mt-8">
						Browse All Primitives
						<ArrowRight size={18} />
					</a>
				</div>

				<!-- Code Preview -->
				<div class="relative">
					<div class="code-block text-sm">
						<div class="flex items-center gap-2 mb-4 pb-4 border-b border-surface-800">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="ml-2 text-surface-500">for-loop.js</span>
						</div>
						<pre class="text-surface-300"><span class="text-purple-400">// The For Loop Primitive</span>
<span class="text-blue-400">for</span> (<span class="text-orange-400">let</span> i = <span class="text-green-400">0</span>; i &lt; <span class="text-green-400">5</span>; i++) {'{'} 
  console.<span class="text-yellow-400">log</span>(<span class="text-green-400">`Iteration ${'{'}i{'}'}`</span>);
{'}'}

<span class="text-purple-400">// Same concept in Python:</span>
<span class="text-blue-400">for</span> i <span class="text-blue-400">in</span> <span class="text-yellow-400">range</span>(<span class="text-green-400">5</span>):
    <span class="text-yellow-400">print</span>(<span class="text-green-400">f"Iteration {'{'}i{'}'}"</span>)</pre>
					</div>

					<!-- Floating badge -->
					<div
						class="absolute -top-4 -right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg shadow-primary-500/25"
					>
						Same concept, different syntax
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="py-20 bg-surface-900/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl font-display font-bold mb-4">
					Loved by Developers
				</h2>
			</div>

			<div class="grid md:grid-cols-3 gap-6">
				{#each testimonials as testimonial, i}
					<div
						class="card p-6 animate-slide-up"
						style="animation-delay: {i * 150}ms"
					>
						<p class="text-surface-300 mb-4 italic">"{testimonial.quote}"</p>
						<div class="flex items-center gap-3">
							<div
								class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500"
							></div>
							<div>
								<div class="font-medium">{testimonial.author}</div>
								<div class="text-surface-500 text-sm">{testimonial.role}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h2 class="text-3xl sm:text-4xl font-display font-bold mb-6">
				Ready to Master the Fundamentals?
			</h2>
			<p class="text-surface-400 text-lg mb-8">
				Join thousands of developers who are building a rock-solid foundation. Start free, upgrade
				when you're ready.
			</p>
			<a href="/register" class="btn btn-primary text-lg px-8 py-3">
				Get Started — It's Free
				<ArrowRight size={20} />
			</a>
		</div>
	</section>
</div>

