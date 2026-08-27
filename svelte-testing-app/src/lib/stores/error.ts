import { writable } from 'svelte/store';

export type ErrorType = 'runtime' | 'api' | 'ssr' | 'store' | 'async' | 'memory' | 'performance' | 'auth';

export interface AppError {
	id: string;
	type: ErrorType;
	message: string;
	timestamp: number;
	stack?: string;
	details?: unknown;
}

function createErrorStore() {
	const { subscribe, set, update } = writable<AppError[]>([]);

	return {
		subscribe,
		logError: (type: ErrorType, message: string, error?: unknown) => {
			const appError: AppError = {
				id: Math.random().toString(36).substring(2, 9),
				type,
				message,
				timestamp: Date.now(),
				stack: error instanceof Error ? error.stack : undefined,
				details: error
			};

			update((errors) => [appError, ...errors]);
		},
		clear: () => set([])
	};
}

export const errorStore = createErrorStore();
