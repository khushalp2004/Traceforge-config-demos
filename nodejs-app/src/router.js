import url from 'url';
import * as errorController from './controllers/error.controller.js';
import { logger } from './utils/logger.js';
import AppError from './utils/AppError.js';
import TraceForge from 'usetraceforge';

const routes = {
  'GET /': async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'running' }));
  },
  'GET /error/reference': async () => {
    errorController.getReferenceError();
  },
  'GET /error/type': async () => {
    errorController.getTypeError();
  },
  'GET /error/json': async () => {
    errorController.getJsonError();
  },
  'GET /error/async': async () => {
    await errorController.getAsyncError();
  },
  'GET /error/db': async () => {
    await errorController.getDbError();
  },
  'GET /error/fs': async () => {
    await errorController.getFsError();
  },
  'GET /error/env': async () => {
    errorController.getEnvError();
  },
  'GET /error/timeout': async (req, res) => {
    const result = await errorController.getTimeoutError();
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: result }));
  },
  'GET /error/memory': async () => {
    errorController.getMemoryError();
  },
  'GET /error/cpu': async () => {
    errorController.getCpuError();
  }
};

export const router = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const routeKey = `${method} ${path}`;

  logger.info(`Incoming request`, { method, path });

  try {
    const handler = routes[routeKey];
    if (handler) {
      if (routeKey === 'GET /error/timeout' || routeKey === 'GET /') {
        await handler(req, res);
      } else {
        await handler();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Success' }));
      }
    } else {
      throw new AppError(`Route not found: ${path}`, 404);
    }
  } catch (err) {
    handleError(err, res);
  }
};

const handleError = (err, res) => {
  logger.error(`Request failed`, { error: err.message, stack: err.stack, name: err.name });
  TraceForge.captureException(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'error',
    statusCode,
    message,
    errorType: err.name,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  }));
};
