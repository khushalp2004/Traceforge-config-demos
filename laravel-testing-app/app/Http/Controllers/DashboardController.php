<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        // Simple mock monitoring metrics
        return response()->json([
            'service' => 'Laravel Testing App',
            'status' => 'healthy',
            'uptime' => '3d 4h 12m',
            'metrics' => [
                'users' => User::count(),
                'memoryUsage' => memory_get_usage(true) / 1024 / 1024 . ' MB',
                'cacheStatus' => Cache::store(config('cache.default'))->getStore() instanceof \Illuminate\Cache\ArrayStore ? 'array (mock)' : 'active',
                'activeConnections' => rand(10, 50),
                'errorRate' => '2.4%',
            ]
        ]);
    }
}
