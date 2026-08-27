import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { api } from '$lib/services/api';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;
	
	try {
		// Demonstrating different scenarios based on ID
		if (id === 'error') {
			throw new Error('Simulated load error');
		}

		if (id === '404') {
			// This will be caught by SvelteKit's error boundary
			error(404, {
				message: 'User not found in system'
			});
		}

		// We can mock an API response for successful loads
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 500));
		
		return {
			user: {
				id,
				name: `Test User ${id}`,
				email: `user${id}@example.com`,
				role: id === '1' ? 'admin' : 'user'
			}
		};
	} catch (e: any) {
		// Log the error using our logger (will show up in console)
		console.error('[Load Error]', e);
		
		if (e.status === 404) {
			throw e;
		}

		// Throwing a generic 500 error that SvelteKit will handle
		error(500, {
			message: 'Failed to load user data: ' + e.message
		});
	}
};
