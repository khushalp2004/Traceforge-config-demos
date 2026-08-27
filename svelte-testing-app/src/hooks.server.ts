import type { Handle, HandleServerError } from '@sveltejs/kit';
import TraceForgeSvelte from 'usetraceforge/svelte';

TraceForgeSvelte.init({
  apiKey: import.meta.env.VITE_TRACEFORGE_API_KEY,
  endpoint: import.meta.env.VITE_TRACEFORGE_INGEST_URL, // Optional
  autoCapture: true
});

export const handle: Handle = async ({ event, resolve }) => {
	// Simple request logging for demonstration
	const start = performance.now();
	const response = await resolve(event);
	const end = performance.now();
	
	const time = Math.round(end - start);
	console.info(`[SERVER] ${event.request.method} ${event.url.pathname} - ${response.status} (${time}ms)`);
	
	return response;
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	console.error('[SSR Error Hook]', {
		url: event.url.href,
		status,
		message,
		error
	});

	TraceForgeSvelte.handleError(error, event);

	return {
		message: 'An unexpected server error occurred.',
		code: status.toString()
	};
};
