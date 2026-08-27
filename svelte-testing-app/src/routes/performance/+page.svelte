<script lang="ts">
	import { onDestroy } from 'svelte';
	import { errorStore } from '$lib/stores/error';
	import { browser } from '$app/environment';

	// 1. Memory Leak (setInterval)
	let leakyInterval: number;
	let fixedInterval: number;
	let leakCount = $state(0);
	let fixedCount = $state(0);

	function startLeakyInterval() {
		// No cleanup, leaks on navigation
		leakyInterval = setInterval(() => {
			leakCount++;
			if (leakCount > 100) errorStore.logError('memory', 'Interval leak simulated');
		}, 100) as unknown as number;
	}

	function startFixedInterval() {
		fixedInterval = setInterval(() => {
			fixedCount++;
		}, 100) as unknown as number;
	}

	onDestroy(() => {
		if (fixedInterval) {
			clearInterval(fixedInterval);
		}
	});

	// 2. Large List Rendering
	let items = $state<string[]>([]);
	let renderTime = $state(0);

	function renderLargeList() {
		const start = performance.now();
		items = Array.from({ length: 15000 }, (_, i) => `Item ${i + 1} - ${Math.random().toString(36).substr(2, 9)}`);
		setTimeout(() => {
			renderTime = Math.round(performance.now() - start);
		}, 0);
	}

	function clearList() {
		items = [];
		renderTime = 0;
	}

	// 3. Expensive Computation
	let computeInput = $state(0);
	let computationTime = $state(0);

	function performHeavyCalculation(n: number) {
		const start = performance.now();
		let result = 0;
		// Artificial heavy calculation
		for (let i = 0; i < n * 1000000; i++) {
			result += Math.sqrt(i);
		}
		computationTime = Math.round(performance.now() - start);
		return result;
	}

	// Svelte 5 derived - computes when input changes
	let expensiveResult = $derived(performHeavyCalculation(computeInput));

	// 4. SSR Hydration Mismatch
	let randomValue = browser ? 'Client Only' : Math.random().toString();
	
	function triggerHydrationWarning() {
		// Simulated by rendering browser-only APIs in SSR
		errorStore.logError('ssr', 'Hydration mismatch warning usually caught by Svelte compiler/runtime logs');
	}
</script>

<div class="perf-lab">
	<header class="header">
		<h1>Performance Lab</h1>
		<p class="text-muted">Simulate and measure performance bottlenecks and memory leaks.</p>
	</header>

	<div class="grid grid-cols-2">
		<!-- Memory Leaks -->
		<div class="card perf-card">
			<h3>Memory Leak (Interval)</h3>
			<p class="desc">Start an interval without cleanup vs with cleanup.</p>
			
			<div class="demo-box">
				<div class="counters">
					<div>Leaky: <strong>{leakCount}</strong></div>
					<div>Fixed: <strong>{fixedCount}</strong></div>
				</div>
				<div class="actions mt-2">
					<button class="btn btn-danger btn-sm" onclick={startLeakyInterval}>Start Leaky</button>
					<button class="btn btn-primary btn-sm" onclick={startFixedInterval}>Start Fixed</button>
				</div>
			</div>
		</div>

		<!-- Expensive Computation -->
		<div class="card perf-card">
			<h3>Expensive Computation</h3>
			<p class="desc">A reactive statement triggering a heavy loop.</p>
			
			<div class="demo-box">
				<label>
					Input multiplier: {computeInput}
					<input type="range" min="0" max="100" bind:value={computeInput} />
				</label>
				<div class="result mt-2">
					<div>Result: {expensiveResult.toExponential(2)}</div>
					<div class="text-warning">Time: {computationTime}ms</div>
				</div>
			</div>
		</div>

		<!-- SSR Hydration -->
		<div class="card perf-card">
			<h3>SSR Hydration Issue</h3>
			<p class="desc">Simulating browser/server mismatch.</p>
			
			<div class="demo-box">
				<div>Server/Client Value: <strong>{randomValue}</strong></div>
				<button class="btn btn-danger btn-sm mt-2" onclick={triggerHydrationWarning}>
					Trigger Hydration Log
				</button>
			</div>
		</div>

		<!-- Large List -->
		<div class="card perf-card" style="grid-column: 1 / -1;">
			<h3>Large DOM Rendering</h3>
			<p class="desc">Render 15,000 items at once.</p>
			
			<div class="actions">
				<button class="btn btn-danger btn-sm" onclick={renderLargeList}>Render List</button>
				<button class="btn btn-primary btn-sm" onclick={clearList}>Clear List</button>
				{#if renderTime > 0}
					<span class="text-warning ml-2">Rendered in ~{renderTime}ms</span>
				{/if}
			</div>

			{#if items.length > 0}
				<div class="list-container mt-2">
					{#each items as item}
						<div class="list-item">{item}</div>
					{/each}
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

	.desc {
		color: var(--text-secondary);
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.demo-box {
		background-color: var(--bg-primary);
		padding: 1rem;
		border-radius: var(--radius-md);
	}

	.counters {
		display: flex;
		gap: 2rem;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.list-container {
		height: 300px;
		overflow-y: auto;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
	}

	.list-item {
		padding: 0.25rem 0.5rem;
		border-bottom: 1px solid var(--border-color);
		font-size: 0.85rem;
	}

	.ml-2 { margin-left: 0.5rem; }
	.mt-2 { margin-top: 0.5rem; }
	.btn-sm { padding: 0.25rem 0.75rem; font-size: 0.85rem; }
</style>
