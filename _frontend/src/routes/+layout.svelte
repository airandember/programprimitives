<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { user, isAuthenticated } from '$lib/stores/auth';
	import { progress } from '$lib/stores/progress';
	import { getLevelTitle } from '$lib/stores/gamification';
	import {
		Menu,
		X,
		Home,
		BookOpen,
		Code2,
		BarChart3,
		Trophy,
		Flame,
		Zap
	} from 'lucide-svelte';

	// Reactive progress values
	$: currentStreak = $progress.currentDailyStreak;
	$: totalXp = $progress.totalXp;
	$: currentLevel = $progress.currentLevel;

	let mobileMenuOpen = false;

	// Public nav items (always visible)
	const publicNavItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/learn', label: 'Learn', icon: BookOpen },
		{ href: '/practice', label: 'Practice', icon: Code2 },
	];

	// Auth-only nav items (visible when logged in)
	const authNavItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
		{ href: '/achievements', label: 'Achievements', icon: Trophy },
	];

	// Combine nav items based on auth state
	$: navItems = $isAuthenticated 
		? [...publicNavItems, ...authNavItems]
		: publicNavItems;

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>ProgramPrimitives - Master the Tools of Code</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Navigation -->
	<header class="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-lg border-b border-surface-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-3 group">
					<img 
						src="/LOGO_light.webp" 
						alt="ProgramPrimitives" 
						class="h-9 w-auto transition-transform group-hover:scale-105"
					/>
					<span class="font-display font-semibold text-lg hidden sm:block">
						Program<span class="text-gradient">Primitives</span>
					</span>
				</a>

				<!-- Desktop Navigation -->
				<nav class="hidden md:flex items-center gap-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                     {isActive(item.href)
								? 'bg-surface-800 text-primary-400'
								: 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'}"
						>
							<svelte:component this={item.icon} size={18} />
							{item.label}
						</a>
					{/each}
				</nav>

				<!-- User Section -->
				<div class="flex items-center gap-4">
					{#if $isAuthenticated}
						<!-- Stats -->
						<div class="hidden sm:flex items-center gap-4 text-sm">
						<div class="flex items-center gap-1.5 text-orange-500">
							<Flame size={18} class="fill-orange-500/30" />
							<span class="font-semibold">{currentStreak}</span>
						</div>
						<div class="flex items-center gap-1.5 text-accent-400">
							<Zap size={18} class="fill-accent-400/30" />
							<span class="font-semibold">{totalXp}</span>
						</div>
						<div class="badge badge-primary">Lvl {currentLevel}</div>
						</div>

						<!-- User Menu -->
						<div class="relative">
							<button class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-800 transition-colors">
								<div
									class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm"
								>
									{$user?.displayName?.charAt(0).toUpperCase() || 'U'}
								</div>
							</button>
						</div>
					{:else}
						<a href="/login" class="btn btn-ghost text-sm">Log in</a>
						<a href="/register" class="btn btn-primary text-sm">Get Started</a>
					{/if}

					<!-- Mobile menu button -->
					<button
						class="md:hidden p-2 rounded-lg hover:bg-surface-800 transition-colors"
						on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
					>
						{#if mobileMenuOpen}
							<X size={24} />
						{:else}
							<Menu size={24} />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<nav class="md:hidden border-t border-surface-800 bg-surface-950">
				<div class="px-4 py-2 space-y-1">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     {isActive(item.href)
								? 'bg-surface-800 text-primary-400'
								: 'text-surface-400'}"
							on:click={() => (mobileMenuOpen = false)}
						>
							<svelte:component this={item.icon} size={18} />
							{item.label}
						</a>
					{/each}
				</div>

				<!-- Mobile Stats -->
				{#if $isAuthenticated}
					<div class="px-4 py-3 border-t border-surface-800 flex items-center justify-around">
						<div class="text-center">
							<div class="flex items-center justify-center gap-1 text-orange-500">
								<Flame size={16} />
								<span class="font-bold">{currentStreak}</span>
							</div>
							<div class="text-xs text-surface-500">Streak</div>
						</div>
						<div class="text-center">
							<div class="flex items-center justify-center gap-1 text-accent-400">
								<Zap size={16} />
								<span class="font-bold">{totalXp}</span>
							</div>
							<div class="text-xs text-surface-500">XP</div>
						</div>
						<div class="text-center">
							<div class="font-bold text-primary-400">Lvl {currentLevel}</div>
							<div class="text-xs text-surface-500">Level</div>
						</div>
					</div>
				{/if}
			</nav>
		{/if}
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="border-t border-surface-800 py-12 mt-auto bg-surface-950/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
				<!-- Brand -->
				<div class="sm:col-span-2 lg:col-span-1">
					<a href="/" class="flex items-center gap-3 mb-4">
						<img src="/LOGO_light.webp" alt="ProgramPrimitives" class="h-8 w-auto" />
					</a>
					<p class="text-surface-500 text-sm">
						Master the tools of code, not just the vocabulary.
					</p>
				</div>

				<!-- Learn -->
				<div>
					<h4 class="font-semibold mb-4">Learn</h4>
					<ul class="space-y-2 text-sm text-surface-400">
						<li><a href="/learn" class="hover:text-surface-200 transition-colors">All Primitives</a></li>
						<li><a href="/learn?category=fundamentals" class="hover:text-surface-200 transition-colors">Fundamentals</a></li>
						<li><a href="/learn?category=data-structures" class="hover:text-surface-200 transition-colors">Data Structures</a></li>
						<li><a href="/learn?category=advanced" class="hover:text-surface-200 transition-colors">Advanced</a></li>
					</ul>
				</div>

				<!-- Practice -->
				<div>
					<h4 class="font-semibold mb-4">Practice</h4>
					<ul class="space-y-2 text-sm text-surface-400">
						<li><a href="/practice" class="hover:text-surface-200 transition-colors">Exercises</a></li>
						<li><a href="/practice?challenge=daily" class="hover:text-surface-200 transition-colors">Daily Challenge</a></li>
						<li><a href="/achievements" class="hover:text-surface-200 transition-colors">Achievements</a></li>
						<li><a href="/leaderboard" class="hover:text-surface-200 transition-colors">Leaderboard</a></li>
					</ul>
				</div>

				<!-- Company -->
				<div>
					<h4 class="font-semibold mb-4">Company</h4>
					<ul class="space-y-2 text-sm text-surface-400">
						<li><a href="/about" class="hover:text-surface-200 transition-colors">About</a></li>
						<li><a href="/pricing" class="hover:text-surface-200 transition-colors">Pricing</a></li>
						<li><a href="/privacy" class="hover:text-surface-200 transition-colors">Privacy</a></li>
						<li><a href="/terms" class="hover:text-surface-200 transition-colors">Terms</a></li>
					</ul>
				</div>
			</div>

			<div class="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="text-surface-500 text-sm">
					© 2024 ProgramPrimitives. All rights reserved.
				</div>
				<div class="flex items-center gap-6 text-surface-500">
					<a href="https://github.com" class="hover:text-surface-300 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					</a>
					<a href="https://twitter.com" class="hover:text-surface-300 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					</a>
					<a href="https://discord.com" class="hover:text-surface-300 transition-colors">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
