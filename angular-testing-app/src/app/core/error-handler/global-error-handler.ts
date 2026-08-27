import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../services/logger.service';
import TraceForge from 'usetraceforge';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const logger = this.injector.get(LoggerService);
    
    let message = 'An unknown error occurred';
    let stackTrace = '';

    if (error instanceof HttpErrorResponse) {
      // Http error
      message = `Server returned code ${error.status}, body was: ${error.message}`;
    } else if (error instanceof TypeError) {
      // Type error
      message = `Type Error: ${error.message}`;
      stackTrace = error.stack || '';
    } else if (error instanceof Error) {
      // General Error
      message = error.message;
      stackTrace = error.stack || '';
    } else {
      // Unhandled rejection, RxJS error, etc.
      message = error.toString ? error.toString() : 'Unknown error';
      if (error.rejection) { // Promise rejection
        message = `Unhandled Promise Rejection: ${error.rejection.message || error.rejection}`;
        stackTrace = error.rejection.stack || '';
      }
    }

    logger.error(`[Global Error Handler] ${message}`, stackTrace);
    TraceForge.captureException(error, { tags: { framework: 'angular' } });
  }
}
