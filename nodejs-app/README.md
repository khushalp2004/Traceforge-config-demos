# Node.js Error Simulation App

This application simulates various real-world backend errors using Node.js built-in modules without any third-party frameworks like Express.

## Setup

```bash
npm install
npm start
# or for development
npm run dev
```

## Endpoints to Test

Here are the curl commands to trigger different types of errors:

### Health Check
```bash
curl http://localhost:3000/
```

### ReferenceError
```bash
curl http://localhost:3000/error/reference
```
Demonstrates an attempt to access an undefined variable.

### TypeError
```bash
curl http://localhost:3000/error/type
```
Demonstrates attempting to read a property of `null`.

### SyntaxError (JSON Parsing)
```bash
curl http://localhost:3000/error/json
```
Demonstrates a failure to parse malformed JSON.

### Async Error
```bash
curl http://localhost:3000/error/async
```
Demonstrates an unhandled promise rejection or async function throwing.

### Database Connection Refused
```bash
curl http://localhost:3000/error/db
```
Demonstrates a service/database rejecting a connection.

### File System Error (ENOENT)
```bash
curl http://localhost:3000/error/fs
```
Demonstrates trying to read a file that doesn't exist.

### Missing Environment Variable
```bash
curl http://localhost:3000/error/env
```
Demonstrates missing required environment configurations.

### Timeout
```bash
curl http://localhost:3000/error/timeout
```
Demonstrates a request that takes too long to respond (waits 5 seconds).

### Memory Pressure
```bash
curl http://localhost:3000/error/memory
```
Demonstrates memory pressure by allocating large arrays (may crash the server with heap out of memory).

### CPU Block (Event Loop)
```bash
curl http://localhost:3000/error/cpu
```
Demonstrates blocking the Node.js event loop with a synchronous operation for 3 seconds.
