<?php

use App\Models\Connection;
use App\Models\Status;
use App\Models\User;

test('authenticated user can list statuses from connected users and self', function () {
    $user = User::factory()->create();
    $friend = User::factory()->create();
    $stranger = User::factory()->create();

    Connection::create(['sender_id' => $user->id, 'receiver_id' => $friend->id, 'status' => 'accepted']);

    Status::create(['user_id' => $friend->id, 'content' => 'Hello!', 'expires_at' => now()->addHours(12)]);
    Status::create(['user_id' => $stranger->id, 'content' => 'Hidden', 'expires_at' => now()->addHours(12)]);

    $this->actingAs($user)
        ->getJson('/statuses')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['content' => 'Hello!']);
});

test('expired statuses are not returned', function () {
    $user = User::factory()->create();

    Status::create(['user_id' => $user->id, 'content' => 'Old', 'expires_at' => now()->subMinute()]);
    Status::create(['user_id' => $user->id, 'content' => 'Fresh', 'expires_at' => now()->addHours(23)]);

    $this->actingAs($user)
        ->getJson('/statuses')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['content' => 'Fresh']);
});

test('user can create a status', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/statuses', ['content' => 'My first update!'])
        ->assertCreated()
        ->assertJsonFragment(['content' => 'My first update!', 'is_own' => true]);

    expect(Status::where('user_id', $user->id)->count())->toBe(1);
});

test('creating a status replaces the previous one', function () {
    $user = User::factory()->create();
    Status::create(['user_id' => $user->id, 'content' => 'Old update', 'expires_at' => now()->addHours(12)]);

    $this->actingAs($user)
        ->postJson('/statuses', ['content' => 'New update'])
        ->assertCreated();

    expect(Status::where('user_id', $user->id)->count())->toBe(1)
        ->and(Status::where('user_id', $user->id)->first()->content)->toBe('New update');
});

test('status requires content or media', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/statuses', [])
        ->assertUnprocessable();
});

test('owner can delete their own status', function () {
    $user = User::factory()->create();
    $status = Status::create(['user_id' => $user->id, 'content' => 'Delete me', 'expires_at' => now()->addHours(12)]);

    $this->actingAs($user)
        ->deleteJson("/statuses/{$status->id}")
        ->assertNoContent();

    expect(Status::find($status->id))->toBeNull();
});

test('non-owner cannot delete a status', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $status = Status::create(['user_id' => $other->id, 'content' => 'Mine', 'expires_at' => now()->addHours(12)]);

    $this->actingAs($user)
        ->deleteJson("/statuses/{$status->id}")
        ->assertForbidden();
});

test('own status appears in own listing', function () {
    $user = User::factory()->create();
    Status::create(['user_id' => $user->id, 'content' => 'My update', 'expires_at' => now()->addHours(12)]);

    $this->actingAs($user)
        ->getJson('/statuses')
        ->assertOk()
        ->assertJsonFragment(['is_own' => true]);
});
