require('dotenv').config();
import { buildApp } from './app';
import { env } from './config/env';
import TraceForgeFastify from 'usetraceforge/fastify';

TraceForgeFastify.init({
  apiKey: process.env.TRACEFORGE_API_KEY,
  endpoint: process.env.TRACEFORGE_INGEST_URL, // Optional
});

const startServer = async () => {
  const app = await buildApp();

  // Process-Level Error Handling
  process.on('uncaughtException', (err) => {
    app.log.fatal({ err }, 'Uncaught Exception detected. Shutting down gracefully.');
    TraceForgeFastify.captureException(err);
  // Do NOT instantly process.exit(1). Add a small delay:
    setTimeout(() => process.exit(1), 500);
  });

  process.on('unhandledRejection', (reason, promise) => {
    app.log.error({ reason, promise }, 'Unhandled Rejection detected.');
    // Optional: decided whether to exit here or not based on policy
  });

  process.on('SIGINT', async () => {
    app.log.info('SIGINT signal received. Closing HTTP server...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    app.log.info('SIGTERM signal received. Closing HTTP server...');
    await app.close();
    process.exit(0);
  });

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`Server listening at http://localhost:${env.PORT}`);
    app.log.info(`Swagger docs available at http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
