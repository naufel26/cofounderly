<?php

use App\Http\Controllers\Auth\UserRegisterController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\UserSearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/laravel', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/', function () {
    return Inertia::render('index');
})->name('index');

Route::get('signup', function () {
    return Inertia::render('auth/signup');
})->name('signup');

Route::post('user-register', [UserRegisterController::class, 'store'])->name('user.register');

// Onboarding (auth only, no EnsureOnboarded so new users can reach it)
Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding', [OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding/complete', [OnboardingController::class, 'complete'])->name('onboarding.complete');
    // Avatar/cover upload allowed during onboarding
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::post('/profile/cover-photo', [ProfileController::class, 'updateCoverPhoto'])->name('profile.cover.update');
});

// All main app routes — require auth + completed onboarding
Route::middleware(['auth', App\Http\Middleware\EnsureOnboarded::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/feeds', [FeedController::class, 'index'])->name('feeds');

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/viewers', [ProfileController::class, 'viewers'])->name('profile.viewers');
    Route::get('/profile/{user}', [ProfileController::class, 'showUser'])->name('profile.user');
    Route::post('/profile/update-profile', [ProfileController::class, 'updateProfile'])->name('profile.updateProfile');

    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike'])->name('posts.like');
    Route::post('/posts/{post}/comments', [PostController::class, 'storeComment'])->name('posts.comments.store');

    Route::get('/connections', [ConnectionController::class, 'index'])->name('connections.index');
    Route::post('/connections/{user}', [ConnectionController::class, 'sendRequest'])->name('connections.send');
    Route::post('/connections/{user}/accept', [ConnectionController::class, 'acceptRequest'])->name('connections.accept');
    Route::post('/connections/{user}/ignore', [ConnectionController::class, 'ignoreRequest'])->name('connections.ignore');
    Route::delete('/connections/{user}', [ConnectionController::class, 'removeConnection'])->name('connections.remove');

    Route::get('/statuses', [StatusController::class, 'index'])->name('statuses.index');
    Route::post('/statuses', [StatusController::class, 'store'])->name('statuses.store');
    Route::delete('/statuses/{status}', [StatusController::class, 'destroy'])->name('statuses.destroy');

    Route::get('/search/users', UserSearchController::class)->name('users.search');

    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [ChatController::class, 'conversations'])->name('chat.conversations');
        Route::post('/conversations/{user}', [ChatController::class, 'startConversation'])->name('chat.start');
        Route::get('/conversations/{conversation}/messages', [ChatController::class, 'messages'])->name('chat.messages');
        Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage'])->name('chat.send');
    });
});

require __DIR__.'/settings.php';
