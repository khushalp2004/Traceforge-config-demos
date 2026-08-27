import type { HandleClientError } from '@sveltejs/kit';
import TraceForgeSvelte from 'usetraceforge/svelte';

TraceForgeSvelte.init({
  apiKey: import.meta.env.VITE_TRACEFORGE_API_KEY,
  endpoint: import.meta.env.VITE_TRACEFORGE_INGEST_URL, // Optional
  autoCapture: true
});
export const handleError: HandleClientError = ({ error, event, status, message }) => {
	console.error('[Client Error Hook]', {
		url: event.url.href,
		status,
		message,
		error
	});

	TraceForgeSvelte.handleError(error, event);
	
	return {
		message: 'An unexpected client error occurred.',
		code: status.toString()
	};
};