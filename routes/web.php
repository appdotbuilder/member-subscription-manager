<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SubscriptionPackageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Membership routes
    Route::resource('memberships', MembershipController::class);

    // Payment routes
    Route::controller(PaymentController::class)->group(function () {
        Route::get('/payment/{package}', 'index')->name('payment.index');
        Route::post('/payment', 'store')->name('payment.store');
        Route::get('/payment/callback', 'show')->name('payment.callback');
        Route::get('/payment/success/{transaction}', 'edit')->name('payment.success');
        Route::delete('/payment/cancel', 'destroy')->name('payment.cancel');
    });

    // Admin only routes (check in controller)
    Route::resource('subscription-packages', SubscriptionPackageController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';