# Angular Testing & Debugging Lab

A production-style Angular application specifically designed to help developers learn debugging, error handling, performance profiling, routing issues, RxJS mistakes, memory leaks, and common frontend production problems.

## Setup Instructions

1. Ensure you have Node.js version >= 20.x installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

## Build
To build the project for production:
```bash
npm run build
```

## Error Reproduction Guide

Navigate to the **Error Lab** page (`/error-lab`). This page contains interactive cards that trigger various frontend errors.

1. **Open your Browser Developer Tools** (F12 or Ctrl+Shift+I / Cmd+Option+I).
2. Go to the **Console** tab.
3. Click the "Trigger Issue" buttons on the cards.
4. Observe the custom Logger Service and Global Error Handler format and log the exceptions cleanly.

Issues you can test:
- **Null / Undefined reference**: Standard JS errors.
- **HTTP 404 & Network Errors**: Intercepted by `ApiInterceptor` and `GlobalErrorHandler`.
- **JSON Parse Error**: Synchronous error catching.
- **Promise & RxJS Errors**: Unhandled async rejections.
- **Missing Env Variable**: Explicit runtime check failure.

## Performance Investigation Guide

Navigate to the **Performance Lab** page (`/performance`).

### Memory Leaks
- **RxJS Leak**: Start the "Leaky Interval", then navigate away from the Performance tab. Notice in the console that the interval continues logging. Return to the tab and try the "Safe Interval" (using `takeUntilDestroyed`), navigate away, and verify it stops.
- **DOM Event Leak**: Click "Add Leaky Window Listener" and scroll the page. The console logs scroll events. Navigate away, and the events continue.

### Change Detection & Rendering
- **Expensive Template Function**: Click "Trigger Change Detection". Observe the console log showing the bad practice of calling functions directly in templates. Compare this to the memoized Signal version.
- **Large DOM Rendering**: Click "Generate 10k Items". Try mutating the list without `trackBy` to see the performance hit (layout thrashing) vs with `trackBy`.

## DevTools Guide

- **Console Tab**: Watch the structured logs from our `LoggerService`.
- **Network Tab**: Inspect the failed XHR requests when triggering HTTP errors.
- **Performance Tab**: Record a session while rendering the 10,000 items without `trackBy` to observe layout thrashing and Long Tasks.
- **Memory Tab**: Take heap snapshots before and after creating memory leaks to track retained memory.
- **Angular DevTools**: Use the Profiler to see which components are running change detection unnecessarily.

---
*Built as a learning sandbox for modern Angular development and debugging.*
