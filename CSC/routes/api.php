<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Route للاختبار البسيط
Route::get('/test', function() {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Route لاختبار Firebase
Route::get('/firebase-status', function() {
    try {
        $service = app(\App\Services\FirebaseService::class);
        $test = $service->testConnection();
        
        return response()->json([
            'firebase' => $test,
            'server' => 'Laravel ' . app()->version(),
            'time' => now()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'firebase' => ['connected' => false, 'error' => $e->getMessage()],
            'server' => 'Laravel ' . app()->version()
        ]);
    }
});

// CORS headers - مهم جداً للهاتف
Route::middleware(['cors'])->group(function () {
    Route::prefix('v1')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('register', [AuthController::class, 'register']);
            Route::post('login', [AuthController::class, 'login']);
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('user', [AuthController::class, 'getUser']);
            Route::get('test', [AuthController::class, 'test']); // أضف هذا
        });
    });
});

// أو إذا لم يكن لديك CORS middleware، استخدم هذا:
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'getUser']);
        Route::get('test', [AuthController::class, 'test']);
    });
});