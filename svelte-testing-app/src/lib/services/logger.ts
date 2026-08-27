import { errorStore } from '../stores/error';

class Logger {
	private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, ...args: unknown[]) {
		const timestamp = new Date().toISOString();
		const logStr = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
		
		if (level === 'error') {
			console.error(logStr, ...args);
			// Automatically track errors in our error store
			errorStore.logError('runtime', message, args[0]);
		} else if (level === 'warn') {
			console.warn(logStr, ...args);
		} else if (level === 'debug') {
			console.debug(logStr, ...args);
		} else {
			console.info(logStr, ...args);
		}
	}

	info(message: string, ...args: unknown[]) {
		this.log('info', message, ...args);
	}

	warn(message: string, ...args: unknown[]) {
		this.log('warn', message, ...args);
	}

	error(message: string, ...args: unknown[]) {
		this.log('error', message, ...args);
	}

	debug(message: string, ...args: unknown[]) {
		this.log('debug', message, ...args);
	}

	setupGlobalErrorHandlers() {
		if (typeof window !== 'undefined') {
			window.onerror = (message, source, lineno, colno, error) => {
				this.error(`Global Error: ${message}`, error);
			};

			window.onunhandledrejection = (event) => {
				this.error(`Unhandled Rejection: ${event.reason}`, event.reason);
				errorStore.logError('async', `Unhandled Rejection: ${event.reason}`, event.reason);
			};
		}
	}
}

export const logger = new Logger();
