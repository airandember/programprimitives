<script lang="ts">
	import { onMount } from 'svelte';
	import { admin } from '$lib/stores/admin';
	import { 
		Users, BookOpen, Code2, CheckCircle, 
		TrendingUp, Activity, Crown, Loader2 
	} from 'lucide-svelte';

	onMount(() => {
		admin.loadStats();
		admin.loadAuditLog();
	});

	$: stats = $admin.stats;
	$: recentActivity = $admin.auditLog.slice(0, 10);
</script>

<div class="p-8">
	<div class="mb-8">
		<h1 class="text-3xl font-display font-bold">Admin Dashboard</h1>
		<p class="text-surface-400">Manage your educational content and users</p>
	</div>

	{#if $admin.loading}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={32} class="animate-spin text-primary-400" />
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			<div class="card p-5 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
						<Users size={24} class="text-blue-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-blue-400">{stats.totalUsers}</div>
						<div class="text-sm text-surface-500">Total Users</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
						<BookOpen size={24} class="text-primary-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-primary-400">{stats.totalPrimitives}</div>
						<div class="text-sm text-surface-500">Primitives</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-accent-500/10 to-transparent border-accent-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
						<Code2 size={24} class="text-accent-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-accent-400">{stats.totalExercises}</div>
						<div class="text-sm text-surface-500">Exercises</div>
					</div>
				</div>
			</div>

			<div class="card p-5 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30">
				<div class="flex items-center gap-3">
					<div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
						<CheckCircle size={24} class="text-green-400" />
					</div>
					<div>
						<div class="text-3xl font-bold text-green-400">{stats.totalCompletions}</div>
						<div class="text-sm text-surface-500">Completions</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Secondary Stats -->
		<div class="grid lg:grid-cols-3 gap-6 mb-8">
			<!-- Active Users -->
			<div class="card p-6">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<Activity size={18} class="text-primary-400" />
					Active Users
				</h3>
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-surface-400">Today</span>
						<span class="font-bold text-lg">{stats.activeUsersToday}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-surface-400">This Week</span>
						<span class="font-bold text-lg">{stats.activeUsersWeek}</span>
					</div>
				</div>
			</div>

			<!-- New Users -->
			<div class="card p-6">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<TrendingUp size={18} class="text-green-400" />
					New Signups
				</h3>
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-surface-400">Today</span>
						<span class="font-bold text-lg text-green-400">+{stats.newUsersToday}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-surface-400">This Week</span>
						<span class="font-bold text-lg text-green-400">+{stats.newUsersWeek}</span>
					</div>
				</div>
			</div>

			<!-- Premium -->
			<div class="card p-6">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<Crown size={18} class="text-yellow-400" />
					Premium Subscribers
				</h3>
				<div class="text-center py-3">
					<div class="text-4xl font-bold text-yellow-400">{stats.premiumSubscribers}</div>
					<div class="text-surface-500 text-sm mt-1">
						{stats.totalUsers > 0 ? Math.round((stats.premiumSubscribers / stats.totalUsers) * 100) : 0}% of users
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions & Recent Activity -->
		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Quick Actions -->
			<div class="card p-6">
				<h3 class="font-semibold mb-4">Quick Actions</h3>
				<div class="grid grid-cols-2 gap-3">
					<a href="/admin/primitives?new=true" class="btn btn-secondary justify-center">
						<BookOpen size={18} />
						Add Primitive
					</a>
					<a href="/admin/exercises?new=true" class="btn btn-secondary justify-center">
						<Code2 size={18} />
						Add Exercise
					</a>
					<a href="/admin/primitives" class="btn btn-ghost justify-center">
						View All Primitives
					</a>
					<a href="/admin/exercises" class="btn btn-ghost justify-center">
						View All Exercises
					</a>
				</div>
			</div>

			<!-- Recent Activity -->
			<div class="card p-6">
				<h3 class="font-semibold mb-4">Recent Admin Activity</h3>
				{#if recentActivity.length === 0}
					<p class="text-surface-500 text-sm">No recent activity</p>
				{:else}
					<div class="space-y-2 max-h-48 overflow-auto">
						{#each recentActivity as log}
							<div class="flex items-center justify-between text-sm py-1.5 border-b border-surface-800 last:border-0">
								<div>
									<span class="font-medium capitalize">{log.action}</span>
									<span class="text-surface-500">{log.entityType}</span>
									<span class="text-primary-400">{log.entityId}</span>
								</div>
								<div class="text-surface-500 text-xs">
									{new Date(log.createdAt).toLocaleDateString()}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
