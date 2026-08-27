# Error Reproduction Guide

This guide explains the simulated errors in the Error Laboratory (`/api/errors/*`).

## Undefined Variable (`/api/errors/undefined-variable`)
- **Simulates**: Accessing a variable that was never declared (e.g., typos).
- **Expected Output**: HTTP 500 with "Undefined variable $userr".
- **Root Cause**: PHP throws an Error when a variable doesn't exist in the current scope.
- **Recommended Fix**: Correct the typo or initialize the variable. Use static analysis (PHPStan/Larastan) to catch these before production.

## Null Reference (`/api/errors/null-reference`)
- **Simulates**: Attempting to read a property on a `null` object.
- **Expected Output**: HTTP 500 with "Attempt to read property on null".
- **Root Cause**: Expecting an object (like a User model) but receiving null.
- **Recommended Fix**: Use null-safe operators (`?->`), `findOrFail()`, or explicit null checks (`if (!$user)`).

## Array Key (`/api/errors/array-key`)
- **Simulates**: Accessing an undefined index in an array.
- **Expected Output**: HTTP 500 with "Undefined array key".
- **Root Cause**: The array doesn't contain the requested key.
- **Recommended Fix**: Use `isset()`, `array_key_exists()`, or Laravel's `Arr::get()` or `data_get()` helpers.

## Database Connection (`/api/errors/database`)
- **Simulates**: A database server going offline or rejecting connections.
- **Expected Output**: HTTP 500 JSON with `"errorCode": "DB_CONNECTION_ERROR"`.
- **Root Cause**: Invalid credentials or unreachable host.
- **Recommended Fix**: Ensure environment variables are correct, DB server is running, and networking is configured properly.

## Missing Environment Variable (`/api/errors/env`)
- **Simulates**: Forgetting to set a critical environment variable.
- **Expected Output**: HTTP 500 with "Missing configuration: CRITICAL_API_KEY".
- **Root Cause**: The application relies on `env()` but it returns null.
- **Recommended Fix**: Always set required variables in `.env`. Validate config in service providers using `config()` instead of `env()` directly in code.
