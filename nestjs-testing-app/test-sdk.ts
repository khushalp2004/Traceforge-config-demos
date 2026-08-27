import * as dotenv from 'dotenv';
dotenv.config();

import TraceForgeNest from 'usetraceforge/nestjs';

async function test() {
  console.log("Initializing...");
  TraceForgeNest.init({
    apiKey: process.env.TRACEFORGE_API_KEY as string,
    endpoint: process.env.TRACEFORGE_INGEST_URL,
    autoCapture: false
  });

  console.log("Config loaded. Endpoint:", process.env.TRACEFORGE_INGEST_URL);
  console.log("Capturing test error...");

  try {
    throw new Error("Direct test error from NestJS testing app!");
  } catch (e) {
    const promise = TraceForgeNest.captureException(e, { tags: { framework: 'nestjs' } } as any);
    console.log("Promise returned from captureException:", promise);
    await promise;
    console.log("Awaited captureException successfully!");
  }
}

test().catch(e => console.error("Test script failed:", e));
