<script lang="ts">
	import { ArrowRight, Code2, Globe, Trophy, Zap, CheckCircle, BookOpen, Play } from 'lucide-svelte';

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
		{ name: 'Fundamentals', count: 12, color: 'from-primary-500 to-primary-600', icon: '🎯' },
		{ name: 'Data Structures', count: 8, color: 'from-accent-500 to-accent-600', icon: '📊' },
		{ name: 'Functions', count: 10, color: 'from-purple-500 to-purple-600', icon: '⚡' },
		{ name: 'Advanced', count: 6, color: 'from-orange-500 to-orange-600', icon: '🚀' }
	];

	const testimonials = [
		{
			quote: "Finally, a platform that teaches HOW to think, not just what to type.",
			author: 'Sarah K.',
			role: 'Junior Developer',
			avatar: 'S'
		},
		{
			quote: "Switching from Python to Go was easy because I already knew the primitives.",
			author: 'Marcus R.',
			role: 'Full Stack Engineer',
			avatar: 'M'
		},
		{
			quote: 'The gamification keeps me coming back. 47 day streak and counting!',
			author: 'Alex T.',
			role: 'CS Student',
			avatar: 'A'
		}
	];

	const languages = [
		{ name: 'JavaScript', icon: '🟨' },
		{ name: 'Python', icon: '🐍' },
		{ name: 'Go', icon: '🔵' },
		{ name: 'TypeScript', icon: '🔷' },
		{ name: 'C++', icon: '⚙️' }
	];
</script>

<div class="relative overflow-hidden">
	<!-- Hero Section -->
	<section class="relative py-24 sm:py-32 lg:py-40">
		<!-- Background effects -->
		<div class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"></div>
		<div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary-500/20 via-accent-500/10 to-transparent rounded-full blur-[120px]"></div>
		<div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px]"></div>
		
		<!-- Grid pattern overlay -->
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0iIzMzNCIgZmlsbC1vcGFjaXR5PSIuMyIvPjwvZz48L3N2Zz4=')] opacity-40"></div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center max-w-4xl mx-auto">
				<!-- Logo showcase -->
				<div class="flex justify-center mb-8">
					<img 
						src="/LOGO_light.webp" 
						alt="ProgramPrimitives" 
						class="h-20 sm:h-24 w-auto animate-fade-in"
					/>
				</div>

				<!-- Badge -->
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/60 border border-surface-700/50 backdrop-blur-sm mb-8 animate-fade-in">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
					</span>
					<span class="text-sm text-surface-300">Now in beta — join 2,000+ learners</span>
				</div>

				<!-- Headline -->
				<h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-fade-in">
					Master the
					<span class="text-gradient block sm:inline">Tools of Code</span>
				</h1>

				<p class="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-fade-in stagger-1">
					Stop memorizing syntax. Learn the universal tools of programming that work in
					<em class="text-surface-300">any</em> language. Loops, conditionals, functions — the building blocks of everything.
				</p>

				<!-- Language pills -->
				<div class="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in stagger-2">
					{#each languages as lang}
						<span class="px-3 py-1.5 rounded-full bg-surface-800/50 border border-surface-700/50 text-sm text-surface-300 flex items-center gap-1.5">
							<span>{lang.icon}</span>
							{lang.name}
						</span>
					{/each}
					<span class="px-3 py-1.5 rounded-full bg-surface-800/50 border border-surface-700/50 text-sm text-surface-400">
						+3 more
					</span>
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
					<a href="/register" class="btn btn-primary text-lg px-8 py-3.5 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow">
						Start Learning Free
						<ArrowRight size={20} />
					</a>
					<a href="/learn" class="btn btn-secondary text-lg px-8 py-3.5">
						<BookOpen size={20} />
						Explore Primitives
					</a>
				</div>

				<!-- Social proof -->
				<div class="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 text-surface-500 text-sm animate-fade-in stagger-4">
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
	<section class="py-24 bg-surface-900/50 relative">
		<div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent"></div>
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
					Why ProgramPrimitives?
				</h2>
				<p class="text-surface-400 text-lg max-w-2xl mx-auto">
					Traditional coding education focuses on syntax. We focus on concepts that transfer
					across every language you'll ever learn.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each features as feature, i}
					<div
						class="card p-6 hover:border-primary-500/30 transition-all duration-300 group"
						style="animation-delay: {i * 100}ms"
					>
						<div
							class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
						>
							<svelte:component this={feature.icon} size={28} class="text-primary-400" />
						</div>
						<h3 class="font-semibold text-xl mb-3">{feature.title}</h3>
						<p class="text-surface-400 leading-relaxed">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Primitive Categories Preview -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid lg:grid-cols-2 gap-16 items-center">
				<div>
					<h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
						36 Primitives Across 4 Categories
					</h2>
					<p class="text-surface-400 text-lg mb-8">
						From basic loops to advanced concurrency patterns. Each primitive is explained,
						demonstrated, and practiced in the language of your choice.
					</p>

					<div class="space-y-4">
						{#each primitiveCategories as category}
							<div class="card-hover p-4 group">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-4">
										<div
											class="w-12 h-12 rounded-xl bg-gradient-to-br {category.color} flex items-center justify-center text-xl shadow-lg"
										>
											{category.icon}
										</div>
										<div>
											<span class="font-semibold text-lg">{category.name}</span>
											<div class="text-surface-500 text-sm">{category.count} primitives</div>
										</div>
									</div>
									<ArrowRight size={20} class="text-surface-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
								</div>
							</div>
						{/each}
					</div>

					<a href="/learn" class="btn btn-primary mt-8 inline-flex">
						Browse All Primitives
						<ArrowRight size={18} />
					</a>
				</div>

				<!-- Code Preview -->
				<div class="relative">
					<!-- Glow effect -->
					<div class="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-3xl blur-xl opacity-50"></div>
					
					<div class="relative card overflow-hidden">
						<div class="flex items-center gap-2 px-4 py-3 border-b border-surface-800 bg-surface-900/50">
							<div class="w-3 h-3 rounded-full bg-red-500"></div>
							<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div class="w-3 h-3 rounded-full bg-green-500"></div>
							<span class="ml-3 text-surface-500 text-sm font-mono">for-loop.js</span>
						</div>
						<div class="p-6 bg-surface-950 font-mono text-sm leading-relaxed">
							<pre class="text-surface-300"><span class="text-surface-500">// The For Loop Primitive</span>
<span class="text-purple-400">for</span> (<span class="text-blue-400">let</span> i = <span class="text-green-400">0</span>; i &lt; <span class="text-green-400">5</span>; i++) {'{'} 
  console.<span class="text-yellow-400">log</span>(<span class="text-green-400">`Iteration ${'{'}i{'}'}`</span>);
{'}'}

<span class="text-surface-500">// Same concept in Python:</span>
<span class="text-purple-400">for</span> i <span class="text-purple-400">in</span> <span class="text-yellow-400">range</span>(<span class="text-green-400">5</span>):
    <span class="text-yellow-400">print</span>(<span class="text-green-400">f"Iteration {'{'}i{'}'}"</span>)</pre>
						</div>
					</div>

					<!-- Floating badge -->
					<div
						class="absolute -top-3 -right-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl shadow-primary-500/25"
					>
						✨ Same concept, different syntax
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Interactive Demo Teaser -->
	<section class="py-24 bg-surface-900/50">
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="card overflow-hidden">
				<div class="p-8 sm:p-12 text-center">
					<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/25">
						<Play size={36} class="text-white ml-1" />
					</div>
					<h2 class="text-2xl sm:text-3xl font-display font-bold mb-4">
						Try It Now — No Account Needed
					</h2>
					<p class="text-surface-400 max-w-xl mx-auto mb-8">
						Write your first for loop in under 2 minutes. Our interactive editor lets you learn by doing.
					</p>
					<a href="/practice/for-loop/ex-001" class="btn btn-primary text-lg px-8 py-3">
						<Play size={20} />
						Start Coding
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Testimonials -->
	<section class="py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
					Loved by Developers
				</h2>
				<p class="text-surface-400 text-lg">From beginners to seniors, everyone's leveling up.</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6">
				{#each testimonials as testimonial, i}
					<div
						class="card p-8"
						style="animation-delay: {i * 150}ms"
					>
						<p class="text-surface-300 text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
						<div class="flex items-center gap-4">
							<div
								class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold"
							>
								{testimonial.avatar}
							</div>
							<div>
								<div class="font-semibold">{testimonial.author}</div>
								<div class="text-surface-500 text-sm">{testimonial.role}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-24 relative overflow-hidden">
		<!-- Background -->
		<div class="absolute inset-0 bg-gradient-to-b from-surface-900 via-primary-500/10 to-surface-900"></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-full blur-[100px]"></div>
		
		<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<img src="/LOGO_light.webp" alt="ProgramPrimitives" class="h-16 w-auto mx-auto mb-8 opacity-80" />
			<h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
				Ready to Master the Fundamentals?
			</h2>
			<p class="text-surface-400 text-lg mb-10 max-w-2xl mx-auto">
				Join thousands of developers who are building a rock-solid foundation. Start free, upgrade
				when you're ready.
			</p>
			<a href="/register" class="btn btn-primary text-lg px-10 py-4 shadow-xl shadow-primary-500/25">
				Get Started — It's Free
				<ArrowRight size={20} />
			</a>
		</div>
	</section>
</div>
