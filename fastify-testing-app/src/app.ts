import Fastify from 'fastify';
import { env } from './config/env';
import { AppError } from './utils/AppError';


import databasePlugin from './plugins/database';
import jwtPlugin from './plugins/jwt';
import swaggerPlugin from './plugins/swagger';

import { healthRoutes } from './routes/health.route';
import { authRoutes } from './routes/auth.route';
import { userRoutes } from './routes/users.route';
import { errorRoutes } from './routes/errors.route';
import { performanceRoutes } from './routes/performance.route';
import TraceForgeFastify from 'usetraceforge/fastify';




export const buildApp = async () => {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      ...(env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
    disableRequestLogging: true, // We'll handle this in lifecycle hooks
  });

  // Global Error Handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    TraceForgeFastify.captureException(error, { 
    tags: { framework: 'fastify' },
    payload: { url: request.url }
  });

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        message: error.message,
        code: error.code,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        error: "Validation Failed", // Matching the expected output specifically
        details: error.validation,
      });
    }

    // Default 500 error
    reply.status(500).send({
      success: false,
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    });
  });

  // Lifecycle Hooks to log execution order
  fastify.addHook('onRequest', async (request, reply) => {
    request.log.info({ req: request }, 'Incoming Request');
    request.log.debug('Hook: onRequest executed');
  });

  fastify.addHook('preValidation', async (request, reply) => {
    request.log.debug('Hook: preValidation executed');
  });

  fastify.addHook('preHandler', async (request, reply) => {
    request.log.debug('Hook: preHandler executed');
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    request.log.debug('Hook: onSend executed');
  });

  fastify.addHook('onResponse', async (request, reply) => {
    request.log.info({ res: reply, responseTime: reply.elapsedTime }, 'Request Completed');
    request.log.debug('Hook: onResponse executed');
  });

  // Register Plugins
  await fastify.register(databasePlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(swaggerPlugin);

  // Register Routes
  await fastify.register(healthRoutes);
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(userRoutes, { prefix: '/users' });
  await fastify.register(errorRoutes, { prefix: '/errors' });
  await fastify.register(performanceRoutes, { prefix: '/performance' });

  return fastify;
};
