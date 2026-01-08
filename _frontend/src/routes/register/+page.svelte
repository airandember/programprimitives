<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isAuthenticated } from '$lib/stores/auth';
	import { RegisterForm } from '$lib/components/auth';
	import { funnelTracking, trackConversion } from '@braids/free-zone/frontend/stores/funnel-tracking';
	
	// Track where user came from
	let referrer = '';
	
	onMount(() => {
		referrer = document.referrer || '';
		
		// Track signup page view
		funnelTracking.track({
			eventType: 'view',
			funnelName: 'try_signup',
			touchpoint: 'signup_start',
			metadata: { referrer },
		});
	});
	
	// Redirect if already logged in
	$: if ($isAuthenticated) {
		const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
		goto(redirect);
	}
	
	function handleSuccess() {
		// Track successful signup conversion
		trackConversion('signup');
		
		const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
		goto(redirect);
	}
</script>

<svelte:head>
	<title>Create Account | ProgramPrimitives</title>
</svelte:head>

<main class="auth-page">
	<div class="auth-container">
		<a href="/" class="logo-link">
			<img src="/LOGO_light.webp" alt="ProgramPrimitives" class="logo" />
		</a>
		
		<RegisterForm 
			on:success={handleSuccess}
			on:switchToLogin={() => goto('/login')}
		/>
	</div>
</main>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
	}
	
	.auth-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}
	
	.logo-link {
		display: block;
	}
	
	.logo {
		height: 48px;
		width: auto;
	}
</style>

