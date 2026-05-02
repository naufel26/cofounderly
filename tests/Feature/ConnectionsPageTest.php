<?php

use App\Models\Connection;
use App\Models\User;

test('connections page requires authentication', function () {
    $this->get('/connections')->assertRedirect('/login');
});

test('connections page loads for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/connections')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('connections/index')
            ->has('connected')
            ->has('pending_received')
            ->has('pending_sent')
            ->has('ignored')
            ->has('suggested')
            ->has('connection_stats')
        );
});

test('connections page shows accepted connections', function () {
    $user = User::factory()->create();
    $friend = User::factory()->create(['name' => 'Jane Doe']);
    Connection::create(['sender_id' => $user->id, 'receiver_id' => $friend->id, 'status' => 'accepted']);

    $this->actingAs($user)
        ->get('/connections')
        ->assertInertia(fn ($page) => $page
            ->has('connected', 1)
            ->where('connected.0.user.name', 'Jane Doe')
        );
});

test('connections page shows received pending requests', function () {
    $user = User::factory()->create();
    $requester = User::factory()->create(['name' => 'John Sender']);
    Connection::create(['sender_id' => $requester->id, 'receiver_id' => $user->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->get('/connections')
        ->assertInertia(fn ($page) => $page
            ->has('pending_received', 1)
            ->where('pending_received.0.user.name', 'John Sender')
        );
});

test('user can ignore a connection request', function () {
    $user = User::factory()->create();
    $requester = User::factory()->create();
    Connection::create(['sender_id' => $requester->id, 'receiver_id' => $user->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->post("/connections/{$requester->id}/ignore")
        ->assertRedirect();

    expect(Connection::where('sender_id', $requester->id)->where('receiver_id', $user->id)->value('status'))
        ->toBe('ignored');
});

test('user can accept an ignored request', function () {
    $user = User::factory()->create();
    $requester = User::factory()->create();
    Connection::create(['sender_id' => $requester->id, 'receiver_id' => $user->id, 'status' => 'ignored']);

    $this->actingAs($user)
        ->post("/connections/{$requester->id}/accept")
        ->assertRedirect();

    expect(Connection::where('sender_id', $requester->id)->where('receiver_id', $user->id)->value('status'))
        ->toBe('accepted');
});

test('suggested users do not include already-connected users', function () {
    $user = User::factory()->create();
    $friend = User::factory()->create();
    Connection::create(['sender_id' => $user->id, 'receiver_id' => $friend->id, 'status' => 'accepted']);

    $this->actingAs($user)
        ->get('/connections')
        ->assertInertia(fn ($page) => $page
            ->where('suggested', fn ($suggested) => collect($suggested)->pluck('id')->doesntContain($friend->id))
        );
});
