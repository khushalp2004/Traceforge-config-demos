import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger } from 'winston';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: Logger);
    catch(exception: unknown, host: ArgumentsHost): void;
}
