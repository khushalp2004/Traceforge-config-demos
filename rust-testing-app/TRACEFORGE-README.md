# TraceForge Rust SDK Installation

TraceForge has been successfully configured for your Rust application!

## What was installed?
1. **usetraceforge crate**: Added to your `Cargo.toml`.
2. **.env File**: Your `TRACEFORGE_API_KEY` and `TRACEFORGE_INGEST_URL` were added.
3. **SDK Initialization**: We automatically injected `usetraceforge::init();` into your `src/main.rs`.

## How to Test It
To verify everything is working, intentionally crash your app:
1. Open `src/main.rs`.
2. Add a panic statement somewhere:
   ```rust
   panic!("This is a TraceForge test crash!");
   ```
3. Run your app: `cargo run`
4. Check your TraceForge Dashboard to see the crash logged natively!

## Support
For full documentation, visit [usetraceforge.com/docs](https://usetraceforge.com/docs).
