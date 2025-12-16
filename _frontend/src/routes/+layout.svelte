<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { user, isAuthenticated, isLoading } from '$lib/stores/auth';
	import { currentStreak, totalXp, currentLevel } from '$lib/stores/progress';
	import {
		Menu,
		X,
		Home,
		BookOpen,
		Code2,
		BarChart3,
		Trophy,
		Settings,
		LogOut,
		Flame,
		Zap
	} from 'lucide-svelte';

	let mobileMenuOpen = false;

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/learn', label: 'Learn', icon: BookOpen },
		{ href: '/practice', label: 'Practice', icon: Code2 },
		{ href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
		{ href: '/achievements', label: 'Achievements', icon: Trophy }
	];

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>ProgramPrimitives - Master the Physics of Code</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Navigation -->
	<header class="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-lg border-b border-surface-800">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-2">
					<div
						class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center"
					>
						<span class="text-white font-bold text-lg">P</span>
					</div>
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
							<div class="flex items-center gap-1 text-orange-500">
								<Flame size={16} />
								<span>{$currentStreak}</span>
							</div>
							<div class="flex items-center gap-1 text-accent-400">
								<Zap size={16} />
								<span>{$totalXp} XP</span>
							</div>
							<div class="badge badge-primary">Lvl {$currentLevel}</div>
						</div>

						<!-- User Menu -->
						<div class="relative">
							<button class="flex items-center gap-2 p-1 rounded-full hover:bg-surface-800">
								<div
									class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500"
								></div>
							</button>
						</div>
					{:else}
						<a href="/login" class="btn btn-ghost text-sm">Log in</a>
						<a href="/register" class="btn btn-primary text-sm">Get Started</a>
					{/if}

					<!-- Mobile menu button -->
					<button
						class="md:hidden p-2 rounded-lg hover:bg-surface-800"
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
							class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
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
			</nav>
		{/if}
	</header>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="border-t border-surface-800 py-8 mt-auto">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="flex items-center gap-2 text-surface-500 text-sm">
					<span>© 2024 ProgramPrimitives</span>
					<span>·</span>
					<a href="/privacy" class="hover:text-surface-300">Privacy</a>
					<span>·</span>
					<a href="/terms" class="hover:text-surface-300">Terms</a>
				</div>
				<div class="flex items-center gap-4 text-surface-500">
					<a href="https://github.com" class="hover:text-surface-300">GitHub</a>
					<a href="https://twitter.com" class="hover:text-surface-300">Twitter</a>
					<a href="https://discord.com" class="hover:text-surface-300">Discord</a>
				</div>
			</div>
		</div>
	</footer>
</div>

