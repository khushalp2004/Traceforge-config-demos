<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RequestLogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $correlationId = $request->header('X-Correlation-ID', (string) Str::uuid());
        
        $request->headers->set('X-Correlation-ID', $correlationId);
        
        Log::withContext([
            'correlation_id' => $correlationId,
        ]);

        $startTime = microtime(true);
        
        $response = $next($request);
        
        $duration = microtime(true) - $startTime;
        
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status' => $response->getStatusCode(),
            'duration_ms' => round($duration * 1000, 2),
            'ip' => $request->ip(),
        ]);
        
        $response->headers->set('X-Correlation-ID', $correlationId);
        
        return $response;
    }
}
