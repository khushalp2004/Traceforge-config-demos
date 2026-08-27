# TraceForge SDK Configuration for PHP (Laravel)

TraceForge has been initialized in your project! A `.env` file was created or updated with your API key and Ingest URL.

## Step 1: Install Dependency
Run the following command in your terminal to install the SDK via Composer:
```bash
composer require khushalp2004/traceforge-php
```

## Step 2: Zero-Touch Configuration
That's it! Because you are using Laravel, the TraceForge SDK uses **Laravel Package Auto-Discovery**. 

A Service Provider is automatically registered when you run Composer. It seamlessly hooks into Laravel's core `ExceptionHandler` and `Log` system.

It requires **zero manual configuration in your controllers** to capture:
- Unhandled PHP Fatal Errors
- Standard Exceptions
- Laravel 404s and 500s

*(You can safely delete this file once you have finished configuring TraceForge!)*
