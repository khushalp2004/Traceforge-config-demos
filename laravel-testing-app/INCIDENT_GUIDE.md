# Production Incident Guide

## Investigating Slow SQL Queries
1. **Identify**: Monitor your APM (like Datadog, New Relic) or check Laravel Telescope / Clockwork. Look for requests taking > 1000ms.
2. **Reproduce**: Use the `/api/performance/n-plus-one/broken` endpoint to see the effect of N+1 queries.
3. **Analyze**: Use `DB::enableQueryLog()` or listen to the `Illuminate\Database\Events\QueryExecuted` event to log all queries. Check for repeated identical queries in loops.
4. **Fix**: Use Eager Loading (`with()`), add database indexes, or optimize the query structure.

## Investigating Memory Exhaustion
1. **Identify**: You will see `Allowed memory size of X bytes exhausted` in your logs.
2. **Reproduce**: Trigger `/api/performance/memory`.
3. **Analyze**: Memory leaks often happen when loading massive datasets into memory (e.g., `User::all()` on a table with 1M rows) or holding references to objects in long-running queue workers.
4. **Fix**: Use chunking (`User::chunk(100, function() {...})`), cursor pagination, or lazy collections (`User::cursor()`).

## Investigating Race Conditions
1. **Identify**: Data inconsistencies, such as negative inventory balances or duplicate processing.
2. **Reproduce**: `/api/incidents/race-condition/broken`.
3. **Analyze**: Two concurrent requests read the same value, modify it, and write it back, overwriting each other.
4. **Fix**: Use Pessimistic Locking (`lockForUpdate()`), Optimistic Locking (version columns), or atomic database operations (`increment()`, `decrement()`). See `/api/incidents/race-condition/fixed`.

## Queue Failures
1. **Identify**: Jobs piling up in the queue or entries in the `failed_jobs` table.
2. **Reproduce**: `/api/errors/queue`.
3. **Analyze**: Check the exception stack trace in the `failed_jobs` table payload. Common issues include API timeouts, missing records, or syntax errors.
4. **Fix**: Fix the underlying issue, ensure jobs are idempotent, and retry the job using `php artisan queue:retry`.
