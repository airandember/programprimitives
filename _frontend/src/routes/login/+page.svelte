<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isAuthenticated } from '$lib/stores/auth';
	import LoginForm from '@braids/auth/frontend/components/LoginForm.svelte';
	
	// Redirect if already logged in
	$: if ($isAuthenticated) {
		const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
		goto(redirect);
	}
	
	function handleSuccess() {
		const redirect = $page.url.searchParams.get('redirect') || '/dashboard';
		goto(redirect);
	}
</script>

<svelte:head>
	<title>Sign In | ProgramPrimitives</title>
</svelte:head>

<main class="auth-page">
	<div class="auth-container">
		<a href="/" class="logo-link">
			<img src="/LOGO_light.webp" alt="ProgramPrimitives" class="logo" />
		</a>
		
		<LoginForm 
			on:success={handleSuccess}
			on:switchToRegister={() => goto('/register')}
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

