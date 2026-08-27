import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const startTime = Date.now();

  logger.info(`[HTTP Request Started] ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        // Here we could check for specific HttpResponse events if needed
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          logger.error(`[HTTP API Error] ${req.method} ${req.url} failed with status: ${error.status}`, error);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Re-throw so the GlobalErrorHandler or local subscriber can also catch it
      return throwError(() => error);
    }),
    finalize(() => {
      const elapsed = Date.now() - startTime;
      logger.info(`[HTTP Request Completed] ${req.method} ${req.url} took ${elapsed}ms`);
    })
  );
};
