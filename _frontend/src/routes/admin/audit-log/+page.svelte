<script lang="ts">
	import { onMount } from 'svelte';
	import { admin } from '$lib/stores/admin';
	import { History, Loader2, FileText, User, BookOpen, Code2 } from 'lucide-svelte';

	onMount(() => {
		admin.loadAuditLog();
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getActionColor(action: string): string {
		switch (action) {
			case 'create': return 'text-green-400';
			case 'update': return 'text-blue-400';
			case 'delete': return 'text-red-400';
			default: return 'text-surface-400';
		}
	}

	function getEntityIcon(entityType: string) {
		switch (entityType) {
			case 'primitive': return BookOpen;
			case 'exercise': return Code2;
			case 'user': return User;
			default: return FileText;
		}
	}
</script>

<div class="p-8">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-display font-bold">Audit Log</h1>
			<p class="text-surface-400">Track all administrative actions</p>
		</div>
	</div>

	{#if $admin.loading && $admin.auditLog.length === 0}
		<div class="flex items-center justify-center py-20">
			<Loader2 size={32} class="animate-spin text-primary-400" />
		</div>
	{:else if $admin.auditLog.length === 0}
		<div class="text-center py-20 text-surface-500">
			<History size={48} class="mx-auto mb-4 opacity-50" />
			<p>No audit log entries yet</p>
		</div>
	{:else}
		<div class="card overflow-hidden">
			<div class="divide-y divide-surface-800">
				{#each $admin.auditLog as log}
					<div class="px-4 py-3 hover:bg-surface-800/30">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center">
									<svelte:component this={getEntityIcon(log.entityType)} size={18} class="text-surface-400" />
								</div>
								<div>
									<div class="flex items-center gap-2">
										<span class="font-medium capitalize {getActionColor(log.action)}">{log.action}</span>
										<span class="text-surface-400">{log.entityType}</span>
										<code class="text-xs bg-surface-800 px-1.5 py-0.5 rounded">{log.entityId}</code>
									</div>
									<div class="text-sm text-surface-500">
										by {log.adminName || 'Unknown'}
									</div>
								</div>
							</div>
							<div class="text-sm text-surface-500">
								{formatDate(log.createdAt)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
