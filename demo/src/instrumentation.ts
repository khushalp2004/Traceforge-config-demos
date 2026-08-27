import TraceForge from "usetraceforge";

export function register() {
  TraceForge.init({
    apiKey: process.env.NEXT_PUBLIC_TRACEFORGE_API_KEY!,
    endpoint: process.env.NEXT_PUBLIC_TRACEFORGE_INGEST_URL,
    autoCapture: true,
  });
}

export function onRequestError(err: any, request: any) {
  TraceForge.captureException(err, { tags: { route: request.url } });
}
