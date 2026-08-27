import TraceForge from 'usetraceforge';
import { initTraceForgeAngular } from 'usetraceforge/angular';

initTraceForgeAngular({
  apiKey: '435dcb3d3ff8a6df6ce377d5205236dcd027e76b3da1b556',
  endpoint: 'http://localhost:80/ingest'
});

console.log("Initialized!");

setTimeout(async () => {
  try {
    await TraceForge.captureException(new Error("Test Error"), { tags: { test: "true" } });
    console.log("Error captured successfully!");
  } catch (e) {
    console.error("Failed to capture:", e);
  }
}, 1000);
