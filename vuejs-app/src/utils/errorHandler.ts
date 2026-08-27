import { logger } from './logger';

export const setupGlobalErrorHandling = (app: any) => {
  // Vue Component Error Handler
  app.config.errorHandler = (err: any, _instance: any, info: string) => {
    logger.error('Vue Component Error Caught!', { err, info });
  };

  // Unhandled Runtime Errors
  window.onerror = (message, source, lineno, colno, error) => {
    logger.error('Global Runtime Error Caught!', { message, source, lineno, colno, error });
    return false; // Let default browser error handling happen too (or return true to suppress)
  };

  // Unhandled Promise Rejections
  window.onunhandledrejection = (event) => {
    logger.error('Unhandled Promise Rejection Caught!', { reason: event.reason });
  };
};
