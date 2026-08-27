import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import TraceForgeNest from 'usetraceforge/nestjs';

import { Logger } from 'winston';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    TraceForgeNest.captureException(exception, {
      tags: { framework: 'nestjs' },
      payload: { url: request.url, method: request.method }
    }).catch(() => {});
    

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let errorResponse: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exceptionResponse;
      errorResponse = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorResponse = { 
        name: exception.name, 
        message: exception.message,
        stack: process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
      };
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: errorResponse,
    };

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(responseBody)}`,
      exception instanceof Error ? exception.stack : 'No stack trace',
      'GlobalExceptionFilter',
    );


    response.status(status).json(responseBody);
  }
}
