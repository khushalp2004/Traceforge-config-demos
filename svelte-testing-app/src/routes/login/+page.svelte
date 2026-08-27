<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	// Handle the login process
	async function handleLogin() {
		await userStore.loadUser();
		if (!$userStore.error && $userStore.user) {
			// Simulate redirecting to a protected route (which we will map back to root or a profile)
			goto('/');
		}
	}

	function handleLogout() {
		userStore.logout();
	}
</script>

<div class="login-page">
	<div class="card login-card">
		<div class="login-header">
			<div class="logo-icon">⚡</div>
			<h1>Svelte Error Lab</h1>
			<p class="text-muted">Sign in to test auth state management.</p>
		</div>

		{#if $userStore.user}
			<div class="auth-success">
				<div class="success-icon">✓</div>
				<h3>You are logged in!</h3>
				<p class="text-muted text-sm mt-2">Welcome, {$userStore.user.name}</p>
				<button class="btn btn-danger mt-4" onclick={handleLogout}>Log out</button>
			</div>
		{:else}
			<form class="login-form" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" class="input" placeholder="test@svelte.dev" disabled={$userStore.loading} value="tester@svelte.dev" />
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password" class="input" placeholder="••••••••" disabled={$userStore.loading} value="password123" />
				</div>

				{#if $userStore.error}
					<div class="error-msg">
						{$userStore.error}
					</div>
				{/if}

				<button type="submit" class="btn btn-primary login-btn" disabled={$userStore.loading}>
					{#if $userStore.loading}
						<span class="spinner"></span> Logging in...
					{:else}
						Sign In
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 70vh;
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		padding: 2.5rem 2rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo-icon {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	.login-header h1 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.input {
		padding: 0.75rem 1rem;
		border: 1px solid var(--border-color);
		background-color: var(--bg-primary);
		color: var(--text-primary);
		border-radius: var(--radius-md);
		font-family: inherit;
		transition: border-color 0.2s;
	}

	.input:focus {
		outline: none;
		border-color: var(--accent-primary);
	}

	.input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.login-btn {
		margin-top: 1rem;
		padding: 0.875rem;
		font-size: 1rem;
	}

	.login-btn:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.error-msg {
		background-color: rgba(239, 68, 68, 0.1);
		color: var(--error-primary);
		padding: 0.75rem;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		border: 1px solid rgba(239, 68, 68, 0.2);
	}

	.auth-success {
		text-align: center;
		padding: 2rem 0;
	}

	.success-icon {
		width: 64px;
		height: 64px;
		background-color: rgba(34, 197, 94, 0.1);
		color: var(--success-primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		margin: 0 auto 1.5rem;
	}

	.spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: white;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.mt-2 { margin-top: 0.5rem; }
	.mt-4 { margin-top: 1.5rem; }
	.text-sm { font-size: 0.875rem; }
</style>
