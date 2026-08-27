# SvelteKit Error & Performance Lab

A production-style SvelteKit application designed to serve as a training ground for frontend engineers. This sandbox simulates common frontend failure scenarios, performance bottlenecks, SSR issues, and state management mistakes.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Application Structure

- **Dashboard (`/`)**: Displays real-time error statistics and environment context.
- **Error Lab (`/error-lab`)**: A collection of triggers for various runtime, API, and logic errors.
- **Performance Lab (`/performance`)**: Simulates memory leaks, hydration issues, and rendering bottlenecks.
- **Users API (`/users/[id]`)**: Demonstrates SvelteKit data loading, routing parameters, and SSR error boundaries.
- **Login (`/login`)**: Mock authentication to explore state management and protected routes.

## Error Reproduction Guide

Navigate to the **Error Lab** to trigger the following issues:

1. **Null Reference / Undefined Access**: Attempts to access deep properties of `null` or `undefined`.
   - *Expected:* Console throws `TypeError`.
   - *Fix:* Use optional chaining `user?.name` or proper type guarding.
2. **JSON Parse Error**: Parses an invalid string.
   - *Expected:* Console throws `SyntaxError`.
   - *Fix:* Wrap in `try/catch` and validate the input.
3. **Async / Network / API 404 Errors**: Simulates failing `fetch` requests or rejected Promises.
   - *Expected:* `Unhandled Promise Rejection` or Network error logs.
   - *Fix:* Handle Promise rejections or check `response.ok` on fetch requests.
4. **Environment Variable Error**: Tries to read an unconfigured environment variable.
   - *Expected:* SvelteKit module resolution or runtime error.
   - *Fix:* Configure `.env` correctly.
5. **Store Update Loops**: A store that updates itself within its `subscribe` method.
   - *Expected:* Recursive maximum stack size warning.
   - *Fix:* Only mutate state conditionally or outside of the reactive binding.

## SvelteKit Debugging Guide

### Server-Side Rendering (SSR)
- If `window` or `document` is accessed at the root level of a `<script>` tag, it will crash during SSR.
- *Fix:* Import `browser` from `$app/environment` and conditionally execute client-specific code, or use Svelte's `onMount` which only runs in the browser.

### Hydration Errors
- Occurs when the server-rendered HTML does not match the initial client-rendered HTML (e.g. using `Math.random()` or `new Date()`).
- *Fix:* Ensure deterministic rendering on the first pass, or render dynamic content only after `onMount`.

### Reactive Statements (Runes in Svelte 5)
- Debug state issues by using `$derived` and `$state` effectively. Remember that mutations must trigger through the proxy object.

## Browser DevTools Guide

- **Console**: Look for the custom `[API]`, `[ERROR]`, and `[SSR Error Hook]` tags managed by our centralized logger.
- **Network Tab**: Use "Throttling" to simulate slow 3G networks and observe how the **Users API** loading states react.
- **Performance Tab**: Navigate to the **Performance Lab**, click "Render List", and record a performance profile. Look for long "Recalculate Style" or "Layout" tasks.
- **Memory Tab**: Take a Heap Snapshot before and after clicking "Start Leaky Interval" to observe detached closures and lingering array references.

Happy Debugging! ⚡
