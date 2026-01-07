<script lang="ts">
	import { page } from '$app/stores';
	import { isAuthenticated, user } from '$lib/stores/auth';
	import { isAdmin } from '$lib/stores/admin';
	import { 
		LayoutDashboard, BookOpen, Code2, Users, FileText, 
		Settings, ChevronLeft, Shield, History, GraduationCap
	} from 'lucide-svelte';

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/primitives', label: 'Primitives', icon: BookOpen },
		{ href: '/admin/lessons', label: 'Lessons', icon: GraduationCap },
		{ href: '/admin/exercises', label: 'Exercises', icon: Code2 },
		{ href: '/admin/users', label: 'Users', icon: Users },
		{ href: '/admin/audit-log', label: 'Audit Log', icon: History },
	];

	// Reactive path for navigation highlighting and keying
	$: currentPath = $page.url.pathname;

	function isActive(href: string): boolean {
		if (href === '/admin') return currentPath === '/admin';
		return currentPath.startsWith(href);
	}
</script>

<svelte:head>
	<title>Admin | ProgramPrimitives</title>
</svelte:head>

{#if !$isAuthenticated}
	<div class="min-h-screen flex flex-col items-center justify-center text-center p-4">
		<Shield size={64} class="text-surface-600 mb-6" />
		<h1 class="text-4xl font-display font-bold mb-4">Admin Access Required</h1>
		<p class="text-surface-400 mb-8 max-w-md">
			Please log in with an admin account to access this area.
		</p>
		<a href="/login" class="btn btn-primary btn-lg">Log In</a>
	</div>
{:else if !$isAdmin}
	<div class="min-h-screen flex flex-col items-center justify-center text-center p-4">
		<Shield size={64} class="text-red-500 mb-6" />
		<h1 class="text-4xl font-display font-bold mb-4">Access Denied</h1>
		<p class="text-surface-400 mb-8 max-w-md">
			You don't have permission to access the admin area.
			<br />
			Contact an administrator if you believe this is an error.
		</p>
		<a href="/" class="btn btn-secondary">
			<ChevronLeft size={18} />
			Back to Home
		</a>
	</div>
{:else}
	<div class="min-h-screen flex">
		<!-- Sidebar -->
		<aside class="w-64 bg-surface-900 border-r border-surface-800 flex flex-col">
			<!-- Header -->
			<div class="p-4 border-b border-surface-800">
				<a href="/" class="flex items-center gap-2 text-surface-400 hover:text-surface-200 text-sm mb-3">
					<ChevronLeft size={16} />
					Back to Site
				</a>
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
						<Shield size={20} class="text-white" />
					</div>
					<div>
						<div class="font-semibold">Admin Panel</div>
						<div class="text-xs text-surface-500">{$user?.email}</div>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
							{isActive(item.href)
								? 'bg-primary-500/20 text-primary-400'
								: 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'}"
					>
						<svelte:component this={item.icon} size={18} />
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Footer -->
			<div class="p-4 border-t border-surface-800 text-xs text-surface-500">
				<a href="/settings" class="flex items-center gap-2 hover:text-surface-300">
					<Settings size={14} />
					Settings
				</a>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 overflow-auto bg-surface-950">
			{#key currentPath}
				<slot />
			{/key}
		</main>
	</div>
{/if}
