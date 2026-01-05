<script lang="ts">
	import { onMount } from 'svelte';
	import { admin } from '$lib/stores/admin';
	import { 
		Users, Shield, Crown, Search, Loader2, Mail, Calendar
	} from 'lucide-svelte';

	let searchQuery = '';

	onMount(() => {
		admin.loadUsers();
	});

	async function toggleAdmin(user: any) {
		const newRole = user.role === 'admin' ? 'user' : 'admin';
		if (confirm(`Are you sure you want to ${newRole === 'admin' ? 'grant admin access to' : 'remove admin access from'} ${user.email}?`)) {
			await admin.updateUserRole(user.id, newRole);
		}
	}

	$: filteredUsers = $admin.users.filter(u => 
		u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
		u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function formatDate(dateString: string): string {
		if (!dateString) return 'Never';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="p-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-display font-bold">Users</h1>
			<p class="text-surface-400">Manage user accounts and roles</p>
		</div>
		<div class="flex items-center gap-4">
			<div class="badge badge-secondary">
				{$admin.users.length} total users
			</div>
		</div>
	</div>

	<!-- Search -->
	<div class="relative mb-6">
		<Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search by email or name..."
			class="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
		/>
	</div>

	{#if $admin.loading && $admin.users.length === 0}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={32} class="animate-spin text-primary-400" />
		</div>
	{:else if filteredUsers.length === 0}
		<div class="text-center py-20 text-surface-500">
			<Users size={48} class="mx-auto mb-4 opacity-50" />
			<p>No users found</p>
		</div>
	{:else}
		<!-- Users Table -->
		<div class="card overflow-hidden">
			<table class="w-full">
				<thead class="bg-surface-800/50">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">User</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Role</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Subscription</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Joined</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-surface-400">Last Login</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-surface-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-800">
					{#each filteredUsers as user}
						<tr class="hover:bg-surface-800/30">
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
										{user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
									</div>
									<div>
										<div class="font-medium">{user.displayName || 'No name'}</div>
										<div class="text-sm text-surface-500 flex items-center gap-1">
											<Mail size={12} />
											{user.email}
										</div>
									</div>
								</div>
							</td>
							<td class="px-4 py-3">
								{#if user.role === 'admin'}
									<span class="badge bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1 w-fit">
										<Shield size={12} />
										Admin
									</span>
								{:else}
									<span class="badge badge-secondary">User</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if user.subscriptionTier === 'pro'}
									<span class="badge bg-accent-500/20 text-accent-400 border-accent-500/30 flex items-center gap-1 w-fit">
										<Crown size={12} />
										Pro
									</span>
								{:else if user.subscriptionTier === 'premium'}
									<span class="badge bg-primary-500/20 text-primary-400 border-primary-500/30 flex items-center gap-1 w-fit">
										<Crown size={12} />
										Premium
									</span>
								{:else}
									<span class="badge badge-secondary">Free</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-surface-400 text-sm">
								<div class="flex items-center gap-1">
									<Calendar size={12} />
									{formatDate(user.createdAt)}
								</div>
							</td>
							<td class="px-4 py-3 text-surface-400 text-sm">
								{formatDate(user.lastLoginAt)}
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-end">
									<button
										on:click={() => toggleAdmin(user)}
										class="btn btn-ghost btn-sm {user.role === 'admin' ? 'text-red-400 hover:bg-red-500/10' : 'text-primary-400 hover:bg-primary-500/10'}"
										title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
									>
										<Shield size={16} />
										{user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
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
