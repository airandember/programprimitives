<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		BarChart3, 
		TrendingUp, 
		TrendingDown, 
		Eye, 
		MousePointer, 
		X as XIcon, 
		Target,
		ArrowUpRight,
		RefreshCw,
		Calendar
	} from 'lucide-svelte';

	interface FunnelSummary {
		views: number;
		clicks: number;
		dismisses: number;
		conversions: number;
		clickRate: number;
		convRate: number;
	}

	interface DailyStats {
		date: string;
		funnelName: string;
		touchpoint: string;
		views: number;
		clicks: number;
		dismisses: number;
		conversions: number;
		clickRate: number;
		convRate: number;
	}

	let loading = true;
	let error = '';
	let summary: Record<string, FunnelSummary> = {};
	let daily: DailyStats[] = [];
	let daysBack = 30;
	let selectedFunnel = 'all';

	const funnelColors: Record<string, string> = {
		'try_signup': 'bg-blue-500',
		'limit_reached': 'bg-amber-500',
		'lesson_gate': 'bg-purple-500',
		'premium_exercise': 'bg-emerald-500',
		'header_cta': 'bg-rose-500',
		'pricing_page': 'bg-cyan-500',
	};

	const funnelLabels: Record<string, string> = {
		'try_signup': 'Try → Signup',
		'limit_reached': 'Limit Reached',
		'lesson_gate': 'Lesson Gate',
		'premium_exercise': 'Premium Exercise',
		'header_cta': 'Header CTA',
		'pricing_page': 'Pricing Page',
	};

	async function loadStats() {
		loading = true;
		error = '';
		
		try {
			const res = await fetch(`/api/admin/funnel/stats?days=${daysBack}`);
			if (!res.ok) throw new Error('Failed to load stats');
			
			const data = await res.json();
			summary = data.data?.summary || data.summary || {};
			daily = data.data?.daily || data.daily || [];
		} catch (e) {
			error = 'Failed to load funnel analytics';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(loadStats);

	// Filter daily by selected funnel
	$: filteredDaily = selectedFunnel === 'all' 
		? daily 
		: daily.filter(d => d.funnelName === selectedFunnel);

	// Group daily by date for chart
	$: dailyByDate = filteredDaily.reduce((acc, d) => {
		if (!acc[d.date]) {
			acc[d.date] = { views: 0, clicks: 0, conversions: 0 };
		}
		acc[d.date].views += d.views;
		acc[d.date].clicks += d.clicks;
		acc[d.date].conversions += d.conversions;
		return acc;
	}, {} as Record<string, { views: number; clicks: number; conversions: number }>);

	// Calculate totals
	$: totals = Object.values(summary).reduce(
		(acc, s) => ({
			views: acc.views + s.views,
			clicks: acc.clicks + s.clicks,
			dismisses: acc.dismisses + s.dismisses,
			conversions: acc.conversions + s.conversions,
		}),
		{ views: 0, clicks: 0, dismisses: 0, conversions: 0 }
	);

	$: overallClickRate = totals.views > 0 ? (totals.clicks / totals.views * 100).toFixed(1) : '0.0';
	$: overallConvRate = totals.views > 0 ? (totals.conversions / totals.views * 100).toFixed(1) : '0.0';

	function formatNumber(n: number): string {
		if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
		if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
		return n.toString();
	}
</script>

<svelte:head>
	<title>Funnel Analytics | Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Funnel Analytics</h1>
			<p class="text-surface-400">Track conversion rates across your sales funnels</p>
		</div>
		<div class="flex items-center gap-3">
			<!-- Period selector -->
			<div class="flex items-center gap-2 bg-surface-800 rounded-lg p-1">
				{#each [7, 14, 30, 90] as days}
					<button 
						on:click={() => { daysBack = days; loadStats(); }}
						class="px-3 py-1.5 rounded-md text-sm transition-colors
							{daysBack === days ? 'bg-primary-500 text-white' : 'text-surface-400 hover:text-white'}"
					>
						{days}d
					</button>
				{/each}
			</div>
			<button on:click={loadStats} class="btn btn-ghost p-2" title="Refresh">
				<RefreshCw size={18} class={loading ? 'animate-spin' : ''} />
			</button>
		</div>
	</div>

	{#if error}
		<div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
			{error}
		</div>
	{/if}

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
		</div>
	{:else}
		<!-- Overview Cards -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="card p-6">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
						<Eye size={20} class="text-blue-400" />
					</div>
					<span class="text-surface-400 text-sm">Total Views</span>
				</div>
				<div class="text-3xl font-bold">{formatNumber(totals.views)}</div>
				<p class="text-sm text-surface-500 mt-1">Funnel impressions</p>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
						<MousePointer size={20} class="text-emerald-400" />
					</div>
					<span class="text-surface-400 text-sm">Clicks</span>
				</div>
				<div class="text-3xl font-bold">{formatNumber(totals.clicks)}</div>
				<p class="text-sm text-surface-500 mt-1">{overallClickRate}% click rate</p>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
						<XIcon size={20} class="text-amber-400" />
					</div>
					<span class="text-surface-400 text-sm">Dismisses</span>
				</div>
				<div class="text-3xl font-bold">{formatNumber(totals.dismisses)}</div>
				<p class="text-sm text-surface-500 mt-1">Closed prompts</p>
			</div>

			<div class="card p-6">
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
						<Target size={20} class="text-primary-400" />
					</div>
					<span class="text-surface-400 text-sm">Conversions</span>
				</div>
				<div class="text-3xl font-bold">{formatNumber(totals.conversions)}</div>
				<p class="text-sm text-primary-400 mt-1 flex items-center gap-1">
					{overallConvRate}% conversion rate
					{#if parseFloat(overallConvRate) > 0}
						<ArrowUpRight size={14} />
					{/if}
				</p>
			</div>
		</div>

		<!-- Funnel Breakdown -->
		<div class="card p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-semibold">Funnel Performance</h2>
				<select 
					bind:value={selectedFunnel}
					class="input py-1.5 text-sm"
				>
					<option value="all">All Funnels</option>
					{#each Object.keys(summary) as funnel}
						<option value={funnel}>{funnelLabels[funnel] || funnel}</option>
					{/each}
				</select>
			</div>

			{#if Object.keys(summary).length === 0}
				<div class="text-center py-12 text-surface-500">
					<BarChart3 size={48} class="mx-auto mb-4 opacity-50" />
					<p>No funnel data yet. Events will appear here as users interact with upgrade prompts.</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each Object.entries(summary) as [funnel, stats]}
						<div class="p-4 bg-surface-800/50 rounded-lg">
							<div class="flex items-center justify-between mb-3">
								<div class="flex items-center gap-3">
									<div class="w-3 h-3 rounded-full {funnelColors[funnel] || 'bg-surface-500'}"></div>
									<span class="font-medium">{funnelLabels[funnel] || funnel}</span>
								</div>
								<div class="flex items-center gap-4 text-sm">
									<span class="text-surface-400">
										{stats.conversions} / {stats.views} conversions
									</span>
									<span class="font-semibold text-primary-400">
										{stats.convRate.toFixed(1)}%
									</span>
								</div>
							</div>

							<!-- Progress bar -->
							<div class="h-2 bg-surface-700 rounded-full overflow-hidden">
								<div class="h-full flex">
									<div 
										class="bg-primary-500 transition-all" 
										style="width: {stats.convRate}%"
									></div>
									<div 
										class="bg-emerald-500/50 transition-all" 
										style="width: {stats.clickRate - stats.convRate}%"
									></div>
								</div>
							</div>

							<div class="flex items-center gap-6 mt-3 text-xs text-surface-500">
								<span><Eye size={12} class="inline mr-1" />{stats.views} views</span>
								<span><MousePointer size={12} class="inline mr-1" />{stats.clicks} clicks ({stats.clickRate.toFixed(1)}%)</span>
								<span><XIcon size={12} class="inline mr-1" />{stats.dismisses} dismissed</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Daily Breakdown Table -->
		{#if filteredDaily.length > 0}
			<div class="card p-6">
				<h2 class="text-lg font-semibold mb-4">Daily Breakdown</h2>
				<div class="overflow-x-auto">
					<table class="w-full text-sm">
						<thead>
							<tr class="text-left text-surface-500 border-b border-surface-800">
								<th class="pb-3 font-medium">Date</th>
								<th class="pb-3 font-medium">Funnel</th>
								<th class="pb-3 font-medium">Touchpoint</th>
								<th class="pb-3 font-medium text-right">Views</th>
								<th class="pb-3 font-medium text-right">Clicks</th>
								<th class="pb-3 font-medium text-right">Conv.</th>
								<th class="pb-3 font-medium text-right">Rate</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-surface-800">
							{#each filteredDaily.slice(0, 50) as row}
								<tr class="hover:bg-surface-800/50">
									<td class="py-3">{row.date}</td>
									<td class="py-3">
										<span class="inline-flex items-center gap-2">
											<span class="w-2 h-2 rounded-full {funnelColors[row.funnelName] || 'bg-surface-500'}"></span>
											{funnelLabels[row.funnelName] || row.funnelName}
										</span>
									</td>
									<td class="py-3 text-surface-400">{row.touchpoint}</td>
									<td class="py-3 text-right">{row.views}</td>
									<td class="py-3 text-right">{row.clicks}</td>
									<td class="py-3 text-right">{row.conversions}</td>
									<td class="py-3 text-right font-medium text-primary-400">
										{row.convRate.toFixed(1)}%
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if filteredDaily.length > 50}
					<p class="text-sm text-surface-500 mt-4 text-center">
						Showing first 50 of {filteredDaily.length} records
					</p>
				{/if}
			</div>
		{/if}

		<!-- Tips Section -->
		<div class="card p-6 bg-gradient-to-br from-primary-500/5 to-transparent border-primary-500/20">
			<h3 class="font-semibold mb-3 flex items-center gap-2">
				<TrendingUp size={18} class="text-primary-400" />
				Optimization Tips
			</h3>
			<ul class="space-y-2 text-sm text-surface-400">
				<li>• <strong class="text-surface-200">High views, low clicks:</strong> Improve CTA copy or button visibility</li>
				<li>• <strong class="text-surface-200">High dismisses:</strong> Prompt timing may be too aggressive - consider delay or triggers</li>
				<li>• <strong class="text-surface-200">Low conversion:</strong> Review signup flow friction, consider offering more value upfront</li>
				<li>• <strong class="text-surface-200">Best performers:</strong> Replicate successful funnel designs across other touchpoints</li>
			</ul>
		</div>
	{/if}
</div>
