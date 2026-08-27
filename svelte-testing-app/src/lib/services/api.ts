import { logger } from './logger';
import { errorStore } from '../stores/error';

interface FetchOptions extends RequestInit {
	timeout?: number;
}

export class ApiService {
	private async request<T>(url: string, options: FetchOptions = {}): Promise<T> {
		const { timeout = 8000, ...fetchOptions } = options;
		
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);
		
		try {
			logger.info(`[API] Req: ${fetchOptions.method || 'GET'} ${url}`);
			const response = await fetch(url, {
				...fetchOptions,
				signal: controller.signal,
			});
			
			clearTimeout(id);

			if (!response.ok) {
				const errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
				logger.error(`[API] Res Error: ${errorMsg}`);
				errorStore.logError('api', errorMsg, { status: response.status, url });
				throw new Error(errorMsg);
			}

			const data = await response.json();
			logger.debug(`[API] Res Success: ${url}`, data);
			return data;
		} catch (error) {
			clearTimeout(id);
			if (error instanceof Error && error.name === 'AbortError') {
				logger.error(`[API] Timeout Error: ${url}`);
				errorStore.logError('api', `Request timeout for ${url}`);
				throw new Error('Request timeout');
			}
			
			logger.error(`[API] Network Error: ${url}`, error);
			// We only want to log network errors if it wasn't already caught as HTTP error above
			if (!(error instanceof Error && error.message.startsWith('HTTP Error'))) {
				errorStore.logError('api', `Network request failed for ${url}`);
			}
			throw error;
		}
	}

	get<T>(url: string, options?: FetchOptions) {
		return this.request<T>(url, { ...options, method: 'GET' });
	}

	post<T>(url: string, body: unknown, options?: FetchOptions) {
		return this.request<T>(url, {
			...options,
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...options?.headers },
			body: JSON.stringify(body),
		});
	}

	put<T>(url: string, body: unknown, options?: FetchOptions) {
		return this.request<T>(url, {
			...options,
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', ...options?.headers },
			body: JSON.stringify(body),
		});
	}

	delete<T>(url: string, options?: FetchOptions) {
		return this.request<T>(url, { ...options, method: 'DELETE' });
	}
}

export const api = new ApiService();
