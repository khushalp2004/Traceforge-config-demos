# Fastify Testing App - Debugging Laboratory

This is a production-style Fastify application whose primary purpose is to help backend developers learn debugging, error handling, validation failures, database issues, authentication problems, performance bottlenecks, memory leaks, event-loop blocking, and common production incidents.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Testing

```bash
npm run test
```

## Error Reproduction Guide

Here is how you can reproduce common backend issues using the error endpoints. All these routes are prefixed with `/errors/`.

| Endpoint | Expected Output | Root Cause | Fix |
|---|---|---|---|
| `/reference` | `ReferenceError` | Accessing undefined variables. | Ensure variables are declared and passed properly in scope. |
| `/type` | `TypeError` | Calling property on `null` or `undefined`. | Check for null before accessing properties (`user?.name`). |
| `/json` | `SyntaxError` | Invalid JSON payload parsing. | Wrap JSON parsing in try/catch or validate the input source. |
| `/async` | `Unhandled Promise Rejection` | Promise rejected without `.catch()`. | Await promises in a try/catch block or attach a `.catch()` handler. |
| `/validation` (POST) | `400 Bad Request` | Zod validation failing for request body. | Match request payload to schema. |
| `/database` | `500` / `ECONNREFUSED` | Database connection string is invalid or DB is offline. | Verify DB credentials, network, and whether DB service is running. |
| `/timeout` | `500` / Request Timeout | Operation taking longer than server timeout limits. | Optimize operations or increase allowed timeout duration. |
| `/filesystem` | `ENOENT` | Reading a file that doesn't exist. | Ensure the file exists and paths are correctly resolved. |
| `/env` | `500` Missing Configuration | Environment variable not set. | Add `MISSING_SECRET` to `.env`. |

## Incident Investigation Guide

### Memory Leaks
- **Endpoint**: `/performance/memory`
- **Investigation**: Use tools like `heapdump` or `process.memoryUsage()`. Monitor the resident set size (RSS) over time. In Node.js, arrays pushed globally without bounds checking cause leaks.
- **Fix**: Remove global state storage and clear unused memory references.

### CPU Spikes
- **Endpoint**: `/performance/cpu`
- **Investigation**: Use a Node.js profiler (`node --prof`) or APM to spot long synchronous loops. Event loop blocking halts the entire server processing.
- **Fix**: Move heavy computation to worker threads or break loops into async chunks using `setImmediate`.

### Database Failures
- **Investigation**: Check connection string environment variables, ping the database host, and check the database instance's CPU/Memory. Look for `ECONNREFUSED` logs.
- **Fix**: Apply connection pooling, implement retry logic with exponential backoff, or failover to a replica.

### JWT Authentication Issues
- **Investigation**: Ensure the `Authorization: Bearer <token>` header is present. Ensure `JWT_SECRET` is correctly loaded. Compare expiration times.
- **Fix**: Re-authenticate the client and rotate keys if compromised.

### Validation Failures
- **Investigation**: Check the API logs for 400 responses. Compare the client request body with the defined Zod schema.
- **Fix**: Send the proper request body types.

### Slow Requests
- **Endpoint**: `/performance/slow-query`
- **Investigation**: Enable slow query logs in the database. Add APM tracing to identify the bottleneck. Ensure indexes are present.
- **Fix**: Add database indexing, cache results via Redis, or optimize complex SQL joins.
