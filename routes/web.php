<?php

use App\Http\Controllers\Auth\UserRegisterController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConnectionController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\NotificationController;
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
    Route::get('/profile/{user}', [ProfileController::class, 'showUser'])->name('profile.user');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::post('/profile/update-profile', [ProfileController::class, 'updateProfile'])->name('profile.updateProfile');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike'])->name('posts.like');
    Route::post('/posts/{post}/comments', [PostController::class, 'storeComment'])->name('posts.comments.store');

    Route::post('/connections/{user}', [ConnectionController::class, 'sendRequest'])->name('connections.send');
    Route::post('/connections/{user}/accept', [ConnectionController::class, 'acceptRequest'])->name('connections.accept');
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
