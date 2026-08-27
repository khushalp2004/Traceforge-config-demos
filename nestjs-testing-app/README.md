# NestJS Testing App (Error & Performance Laboratory)

This application is a production-style NestJS codebase whose primary purpose is to help backend developers learn debugging, exception handling, validation, authentication, database failures, dependency injection issues, memory leaks, performance bottlenecks, event-loop blocking, and common production incidents.

It serves as a laboratory for onboarding backend engineers, incident-response training, and architecture education.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Build

```bash
$ npm run build
```

## Error Reproduction Guide

### 1. Reference Error
- **Route:** `GET /errors/reference`
- **What it simulates:** Attempting to access a variable that is not defined (`user.name` where `user` does not exist).
- **Expected output:** `Internal server error` (Status 500) caught by `GlobalExceptionFilter` with a stack trace in the logs.
- **Root cause:** Typo or missing variable declaration.
- **Recommended fix:** Ensure variables are defined and in scope before use.

### 2. Type Error
- **Route:** `GET /errors/type`
- **What it simulates:** Attempting to read a property of `null` or `undefined` (`user.name` where `user = null`).
- **Expected output:** `Internal server error` (Status 500) indicating `Cannot read properties of null`.
- **Root cause:** Missing null checks before accessing object properties.
- **Recommended fix:** Use optional chaining (`user?.name`) or explicit null checks.

### 3. JSON Parse Error
- **Route:** `GET /errors/json`
- **What it simulates:** Parsing invalid JSON strings (`JSON.parse('{bad json}')`).
- **Expected output:** `Internal server error` (Status 500) due to `SyntaxError`.
- **Root cause:** Receiving malformed JSON from an external API or file.
- **Recommended fix:** Wrap `JSON.parse` in a `try/catch` block.

### 4. Unhandled Async Error
- **Route:** `GET /errors/async`
- **What it simulates:** An unhandled promise rejection.
- **Expected output:** Caught by NestJS built-in exceptions or `unhandledRejection` process event.
- **Root cause:** Missing `try/catch` around `await` or `.catch()` on a promise.
- **Recommended fix:** Use `try/catch` in async functions.

### 5. Database Connection Failure
- **Route:** `GET /errors/database`
- **What it simulates:** A database connection error like `ECONNREFUSED`.
- **Expected output:** `Internal server error` indicating database unavailability.
- **Root cause:** Database server is down or credentials are wrong.
- **Recommended fix:** Implement connection retries and proper health checks.

### 6. Missing Environment Variable
- **Route:** `GET /errors/env`
- **What it simulates:** Application failing due to a missing critical environment variable.
- **Expected output:** `Configuration Error` exception.
- **Root cause:** Forgot to add the variable to `.env` or CI/CD secrets.
- **Recommended fix:** Validate environment variables at startup using `@nestjs/config` and Joi/Zod.

### 7. File System Error
- **Route:** `GET /errors/filesystem`
- **What it simulates:** `ENOENT` error when reading a missing file.
- **Expected output:** `Internal server error` indicating no such file or directory.
- **Root cause:** Incorrect path or missing file.
- **Recommended fix:** Use `fs.existsSync` or `try/catch`.

## Performance Laboratory Guide

### 1. Event Loop Blocking
- **Route:** `GET /performance/cpu`
- **What it simulates:** Heavy synchronous CPU computation blocking the event loop.
- **Observation:** If you hit this endpoint, other concurrent requests will stall until this finishes.
- **Recommended fix:** Use Node.js Worker Threads or offload to a background job queue (e.g., BullMQ).

### 2. Memory Leak
- **Route:** `GET /performance/memory`
- **What it simulates:** A global array growing indefinitely, causing memory bloat.
- **Observation:** Memory usage will spike by 10MB per request.
- **Recommended fix:** Avoid global state, clear unused references, and use Heap Snapshots to find leaks.

### 3. Large Response
- **Route:** `GET /performance/large-response`
- **What it simulates:** Returning 100,000 records in a single JSON response.
- **Observation:** High memory usage for serialization and slow response times.
- **Recommended fix:** Implement pagination (`limit`/`offset`) or streaming.

### 4. Slow Database Query
- **Route:** `GET /performance/slow-query`
- **What it simulates:** A query taking 5 seconds to execute.
- **Observation:** High response time without blocking the event loop (since it is async).
- **Recommended fix:** Add database indexes, optimize the query, or implement caching (e.g., Redis).

## NestJS Learning Guide

- **Modules:** Used to organize the application structure into cohesive blocks (e.g., `UsersModule`, `AuthModule`).
- **Providers:** Classes that can be injected as dependencies (e.g., Services, Repositories).
- **Controllers:** Handle incoming HTTP requests and return responses to the client.
- **Dependency Injection (DI):** NestJS core mechanism to instantiate classes and inject their dependencies automatically.
- **Guards:** Determine whether a given request will be handled by the route handler based on certain conditions (e.g., `JwtAuthGuard` for authentication).
- **Interceptors:** Bind extra logic before/after method execution, transform results, or measure execution time (e.g., `TimingInterceptor`).
- **Middleware:** Functions executed before the route handler, similar to Express middleware (e.g., `RequestLoggerMiddleware`).
- **Exception Filters:** Process all unhandled exceptions across the application (e.g., `GlobalExceptionFilter`).

## Production Incident Guide

### How to Investigate:

1. **Memory Leaks:**
   - Monitor memory usage via APM tools (Datadog, New Relic) or `process.memoryUsage()`.
   - Take Heap Snapshots (`node --heapsnapshot-signal`) and analyze them in Chrome DevTools to find retaining paths.

2. **CPU Spikes (Event Loop Blocking):**
   - Use `clinic.js` (Clinic Doctor/Flame) or Node.js built-in profiler.
   - Check for large synchronous loops, complex Regex parsing, or heavy JSON serialization.

3. **Database Failures:**
   - Check connection pool limits and database CPU/Memory.
   - Ensure appropriate timeout settings.

4. **Authentication & Validation Issues:**
   - Check JWT expiration logs and verify secret keys.
   - Look for 400 Bad Request logs to find malformed client payloads.

5. **Dependency Injection Errors:**
   - These usually happen at startup (`Nest can't resolve dependencies`).
   - Check if the provider is registered in the `providers` array of its Module, and if it is exported if used in another Module.
