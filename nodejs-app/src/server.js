import http from 'http';
import { router } from './router.js';
import { logger } from './utils/logger.js';
import { config } from './config/env.js';

import TraceForge from "usetraceforge";

TraceForge.init({ 
  apiKey: process.env.TRACEFORGE_API_KEY, 
  endpoint: process.env.TRACEFORGE_INGEST_URL,
  autoCapture: true // This automatically catches ALL fatal Node crashes!
});

process.on('uncaughtException', async(err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message, stack: err.stack });
  await TraceForge.captureException(err);
  process.exit(1);
});

process.on('unhandledRejection', async(err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.message, stack: err.stack });
  await TraceForge.captureException(err);
  server.close(() => {
    process.exit(1);
  });
});

const server = http.createServer((req, res) => {
  router(req, res);
});

const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
