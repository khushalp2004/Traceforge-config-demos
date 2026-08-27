<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { errorStore } from '$lib/stores/error';

	// 1. Null Reference Error
	function triggerNullReference() {
		const user: any = null;
		console.log(user.name);
	}

	// 2. Undefined Access
	function triggerUndefinedAccess() {
		const profile: any = undefined;
		console.log(profile.address.city);
	}

	// 3. JSON Parse Error
	function triggerJSONParse() {
		JSON.parse('{bad json}');
	}

	// 4. Async Failure
	async function triggerAsyncFailure() {
		await Promise.reject(new Error('Async operation failed'));
	}

	// 5. API 404 Error
	async function triggerAPI404() {
		const res = await fetch('/api/not-found');
		if (!res.ok) {
			const err = new Error(`HTTP Error ${res.status}: ${res.statusText}`);
			errorStore.logError('api', err.message);
			throw err;
		}
	}

	// 6. Network Error
	async function triggerNetworkError() {
		try {
			await fetch('https://invalid-api-domain-123.com');
		} catch (e: any) {
			errorStore.logError('api', 'Network Error');
			throw e;
		}
	}

	// 7. Environment Variable Error
	function triggerEnvError() {
		try {
			// @ts-ignore
			const url = env.PUBLIC_API_URL;
			if (!url) {
				throw new Error('Configuration Error: PUBLIC_API_URL is missing');
			}
		} catch (e: any) {
			errorStore.logError('runtime', e.message);
			throw e;
		}
	}

	// 8. Reactive Infinite Loop (simulation)
	let counter = 0;
	function triggerInfiniteLoop() {
		try {
			// In Svelte 5, runes catch infinite loops during derivation/effects
			// We simulate it by manually causing a stack overflow
			const recurse = (): void => recurse();
			recurse();
		} catch (e: any) {
			errorStore.logError('runtime', 'Maximum call stack size exceeded (Infinite Loop)');
			throw e;
		}
	}

	// 9. Store Update Loop
	function triggerStoreLoop() {
		try {
			errorStore.subscribe(() => {
				// This would normally cause an infinite loop, but we artificially throw to avoid crashing the browser completely
				throw new Error('Store Update Loop detected');
			});
			errorStore.logError('store', 'Initial update');
		} catch (e: any) {
			errorStore.logError('store', e.message);
		}
	}

	// Helper for cards
	const scenarios = [
		{ name: 'Null Reference Error', desc: 'Attempt to read properties of null.', trigger: triggerNullReference, expected: "TypeError: Cannot read properties of null (reading 'name')" },
		{ name: 'Undefined Access', desc: 'Attempt to read deep properties of undefined.', trigger: triggerUndefinedAccess, expected: "TypeError: Cannot read properties of undefined (reading 'address')" },
		{ name: 'JSON Parse Error', desc: 'Parse invalid JSON string.', trigger: triggerJSONParse, expected: 'SyntaxError: Unexpected token' },
		{ name: 'Async Failure', desc: 'Unhandled promise rejection.', trigger: triggerAsyncFailure, expected: 'Error: Async operation failed' },
		{ name: 'API 404 Error', desc: 'Fetch non-existent endpoint.', trigger: triggerAPI404, expected: 'HTTP Error 404: Not Found' },
		{ name: 'Network Error', desc: 'Fetch invalid domain.', trigger: triggerNetworkError, expected: 'Network Error' },
		{ name: 'Env Variable Error', desc: 'Access missing env var.', trigger: triggerEnvError, expected: 'Configuration Error' },
		{ name: 'Reactive Infinite Loop', desc: 'State update causing an infinite loop.', trigger: triggerInfiniteLoop, expected: 'Maximum call stack size exceeded' },
		{ name: 'Store Update Loop', desc: 'Store updating itself on subscribe.', trigger: triggerStoreLoop, expected: 'Store Update Loop detected' },
	];
</script>

<div class="error-lab">
	<header class="header">
		<h1>Error Lab</h1>
		<p class="text-muted">Trigger common frontend issues to observe how they are caught and logged.</p>
	</header>

	<div class="grid grid-cols-2">
		{#each scenarios as { name, desc, trigger, expected }}
			<div class="card scenario-card">
				<h3>{name}</h3>
				<p class="desc">{desc}</p>
				<div class="expected">
					<strong>Expected Error:</strong>
					<code>{expected}</code>
				</div>
				<button class="btn btn-danger" onclick={trigger}>Trigger Error</button>
			</div>
		{/each}
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

	.scenario-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.desc {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.expected {
		background-color: var(--bg-primary);
		padding: 0.75rem;
		border-radius: var(--radius-md);
		font-size: 0.85rem;
	}

	.expected strong {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--text-muted);
	}

	.expected code {
		color: var(--error-primary);
		font-family: monospace;
	}
</style>
