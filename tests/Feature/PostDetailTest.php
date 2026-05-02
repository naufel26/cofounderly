<?php

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;

test('post detail page requires authentication', function () {
    $post = Post::factory()->create();

    $this->get("/posts/{$post->id}")->assertRedirect('/login');
});

test('post detail page loads for authenticated user', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)
        ->get("/posts/{$post->id}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/show')
            ->has('post')
            ->has('post_url')
        );
});

test('post detail page includes comments', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $post->comments()->create(['user_id' => $user->id, 'content' => 'Great post!']);

    $this->actingAs($user)
        ->get("/posts/{$post->id}")
        ->assertInertia(fn ($page) => $page
            ->has('post.comments', 1)
            ->where('post.comments.0.content', 'Great post!')
        );
});

test('post detail page shows correct connection status', function () {
    $user = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->for($author, 'user')->create();
    Connection::create(['sender_id' => $user->id, 'receiver_id' => $author->id, 'status' => 'accepted']);

    $this->actingAs($user)
        ->get("/posts/{$post->id}")
        ->assertInertia(fn ($page) => $page
            ->where('post.connection_status', 'accepted')
        );
});

test('post_url contains the correct post path', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)
        ->get("/posts/{$post->id}")
        ->assertInertia(fn ($page) => $page
            ->where('post_url', url("/posts/{$post->id}"))
        );
});
