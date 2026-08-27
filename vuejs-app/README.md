# Vue Testing Application (Error Sandbox)

This is a production-style Vue 3 application built with Vite. Its primary goal is not to be a feature-rich product, but a realistic sandbox for demonstrating common errors, edge cases, and debugging scenarios in frontend development.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## Folder Structure

```
vue-testing-app/
├── src/
│   ├── main.ts              # Application entry point & global error handling
│   ├── App.vue              # Root component with layout
│   ├── router/              # Vue Router configuration
│   ├── stores/              # Pinia state management (e.g. user store)
│   ├── services/            # Axios API client setup with interceptors
│   ├── views/               # Page components (Home, ErrorLab, NotFound)
│   ├── components/          # Reusable UI components (Navbar, ErrorCard)
│   ├── composables/         # Custom Vue composables (e.g. useFetch)
│   ├── utils/               # Utilities (logger, errorHandler)
│   └── types/               # TypeScript interfaces
```

## How to Reproduce Errors

Navigate to the **/error-lab** route to access the Error Sandbox. Click the buttons in each card to trigger specific errors.

### 1. Runtime Errors
- **Null / Undefined Access**: Triggers `Cannot read properties of...`.
  - **Debug**: Open DevTools -> Console. The global error handler catches and logs it. Click the file link in the stack trace to see the exact line of code.

### 2. API Failures
- **Network Error**: Calls a non-existent domain.
- **404 Not Found**: Calls a non-existent endpoint on a valid domain.
  - **Debug**: Open DevTools -> Network tab. Inspect the failed request, view the Headers and Response. The Axios interceptor will also log this to the Console.

### 3. Async & Parse Errors
- **Unhandled Async Error**: Rejects a Promise.
- **JSON Parse Error**: Parses invalid JSON.
  - **Debug**: Check the Console. The `window.onunhandledrejection` captures the Promise error.

### 4. Memory Leaks
- **setInterval Leak**: Allocates memory in a loop without clearing the interval.
  - **Debug**: 
    1. Open DevTools -> Performance.
    2. Click the "Trash can" icon to force garbage collection.
    3. Take a Heap Snapshot in the Memory tab before and after starting the leak to compare allocated objects.

### 5. Event Listener Leak
- **Global Listener Leak**: Attaches a `resize` listener to the `window` without removing it on component unmount.
  - **Debug**: Open DevTools -> Elements. Select the `window` object in the console and call `getEventListeners(window)`.

### 6. Performance Bottlenecks
- **Slow Render / Large State**: Renders 15,000 DOM nodes or loads 100,000 records into Pinia.
  - **Debug**: Open DevTools -> Performance. Click Record, trigger the slow action, and stop recording. Analyze the flame chart to see time spent in rendering and scripting. Vue DevTools can also be used to inspect Pinia state sizes.
