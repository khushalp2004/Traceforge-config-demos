"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const timing_interceptor_1 = require("./common/interceptors/timing.interceptor");
const nestjs_1 = __importDefault(require("usetraceforge/nestjs"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(nest_winston_1.WINSTON_MODULE_PROVIDER);
    nestjs_1.default.init({
        apiKey: process.env.TRACEFORGE_API_KEY,
        endpoint: process.env.TRACEFORGE_INGEST_URL,
        autoCapture: true
    });
    process.on('uncaughtException', (err) => {
        logger.error(`Uncaught Exception: ${err.message}`, err.stack, 'Process');
        nestjs_1.default.captureException(err, { tags: { framework: 'nestjs' } });
        setTimeout(() => process.exit(1), 500);
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`, '', 'Process');
        nestjs_1.default.captureException(reason, { tags: { framework: 'nestjs' } });
        setTimeout(() => process.exit(1), 500);
    });
    process.on('SIGINT', async () => {
        logger.warn('SIGINT signal received: closing HTTP server', 'Process');
        await app.close();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        logger.warn('SIGTERM signal received: closing HTTP server', 'Process');
        await app.close();
        process.exit(0);
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(logger), new timing_interceptor_1.TimingInterceptor(logger));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter(logger));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJS Testing App')
        .setDescription('The NestJS Error & Performance Laboratory API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.info(`Application is running on: ${await app.getUrl()}`, { context: 'Bootstrap' });
}
bootstrap();
//# sourceMappingURL=main.js.map