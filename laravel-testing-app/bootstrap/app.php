<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(append: [
            \App\Http\Middleware\RequestLogMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                $status = 500;
                $message = $e->getMessage() ?: 'An unexpected error occurred.';
                $errorCode = 'INTERNAL_ERROR';

                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Validation failed',
                        'errorCode' => 'VALIDATION_ERROR',
                        'errors' => $e->errors(),
                    ], 422);
                }

                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $status = 401;
                    $message = 'Unauthenticated.';
                    $errorCode = 'UNAUTHENTICATED';
                } elseif ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                    $status = 404;
                    $message = 'Resource not found.';
                    $errorCode = 'NOT_FOUND';
                } elseif ($e instanceof \Illuminate\Database\QueryException) {
                    $status = 500;
                    $message = 'Database error.';
                    $errorCode = 'DB_ERROR';
                    
                    if (str_contains($e->getMessage(), 'Connection refused') || str_contains($e->getMessage(), 'SQLSTATE[HY000]')) {
                        $message = 'Database unavailable';
                        $errorCode = 'DB_CONNECTION_ERROR';
                    }
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    $status = 404;
                    $message = 'Endpoint not found.';
                    $errorCode = 'ENDPOINT_NOT_FOUND';
                } elseif ($e instanceof \RuntimeException) {
                    $status = 500;
                    $errorCode = 'RUNTIME_ERROR';
                }

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'errorCode' => $errorCode,
                ], $status);
            }
        });
    })->create();
