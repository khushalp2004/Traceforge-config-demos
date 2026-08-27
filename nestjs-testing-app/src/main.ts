import * as dotenv from 'dotenv';
dotenv.config(); // Ensure this is at the VERY TOP to load API keys!

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import TraceForgeNest from 'usetraceforge/nestjs';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const logger = app.get(WINSTON_MODULE_PROVIDER);

  TraceForgeNest.init({
    apiKey: process.env.TRACEFORGE_API_KEY as string,
    endpoint: process.env.TRACEFORGE_INGEST_URL, // Optional
    autoCapture: true
  });


  // Process-Level Error Handling
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err.stack, 'Process');
    TraceForgeNest.captureException(err, { tags: { framework: 'nestjs' } } as any);
    // In a real app, you might want to process.exit(1) here
    setTimeout(() => process.exit(1), 500);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`, '', 'Process');
    TraceForgeNest.captureException(reason, { tags: { framework: 'nestjs' } } as any);
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

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new TimingInterceptor(logger)
  );

  // Global Filters
  app.useGlobalFilters(new GlobalExceptionFilter(logger));


  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Testing App')
    .setDescription('The NestJS Error & Performance Laboratory API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.info(`Application is running on: ${await app.getUrl()}`, { context: 'Bootstrap' });
}
bootstrap();
