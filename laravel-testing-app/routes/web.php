<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'Laravel Testing App',
        'status' => 'running',
        // In the screenshot it's actually Laravel 13, but I'll use the app() helper to get the real version dynamically
        'framework' => 'Laravel ' . app()->version(),
        'phpVersion' => phpversion(),
        'environment' => app()->environment(),
    ]);
});
