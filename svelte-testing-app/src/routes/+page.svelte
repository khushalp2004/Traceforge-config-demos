<script lang="ts">
	import { errorStore } from '$lib/stores/error';
	import { browser } from '$app/environment';
	import { VERSION } from 'svelte/compiler';

	// Svelte 5 derived state
	let runtimeErrors = $derived($errorStore.filter((e) => e.type === 'runtime').length);
	let apiErrors = $derived($errorStore.filter((e) => e.type === 'api').length);
	let asyncErrors = $derived($errorStore.filter((e) => e.type === 'async').length);
</script>

<div class="dashboard">
	<header class="header">
		<h1>Dashboard</h1>
		<p class="text-muted">Welcome to the SvelteKit Error Lab.</p>
	</header>

	<div class="grid grid-cols-2">
		<div class="card env-info">
			<h2>Environment</h2>
			<div class="info-list">
				<div class="info-item">
					<span>Svelte Version</span>
					<span class="value">{VERSION}</span>
				</div>
				<div class="info-item">
					<span>Environment</span>
					<span class="value">{browser ? 'Client (Browser)' : 'Server (SSR)'}</span>
				</div>
				<div class="info-item">
					<span>API Status</span>
					<span class="value text-success">Mocking Active</span>
				</div>
			</div>
		</div>

		<div class="card error-stats">
			<h2>Error Statistics</h2>
			<div class="stat-grid">
				<div class="stat-box">
					<span class="stat-label">Runtime Errors</span>
					<span class="stat-value text-error">{runtimeErrors}</span>
				</div>
				<div class="stat-box">
					<span class="stat-label">API Failures</span>
					<span class="stat-value text-warning">{apiErrors}</span>
				</div>
				<div class="stat-box">
					<span class="stat-label">Async Errors</span>
					<span class="stat-value text-error">{asyncErrors}</span>
				</div>
				<div class="stat-box">
					<span class="stat-label">Total Caught</span>
					<span class="stat-value">{$errorStore.length}</span>
				</div>
			</div>
			
			{#if $errorStore.length > 0}
				<div class="recent-errors">
					<h3>Recent Errors</h3>
					<ul class="error-list">
						{#each $errorStore.slice(0, 3) as error}
							<li class="error-item">
								<span class="error-type {error.type}">{error.type}</span>
								<span class="error-msg">{error.message}</span>
							</li>
						{/each}
					</ul>
					<button class="btn btn-primary btn-sm mt-2" onclick={() => errorStore.clear()}>Clear Logs</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.info-list {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.info-item .value {
		font-weight: 600;
	}

	.stat-grid {
		margin-top: 1.5rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-box {
		background-color: var(--bg-secondary);
		padding: 1rem;
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.recent-errors {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.recent-errors h3 {
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	.error-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.error-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		background-color: var(--bg-secondary);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md);
	}

	.error-type {
		text-transform: uppercase;
		font-size: 0.65rem;
		font-weight: 700;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		background-color: var(--bg-primary);
	}

	.error-type.runtime, .error-type.async { color: var(--error-primary); }
	.error-type.api { color: var(--warning-primary); }

	.error-msg {
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mt-2 { margin-top: 1rem; }
	.btn-sm { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
</style>
