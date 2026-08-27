"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const nestjs_1 = __importDefault(require("usetraceforge/nestjs"));
const winston_1 = require("winston");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        nestjs_1.default.captureException(exception, {
            tags: { framework: 'nestjs' },
            payload: { url: request.url, method: request.method }
        }).catch(() => { });
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorResponse = {};
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message || exceptionResponse;
            errorResponse = exceptionResponse;
        }
        else if (exception instanceof Error) {
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
        this.logger.error(`[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(responseBody)}`, exception instanceof Error ? exception.stack : 'No stack trace', 'GlobalExceptionFilter');
        response.status(status).json(responseBody);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger])
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map