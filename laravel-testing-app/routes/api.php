<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/health', function () {
    return response()->json(['status' => 'healthy']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
});

Route::prefix('errors')->group(function () {
    Route::get('/undefined-variable', [\App\Http\Controllers\ErrorController::class, 'undefinedVariable']);
    Route::get('/null-reference', [\App\Http\Controllers\ErrorController::class, 'nullReference']);
    Route::get('/array-key', [\App\Http\Controllers\ErrorController::class, 'arrayKey']);
    Route::post('/json', [\App\Http\Controllers\ErrorController::class, 'jsonDecode']);
    Route::get('/database', [\App\Http\Controllers\ErrorController::class, 'database']);
    Route::get('/env', [\App\Http\Controllers\ErrorController::class, 'envMissing']);
    Route::get('/file', [\App\Http\Controllers\ErrorController::class, 'fileNotFound']);
    Route::get('/queue', [\App\Http\Controllers\ErrorController::class, 'queueFailure']);
    Route::get('/cache', [\App\Http\Controllers\ErrorController::class, 'cacheFailure']);
});

Route::prefix('performance')->group(function () {
    Route::get('/cpu', [\App\Http\Controllers\PerformanceController::class, 'cpu']);
    Route::get('/memory', [\App\Http\Controllers\PerformanceController::class, 'memory']);
    Route::get('/large-json', [\App\Http\Controllers\PerformanceController::class, 'largeJson']);
    Route::get('/slow-query', [\App\Http\Controllers\PerformanceController::class, 'slowQuery']);
    Route::get('/n-plus-one/broken', [\App\Http\Controllers\PerformanceController::class, 'nPlusOneBroken']);
    Route::get('/n-plus-one/fixed', [\App\Http\Controllers\PerformanceController::class, 'nPlusOneFixed']);
});

Route::prefix('incidents')->group(function () {
    Route::post('/mass-assignment/broken', [\App\Http\Controllers\IncidentController::class, 'massAssignmentBroken']);
    Route::post('/mass-assignment/fixed', [\App\Http\Controllers\IncidentController::class, 'massAssignmentFixed']);
    Route::get('/transaction', [\App\Http\Controllers\IncidentController::class, 'transactionRollback']);
    Route::post('/file-upload', [\App\Http\Controllers\IncidentController::class, 'fileUpload']);
    Route::get('/race-condition/broken', [\App\Http\Controllers\IncidentController::class, 'raceConditionBroken']);
    Route::get('/race-condition/fixed', [\App\Http\Controllers\IncidentController::class, 'raceConditionFixed']);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);
