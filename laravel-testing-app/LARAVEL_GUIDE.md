# Laravel Learning Guide

## Core Concepts

### Service Container
The Service Container is an IoC (Inversion of Control) container. It manages class dependencies and performs dependency injection. Whenever you type-hint a class in a Controller's constructor or method, the container automatically resolves and injects it.

### Middleware
Middleware provide a convenient mechanism for inspecting and filtering HTTP requests entering your application. For example, `auth:sanctum` verifies the user is authenticated. We created `RequestLogMiddleware` to log every request and inject a Correlation ID.

### Form Requests
Form Requests are custom request classes that encapsulate validation and authorization logic. They keep your controllers clean. See `StoreUserRequest` for an example.

### Eloquent ORM
Eloquent is Laravel's active record implementation. Each database table has a corresponding "Model" that is used to interact with that table.
- **Lazy Loading**: `User::all(); foreach($users as $u) { $u->posts; }` causes N+1 queries.
- **Eager Loading**: `User::with('posts')->get();` fixes this by loading all relationships in a single extra query.

### Exception Handling
Laravel handles all exceptions through a global handler. In Laravel 11+, this is configured in `bootstrap/app.php`. We customized this to ensure our API always returns a consistent JSON structure, converting specific exceptions (like `ValidationException` or `ModelNotFoundException`) into specific HTTP status codes and formats.
