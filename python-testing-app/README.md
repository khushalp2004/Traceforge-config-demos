# Python Testing App (Error Laboratory)

A complete, production-style Python backend built with FastAPI, designed specifically for training backend developers in debugging, performance tuning, and incident response.

## Overview

This application intentionally includes common production issues such as:
- Python-specific bugs (mutable defaults, generator exhaustion)
- Performance bottlenecks (CPU locking, memory leaks)
- Concurrency issues (race conditions)
- Error handling scenarios

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Locally**
   ```bash
   uvicorn app.main:app --reload
   ```

3. **Run with Docker**
   ```bash
   docker compose up
   ```

## Laboratories

Explore the API documentation at `http://localhost:8000/docs` to see all available endpoints.

### 1. Error Laboratory (`/errors/*`)
Endpoints that intentionally trigger exceptions like `NameError`, `KeyError`, `FileNotFoundError`, and timeout issues to demonstrate how the global exception handler catches and formats them.

### 2. Performance Laboratory (`/performance/*`)
- `/cpu`: Blocks the async event loop with a CPU-intensive task.
- `/memory`: Simulates a memory leak by appending to a global list.
- `/large-response`: Generates 100,000 records to measure serialization time.
- `/thread-blocking`: Uses `time.sleep()` inside an async endpoint, blocking the worker thread.

### 3. Educational (`/educational/*`)
Demonstrates common Python gotchas:
- Mutable default arguments
- Race conditions with shared state
- Generator exhaustion
- Datetime timezone mismatches

### 4. Auth & Users
Standard registration and login flows returning JWTs, demonstrating proper Pydantic validation.
