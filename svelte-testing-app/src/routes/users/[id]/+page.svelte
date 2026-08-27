<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// Svelte 5 derivation
	let user = $derived(data.user);

	let inputId = $state(data.user?.id || '1');

	function navigateToUser() {
		goto(`/users/${inputId}`);
	}
</script>

<div class="user-page">
	<header class="header">
		<h1>User Profile API</h1>
		<p class="text-muted">Demonstrates data loading, routing, and error states.</p>
	</header>

	<div class="navigation-card card mb-4">
		<h3>Test Different Scenarios</h3>
		<p class="text-sm text-muted mb-2">Try entering '404' or 'error' to test SvelteKit's error handling boundaries.</p>
		
		<div class="search-box">
			<input 
				type="text" 
				bind:value={inputId} 
				placeholder="User ID (e.g. 1, 404, error)"
				class="input"
			/>
			<button class="btn btn-primary" onclick={navigateToUser}>Load User</button>
		</div>
	</div>

	{#if user}
		<div class="card profile-card">
			<div class="profile-header">
				<div class="avatar">{user.name.charAt(0)}</div>
				<div class="profile-info">
					<h2>{user.name}</h2>
					<p class="text-muted">{user.email}</p>
				</div>
			</div>
			
			<div class="details-grid mt-4">
				<div class="detail-item">
					<span class="label">User ID</span>
					<span class="value">{user.id}</span>
				</div>
				<div class="detail-item">
					<span class="label">Role</span>
					<span class="value role-badge {user.role}">{user.role}</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.mb-4 { margin-bottom: 2rem; }
	.mb-2 { margin-bottom: 1rem; }
	.mt-4 { margin-top: 1.5rem; }
	.text-sm { font-size: 0.85rem; }

	.search-box {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.input {
		flex: 1;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border-color);
		background-color: var(--bg-primary);
		color: var(--text-primary);
		border-radius: var(--radius-md);
		font-family: inherit;
	}

	.input:focus {
		outline: none;
		border-color: var(--accent-primary);
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.avatar {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: var(--accent-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.details-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		border-top: 1px solid var(--border-color);
		padding-top: 1.5rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.value {
		font-weight: 500;
	}

	.role-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		width: max-content;
	}

	.role-badge.admin {
		background-color: var(--error-secondary);
		color: #fca5a5;
	}

	.role-badge.user {
		background-color: #1e3a8a;
		color: #93c5fd;
	}
</style>
