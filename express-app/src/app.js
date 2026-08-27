import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes.js';
import debugRoutes from './routes/debug.routes.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

import TraceForge from "usetraceforge";
import { expressErrorHandler } from "usetraceforge/express";

TraceForge.init({ 
  apiKey: process.env.TRACEFORGE_API_KEY, 
  endpoint: process.env.TRACEFORGE_INGEST_URL 
});

const app = express();

// --- Essential Production Middlewares ---
// Security headers
app.use(helmet());
// Request logging
app.use(morgan('dev'));
// JSON body parsing
app.use(express.json());

// --- Routes ---
app.use('/api/health', healthRoutes);
app.use('/api/debug', debugRoutes);

// --- Error Handling ---
// 404 Not Found Middleware (catch-all for unmatched routes)
app.use(expressErrorHandler());
app.use(notFoundHandler);
// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
