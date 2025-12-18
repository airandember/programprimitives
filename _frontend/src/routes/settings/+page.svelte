<script lang="ts">
	import { 
		User, CreditCard, Bell, Shield, LogOut, 
		Check, Crown, Star, ChevronRight, Calendar, 
		ExternalLink, AlertTriangle
	} from 'lucide-svelte';
	import { user, isAuthenticated, logout } from '$lib/stores/auth';
	import { 
		subscription, 
		currentTier, 
		daysUntilRenewal, 
		TIER_INFO,
	} from '$lib/stores/subscription';

	$: tierInfo = TIER_INFO[$currentTier];

	async function handleLogout() {
		await logout();
		window.location.href = '/';
	}

	async function handleCancelSubscription() {
		if (confirm('Are you sure you want to cancel your subscription? You\'ll keep access until the end of your billing period.')) {
			await subscription.cancel();
		}
	}

	async function handleResumeSubscription() {
		await subscription.resume();
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}
</script>

<svelte:head>
	<title>Settings | ProgramPrimitives</title>
</svelte:head>

<div class="min-h-screen py-12">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-display font-bold mb-8">Settings</h1>

		<!-- Profile Section -->
		<section class="card p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<User size={24} class="text-primary-400" />
				<h2 class="text-xl font-semibold">Profile</h2>
			</div>

			{#if $user}
				<div class="space-y-4">
					<div>
						<label class="block text-sm text-surface-500 mb-1">Email</label>
						<div class="text-surface-200">{$user.email}</div>
					</div>
					<div>
						<label class="block text-sm text-surface-500 mb-1">Display Name</label>
						<div class="text-surface-200">{$user.displayName || 'Not set'}</div>
					</div>
					<div>
						<label class="block text-sm text-surface-500 mb-1">Member Since</label>
						<div class="text-surface-200">{formatDate($user.createdAt)}</div>
					</div>
				</div>
			{:else}
				<p class="text-surface-400">Please log in to view profile settings.</p>
				<a href="/login" class="btn btn-primary mt-4">Log In</a>
			{/if}
		</section>

		<!-- Subscription Section -->
		<section class="card p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<CreditCard size={24} class="text-primary-400" />
				<h2 class="text-xl font-semibold">Subscription</h2>
			</div>

			{#if $subscription.subscription}
				{@const sub = $subscription.subscription}
				
				<!-- Current Plan -->
				<div class="bg-surface-800/50 rounded-xl p-5 mb-6">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							{#if $currentTier === 'pro'}
								<Crown size={28} class="text-accent-400" />
							{:else if $currentTier === 'premium'}
								<Star size={28} class="text-primary-400" />
							{:else}
								<Check size={28} class="text-surface-400" />
							{/if}
							<div>
								<div class="text-lg font-semibold">{tierInfo.name} Plan</div>
								<div class="text-sm text-surface-400">{tierInfo.description}</div>
							</div>
						</div>
						{#if $currentTier !== 'free'}
							<a href="/pricing" class="btn btn-ghost btn-sm">
								Change Plan
							</a>
						{/if}
					</div>

					{#if $currentTier !== 'free'}
						<div class="grid sm:grid-cols-2 gap-4 text-sm">
							<div>
								<span class="text-surface-500">Billing cycle:</span>
								<span class="ml-2 capitalize">{sub.billingCycle}</span>
							</div>
							<div>
								<span class="text-surface-500">Status:</span>
								<span class="ml-2 capitalize
									{sub.status === 'active' ? 'text-primary-400' : 
									 sub.status === 'cancelled' ? 'text-yellow-400' :
									 'text-red-400'}">
									{sub.status}
								</span>
							</div>
							<div>
								<span class="text-surface-500">Current period ends:</span>
								<span class="ml-2">{formatDate(sub.currentPeriodEnd)}</span>
							</div>
							{#if $daysUntilRenewal !== null}
								<div>
									<span class="text-surface-500">Renews in:</span>
									<span class="ml-2">{$daysUntilRenewal} days</span>
								</div>
							{/if}
						</div>

						{#if sub.status === 'cancelled'}
							<div class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
								<div class="flex items-start gap-3">
									<AlertTriangle size={20} class="text-yellow-500 shrink-0 mt-0.5" />
									<div>
										<div class="font-medium text-yellow-400">Subscription Cancelled</div>
										<p class="text-sm text-surface-400 mt-1">
											You'll have access until {formatDate(sub.currentPeriodEnd)}.
										</p>
										<button
											on:click={handleResumeSubscription}
											class="btn btn-primary btn-sm mt-3"
										>
											Resume Subscription
										</button>
									</div>
								</div>
							</div>
						{/if}
					{/if}
				</div>

				<!-- Actions -->
				{#if $currentTier === 'free'}
					<a href="/pricing" class="btn btn-primary w-full justify-center">
						<Star size={18} />
						Upgrade to Premium
						<ChevronRight size={18} />
					</a>
				{:else if sub.status === 'active'}
					<div class="flex gap-3">
						<button class="btn btn-secondary flex-1 justify-center">
							<ExternalLink size={18} />
							Manage Billing
						</button>
						<button 
							on:click={handleCancelSubscription}
							class="btn btn-ghost text-red-400 hover:bg-red-500/10"
						>
							Cancel Plan
						</button>
					</div>
				{/if}
			{/if}
		</section>

		<!-- Notifications Section -->
		<section class="card p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<Bell size={24} class="text-primary-400" />
				<h2 class="text-xl font-semibold">Notifications</h2>
			</div>

			<div class="space-y-4">
				<label class="flex items-center justify-between">
					<div>
						<div class="font-medium">Weekly Progress</div>
						<div class="text-sm text-surface-500">Get a summary of your learning progress</div>
					</div>
					<input type="checkbox" checked class="toggle" />
				</label>
				<label class="flex items-center justify-between">
					<div>
						<div class="font-medium">New Primitives</div>
						<div class="text-sm text-surface-500">Be notified when new content is available</div>
					</div>
					<input type="checkbox" checked class="toggle" />
				</label>
				<label class="flex items-center justify-between">
					<div>
						<div class="font-medium">Streak Reminders</div>
						<div class="text-sm text-surface-500">Don't lose your daily streak</div>
					</div>
					<input type="checkbox" checked class="toggle" />
				</label>
			</div>
		</section>

		<!-- Security Section -->
		<section class="card p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<Shield size={24} class="text-primary-400" />
				<h2 class="text-xl font-semibold">Security</h2>
			</div>

			<div class="space-y-4">
				<button class="btn btn-secondary w-full justify-start">
					Change Password
				</button>
				<button class="btn btn-secondary w-full justify-start">
					Two-Factor Authentication
				</button>
				<button class="btn btn-secondary w-full justify-start">
					Active Sessions
				</button>
			</div>
		</section>

		<!-- Logout -->
		{#if $isAuthenticated}
			<button 
				on:click={handleLogout}
				class="btn btn-ghost text-red-400 hover:bg-red-500/10 w-full justify-center"
			>
				<LogOut size={18} />
				Log Out
			</button>
		{/if}
	</div>
</div>

<style>
	.toggle {
		@apply w-11 h-6 rounded-full bg-surface-700 cursor-pointer relative;
		appearance: none;
		-webkit-appearance: none;
	}
	.toggle::before {
		content: '';
		@apply absolute w-5 h-5 rounded-full bg-surface-400 top-0.5 left-0.5 transition-all;
	}
	.toggle:checked {
		@apply bg-primary-500;
	}
	.toggle:checked::before {
		@apply translate-x-5 bg-white;
	}
</style>

