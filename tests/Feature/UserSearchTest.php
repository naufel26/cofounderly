<?php

use App\Models\Connection;
use App\Models\User;

test('search requires at least two characters', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/search/users?q=a')
        ->assertOk()
        ->assertJson([]);
});

test('search returns matching users', function () {
    $user = User::factory()->create();
    $alice = User::factory()->create(['name' => 'Alice Founder']);
    User::factory()->create(['name' => 'Bob Smith']);

    $this->actingAs($user)
        ->getJson('/search/users?q=Alice')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['name' => 'Alice Founder']);
});

test('search does not return the authenticated user', function () {
    $user = User::factory()->create(['name' => 'Alice Smith']);

    $this->actingAs($user)
        ->getJson('/search/users?q=Alice')
        ->assertOk()
        ->assertJson([]);
});

test('search returns connection status for results', function () {
    $user = User::factory()->create();
    $friend = User::factory()->create(['name' => 'Connected Person']);
    Connection::create(['sender_id' => $user->id, 'receiver_id' => $friend->id, 'status' => 'accepted']);

    $this->actingAs($user)
        ->getJson('/search/users?q=Connected')
        ->assertOk()
        ->assertJsonFragment(['connection_status' => 'accepted']);
});

test('search requires authentication', function () {
    $this->getJson('/search/users?q=Alice')
        ->assertUnauthorized();
});
