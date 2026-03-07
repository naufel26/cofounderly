<?php

use App\Http\Controllers\Auth\UserRegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\ProfileController;

Route::get('/laravel', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/', function () {
    return Inertia::render('index'); // Maps to resources/js/Pages/Index.tsx
})->name('index');

Route::get('signup', function () {
    return Inertia::render('auth/signup'); // Maps to resources/js/Pages/Index.tsx
})->name('signup');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::post('user-register', [UserRegisterController::class, 'store'])
    ->name('user.register');

Route::get('/feeds', [FeedController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('feeds');

// Protect these routes with auth middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::post('/profile/update-profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
});

require __DIR__ . '/settings.php';
