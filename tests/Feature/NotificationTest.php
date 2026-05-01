<?php

use App\Models\Post;
use App\Models\User;
use App\Notifications\ConnectionRequestReceived;
use App\Notifications\PostLiked;
use Illuminate\Support\Facades\Notification;

test('sending a connection request notifies the receiver', function () {
    Notification::fake();

    $sender = User::factory()->create();
    $receiver = User::factory()->create();

    $this->actingAs($sender)
        ->post("/connections/{$receiver->id}")
        ->assertRedirect();

    Notification::assertSentTo($receiver, ConnectionRequestReceived::class, function ($n) use ($sender) {
        return $n->sender->id === $sender->id;
    });
});

test('liking a post notifies the post owner', function () {
    Notification::fake();

    $owner = User::factory()->create();
    $liker = User::factory()->create();
    $post = Post::factory()->for($owner, 'user')->create();

    $this->actingAs($liker)
        ->post("/posts/{$post->id}/like")
        ->assertRedirect();

    Notification::assertSentTo($owner, PostLiked::class, function ($n) use ($liker, $post) {
        return $n->liker->id === $liker->id && $n->post->id === $post->id;
    });
});

test('liking own post does not send notification', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->for($user, 'user')->create();

    $this->actingAs($user)
        ->post("/posts/{$post->id}/like")
        ->assertRedirect();

    Notification::assertNothingSent();
});

test('authenticated user can mark a notification as read', function () {
    $user = User::factory()->create();
    $user->notify(new ConnectionRequestReceived(User::factory()->create()));

    $notification = $user->notifications()->first();

    $this->actingAs($user)
        ->patch("/notifications/{$notification->id}/read")
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('authenticated user can mark all notifications as read', function () {
    $user = User::factory()->create();
    $sender = User::factory()->create();

    $user->notify(new ConnectionRequestReceived($sender));
    $user->notify(new ConnectionRequestReceived($sender));

    $this->actingAs($user)
        ->patch('/notifications/read-all')
        ->assertRedirect();

    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('notifications are shared with inertia', function () {
    $user = User::factory()->create();
    $user->notify(new ConnectionRequestReceived(User::factory()->create()));

    $this->actingAs($user)
        ->get('/feeds')
        ->assertInertia(fn ($page) => $page
            ->has('notifications')
            ->where('notifications.unread_count', 1)
            ->has('notifications.recent', 1)
        );
});
