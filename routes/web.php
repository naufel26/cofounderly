<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('index', function () {
    return Inertia::render('index'); // Maps to resources/js/Pages/Index.tsx
})->name('index');

Route::get('signup', function () {
    return Inertia::render('auth/signup'); // Maps to resources/js/Pages/Index.tsx
})->name('signup');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';
