<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Computed equivalent in Svelte 5 using runes
	let currentPath = $derived(page.url.pathname);
</script>

<div class="app-container">
	<nav class="navbar">
		<div class="nav-content container">
			<a href="/" class="brand">
				<span class="logo">⚡</span> Svelte Error Lab
			</a>
			
			<div class="nav-links">
				<a href="/" class="nav-link" class:active={currentPath === '/'}>Dashboard</a>
				<a href="/error-lab" class="nav-link" class:active={currentPath === '/error-lab'}>Error Lab</a>
				<a href="/performance" class="nav-link" class:active={currentPath === '/performance'}>Performance</a>
				<a href="/users/1" class="nav-link" class:active={currentPath.startsWith('/users/')}>Users API</a>
				<a href="/login" class="nav-link" class:active={currentPath === '/login'}>Login</a>
			</div>
		</div>
	</nav>

	<main class="main-content container">
		{@render children()}
	</main>
</div>

<style>
	.app-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background-color: var(--bg-secondary);
		border-bottom: 1px solid var(--border-color);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 4rem;
	}

	.brand {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.logo {
		font-size: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
	}

	.nav-link {
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.95rem;
		padding: 0.5rem 0;
		border-bottom: 2px solid transparent;
	}

	.nav-link:hover {
		color: var(--text-primary);
	}

	.nav-link.active {
		color: var(--accent-primary);
		border-bottom-color: var(--accent-primary);
	}

	.main-content {
		flex: 1;
		padding-top: 2rem;
		padding-bottom: 4rem;
	}
</style>
