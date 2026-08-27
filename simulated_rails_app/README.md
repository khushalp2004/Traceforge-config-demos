# Simulated Rails 8 Production App

This is a production-style Ruby on Rails 8 API-only application that simulates a real production backend while remaining lightweight and easy to run. It uses an **in-memory fake database** instead of a real database (like PostgreSQL or MySQL).

## Features & Simulated Modules

This application teaches and demonstrates various production Rails concepts:

### 1. Project Architecture
The application is structured like a real Rails API:
- `app/controllers/`: Standard Rails controllers.
- `app/repositories/`: Repository pattern to encapsulate data access logic.
- `app/fake_database/`: The core Fake Database Engine that stores everything in-memory.
- `app/services/`: Business logic services, such as `JwtService` for Authentication.
- `app/middleware/`: Custom Rack middleware.
- `app/jobs/`: Simulated background workers.

### 2. Fake Database Implementation
We skip ActiveRecord (`-O` flag). Instead, data is stored in `FakeDatabase` (a Singleton class backed by Hashes and Arrays).
- **Repositories** (`FakeUserRepository`, `FakePostRepository`) provide CRUD, pagination, and filtering methods, making controllers unaware that the DB is fake.

### 3. Authentication
The application uses JWT-based authentication. 
- The `JwtService` encodes and decodes tokens.
- `ApplicationController#authenticate_request` protects endpoints.
- Endpoints: `POST /login`, `POST /register`, `GET /profile`.

### 4. Middleware
We have custom Rack middlewares registered in `config/application.rb`:
- `RequestLogging`: Logs incoming requests and response timings.
- `RequestTiming`: Adds an `X-Runtime` header to responses.
- `CorrelationId`: Generates and propagates `X-Correlation-ID` for distributed tracing simulation.

### 5. Error Laboratory (`/errors/*`)
We intentionally reproduce common production errors so you can observe the logs and error responses:
- `GET /errors/no-method`: Triggers a `NoMethodError` (`nil.name`).
- `GET /errors/timeout`: Simulates a slow request that times out (sleep 5s).
- `GET /errors/validation`: Returns standard Rails-like validation errors.
- **Global Error Handling**: `ApplicationController` uses `rescue_from` to format these exceptions into unified JSON responses.

### 6. Performance Laboratory (`/performance/*`)
We demonstrate common performance bottlenecks:
- `GET /performance/cpu`: CPU-intensive mathematical calculations.
- `GET /performance/memory`: Simulates a memory leak by growing a global array.
- `GET /performance/n_plus_one`: Compares N+1 queries vs Eager Loading in memory.
- `GET /performance/large_response`: Serializes 100,000 JSON objects.

### 7. Background Jobs Simulation
Instead of Sidekiq or Redis, we built a simple `ApplicationJob` that runs tasks asynchronously in separate Ruby Threads.
- Classes like `SendEmailJob` and `CleanupJob` can be invoked using `perform_async`.

### 8. Caching & Monitoring Dashboard
- We use Rails `MemoryStore` cache in the `DashboardController` (`Rails.cache.fetch`).
- `GET /dashboard`: Returns metrics like Memory Usage, Uptime, Request Stats, and Cache data.

## How to Run

No external services (Docker, Postgres, Redis) are required!

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Start the server:
   ```bash
   bin/rails server
   ```

3. Run Tests (RSpec):
   ```bash
   bundle exec rspec
   ```
