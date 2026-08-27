# Laravel Testing App

A production-style PHP backend application designed to help backend developers learn debugging, exception handling, and simulated production incidents.

## Features
- **Error Laboratory**: Endpoints simulating common PHP/Laravel errors.
- **Performance Laboratory**: CPU intensive, memory leak, and slow query simulations.
- **Incident Laboratory**: Mass assignment vulnerabilities, transaction rollbacks, race conditions.
- **Authentication**: Laravel Sanctum based token authentication.
- **Monitoring**: Dashboard endpoint with mock metrics.

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

## Development

Run the local development server:
```bash
php artisan serve --port=5173
```

## Queue & Scheduler

To test queue failures and jobs:
```bash
php artisan queue:work
```

To run the scheduler (if configured):
```bash
php artisan schedule:work
```

## Testing

Run tests with Pest/PHPUnit:
```bash
php artisan test
```

## API Documentation

The API documentation is generated using Scramble. You can view the OpenAPI UI at:
`http://localhost:5173/docs/api`

## Guides

- [Error Reproduction Guide](ERROR_GUIDE.md)
- [Laravel Learning Guide](LARAVEL_GUIDE.md)
- [Production Incident Guide](INCIDENT_GUIDE.md)
