# Go Testing App

A production-style Go backend application intended for backend engineers to learn about debugging, error handling, concurrency issues, memory leaks, performance bottlenecks, and common production incidents.

## Features

- **Error Laboratory**: Endpoints designed to crash or fail in ways seen in production (panics, bad JSON, missing map keys, DB/Cache unavailability).
- **Performance Laboratory**: Endpoints simulating heavy CPU usage, memory leaks, goroutine leaks, data races, and deadlocks.
- **Authentication**: JWT-based login and registration.
- **Graceful Shutdown**: Properly closes active connections when a termination signal is received.
- **Swagger Documentation**: Accessible via `/swagger/index.html`.

## Prerequisites

- Go 1.24+
- Docker & Docker Compose

## Getting Started

1. **Start the Infrastructure**
   ```bash
   docker-compose up -d
   ```

2. **Download Dependencies**
   ```bash
   go mod tidy
   ```

3. **Run the Application**
   ```bash
   go run ./cmd/server
   ```
   The application will start on `http://localhost:8080`.

## Testing & Profiling

### Running Tests
Run all tests:
```bash
go test ./...
```

### Race Detection
Run tests with the race detector enabled to spot race conditions (like the one in the Performance Laboratory):
```bash
go test -race ./...
```

### Benchmarking
Run benchmarks:
```bash
go test -bench .
```

### Profiling
To inspect CPU or Memory usage, you can use `go tool pprof`.
(Assuming pprof is enabled in routes via `net/http/pprof`)
```bash
go tool pprof http://localhost:8080/debug/pprof/profile
```

## Error Reproduction Guide

- **Nil Pointer Dereference** (`/errors/nil-pointer`): Tries to access a property on an uninitialized pointer. Causes a panic. Recovered by middleware.
- **Race Condition** (`/performance/race`): Multiple goroutines accessing a shared variable without a mutex. Detect using `go test -race`.
- **Goroutine Leak** (`/performance/goroutine`): Starts a goroutine that blocks on a channel read forever. Use `pprof` to see goroutine count increase.

Enjoy breaking and fixing things!
