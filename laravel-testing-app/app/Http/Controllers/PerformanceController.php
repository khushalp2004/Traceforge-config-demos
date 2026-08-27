<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PerformanceController extends Controller
{
    public function cpu(Request $request)
    {
        $iterations = $request->query('iterations', 1000000);
        
        $start = microtime(true);
        $hash = '';
        for ($i = 0; $i < $iterations; $i++) {
            $hash = md5($hash . $i);
        }
        $end = microtime(true);

        return response()->json([
            'iterations' => $iterations,
            'executionTimeMs' => round(($end - $start) * 1000, 2),
            'hash' => $hash,
        ]);
    }

    public function memory()
    {
        // This will eventually exhaust memory based on limit
        $data = [];
        $limit = ini_get('memory_limit');
        
        try {
            for ($i = 0; $i < 500000; $i++) {
                $data[] = str_repeat('A', 1024); // 1KB per iteration
            }
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'memoryLimit' => $limit,
            ], 500);
        }

        return response()->json([
            'message' => 'Memory allocated',
            'memoryUsage' => memory_get_usage(true) / 1024 / 1024 . ' MB',
            'memoryLimit' => $limit,
        ]);
    }

    public function largeJson()
    {
        $start = microtime(true);
        $startMemory = memory_get_usage(true);

        $records = [];
        for ($i = 0; $i < 10000; $i++) {
            $records[] = [
                'id' => $i,
                'uuid' => \Illuminate\Support\Str::uuid(),
                'name' => 'Record ' . $i,
                'timestamp' => now()->toIso8601String(),
                'active' => (bool)($i % 2),
            ];
        }

        $end = microtime(true);
        $endMemory = memory_get_usage(true);

        return response()->json([
            'meta' => [
                'generationTimeMs' => round(($end - $start) * 1000, 2),
                'memoryUsedMb' => round(($endMemory - $startMemory) / 1024 / 1024, 2),
            ],
            'data' => $records,
        ]);
    }

    public function slowQuery()
    {
        $start = microtime(true);
        
        // Simulating a slow query using sleep
        // In SQLite, we can't easily use SLEEP() in DB, so we'll simulate via PHP for now,
        // or a heavy cross join. Since it's a simulation:
        sleep(5); 
        $users = User::take(5)->get();
        
        $end = microtime(true);
        Log::info('Slow query executed', ['time_ms' => round(($end - $start) * 1000, 2)]);

        return response()->json([
            'executionTimeMs' => round(($end - $start) * 1000, 2),
            'users' => $users
        ]);
    }

    public function nPlusOneBroken()
    {
        $start = microtime(true);
        
        DB::enableQueryLog();
        
        // This causes N+1 because posts are lazy loaded in the loop
        $users = User::all();
        $results = [];
        
        foreach ($users as $user) {
            $results[] = [
                'user' => $user->name,
                'post_count' => $user->posts->count(), // N+1 trigger
            ];
        }
        
        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        
        $end = microtime(true);

        return response()->json([
            'executionTimeMs' => round(($end - $start) * 1000, 2),
            'queryCount' => count($queries),
            'data' => $results,
        ]);
    }

    public function nPlusOneFixed()
    {
        $start = microtime(true);
        
        DB::enableQueryLog();
        
        // Fixed using eager loading
        $users = User::with('posts')->get();
        $results = [];
        
        foreach ($users as $user) {
            $results[] = [
                'user' => $user->name,
                'post_count' => $user->posts->count(),
            ];
        }
        
        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        
        $end = microtime(true);

        return response()->json([
            'executionTimeMs' => round(($end - $start) * 1000, 2),
            'queryCount' => count($queries),
            'data' => $results,
        ]);
    }
}
