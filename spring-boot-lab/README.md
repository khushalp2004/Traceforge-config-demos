# Spring Boot Learning Laboratory

Welcome to the **Spring Boot Learning Laboratory**! This application is designed to simulate a production-grade Java backend. It acts as an interactive playground to help developers learn Spring Boot architecture, debugging, concurrency, performance optimization, and common production issues.

**Note**: This application deliberately runs entirely **in-memory**. It requires no external dependencies (no databases, no Docker, no Redis, etc.) making it the perfect sandbox for safe experimentation and onboarding.

---

## 🚀 Installation & Running

### Prerequisites
- **Java 21 (LTS)**
- **Maven**

### Steps

1. Clone or download this repository.
2. Navigate to the project directory:
   ```bash
   cd spring-boot-lab
   ```
3. Build the project:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   
The application will start on `http://localhost:5173`.

---

## 🏗 Project Architecture

The application strictly follows Clean Architecture principles:

- **`controller/`**: REST APIs and entry points for the various "Laboratories".
- **`service/`**: Business logic (omitted in some labs for simplicity).
- **`fakeDatabase/`**: A fully functional in-memory repository layer using `ConcurrentHashMap` and `ArrayList` to simulate a real database (CRUD, search, pagination).
- **`model/`**: Core domain entities (`User`, `Product`, `Order`).
- **`dto/`**: Request, Response, and standard `ApiResponse` objects for data transfer.
- **`security/`**: JWT-based stateless authentication mechanisms, `OncePerRequestFilter`, and configuration.
- **`exception/`**: Centralized `@ControllerAdvice` to format standard error responses.

---

## 🧪 The Laboratories

This application exposes dedicated API endpoints designed to teach specific concepts by intentionally reproducing real-world scenarios.

### 1. Error Laboratory (`/errors/*`)
Demonstrates how raw Java exceptions behave and how they are intercepted by a global exception handler.

- `GET /errors/null-pointer`: Triggers a `NullPointerException`.
- `GET /errors/index`: Triggers an `IndexOutOfBoundsException`.
- `GET /errors/class-cast`: Triggers an invalid cast (`ClassCastException`).
- `GET /errors/validation`: Manually throws a `ValidationException`.

**Solution**: Review `GlobalExceptionHandler.java` to see how these exceptions are caught and transformed into user-friendly JSON payloads.

### 2. Performance Laboratory (`/performance/*`)
Demonstrates common performance bottlenecks.

- `GET /performance/cpu`: Runs a heavy trigonometric loop to simulate high CPU usage.
- `GET /performance/memory-leak`: Intentionally adds large chunks of data to a static list. *Warning: Hitting this repeatedly will cause an OutOfMemoryError!*
- `GET /performance/sleep`: Pauses the thread, blocking the request pool.

### 3. Concurrency Laboratory (`/concurrency/*`)
Highlights thread-safety issues in multi-threaded environments.

- `GET /concurrency/race-condition`: Fires 1000 threads updating a shared counter without synchronization. The result is almost always less than 1000 due to race conditions.
- `GET /concurrency/fixed-race-condition`: Fixes the issue using a `ReentrantLock`.

### 4. Production Bug Playground (`/bugs/*`)
Features realistic developer mistakes.

- `GET /bugs/stack-overflow`: Triggers infinite recursion, resulting in a `StackOverflowError`.

### 5. Learning Laboratory (`/learning/*`)
Informational endpoints summarizing key Spring Framework concepts.

- `GET /learning/di-explained`: Notes on Dependency Injection.
- `GET /learning/scopes`: Notes on Bean Scopes (Singleton vs. Prototype).

---

## 🛡 Fake Database Design

To run smoothly without MySQL or PostgreSQL, we implemented a custom `fakeDatabase` package. 

- **Thread-Safety**: We use `ConcurrentHashMap<Long, Entity>` as the primary storage medium.
- **ID Generation**: Handled atomically via `AtomicLong`.
- **Querying**: Simulated using the Java Stream API (e.g., `store.values().stream().filter(...)`).
- **Pagination**: Simulated using `.skip(page * size).limit(size)`.

---

## 🎓 Spring Boot Learning Guide

### Dependency Injection (DI)
Use Constructor Injection (via Lombok's `@RequiredArgsConstructor` or explicit constructors) over `@Autowired` on fields. This makes dependencies immutable and easier to mock in unit tests.

### Exception Handling
Instead of returning raw HTML error pages or stack traces to the client, use `@ControllerAdvice` combined with `@ExceptionHandler`. This ensures every error (even unhandled ones) conforms to a standard JSON format:
```json
{
    "success": false,
    "message": "...",
    "errorCode": "..."
}
```

### Security
This app implements a stateless JWT flow.
1. The user logs in via `/auth/login`.
2. The server verifies credentials against the `FakeUserRepository` and generates a token.
3. Subsequent requests pass the token in the `Authorization: Bearer <token>` header.
4. `JwtAuthenticationFilter` intercepts the request, validates the token signature/expiration, and builds the Security Context.

---

## 🕵️ Production Incident Guide

How to investigate common issues simulated in this lab:

- **High CPU Usage**: Take thread dumps (using `jstack`). Look for threads stuck in `RUNNABLE` state executing intense loops (e.g., `/performance/cpu`).
- **Memory Leaks**: If memory spikes and garbage collection fails, capture a heap dump (`jmap`). Analyze it (e.g., with Eclipse MAT) to find GC Roots holding onto memory, like the static list in `/performance/memory-leak`.
- **Thread Pool Exhaustion**: If the app stops responding to new requests, check if threads are blocked on I/O or sleep operations (`/performance/sleep`).
- **Race Conditions**: When data becomes inconsistent under load, verify that mutable shared state is properly synchronized using `synchronized` blocks or `java.util.concurrent.locks`.

---
Happy Coding & Debugging!
