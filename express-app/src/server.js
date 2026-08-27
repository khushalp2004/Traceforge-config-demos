import { env } from './config/env.js';
import app from './app.js';

const server = app.listen(env.port, () => {
  console.log(`Server is running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Optional: Handle unhandled promise rejections and uncaught exceptions globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});


