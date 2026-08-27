import * as dotenv from 'dotenv';
dotenv.config();

import TraceForgeNest from 'usetraceforge/nestjs';

async function test() {
  TraceForgeNest.init({
    apiKey: process.env.TRACEFORGE_API_KEY as string,
    endpoint: process.env.TRACEFORGE_INGEST_URL,
    autoCapture: false
  });

  TraceForgeNest.captureException(new Error("Testing detached Promise!"), { tags: { framework: 'nestjs' } } as any);
  
  // Wait a few seconds to let event loop run, mimicking a server staying alive
  await new Promise(r => setTimeout(r, 3000));
}

test();
