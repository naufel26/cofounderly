<?php

use App\Models\Connection;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->other = User::factory()->create();
});

describe('send request', function () {
    it('creates a pending connection', function () {
        $this->actingAs($this->user)
            ->post("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::where([
            'sender_id' => $this->user->id,
            'receiver_id' => $this->other->id,
            'status' => 'pending',
        ])->exists())->toBeTrue();
    });

    it('cannot connect with yourself', function () {
        $this->actingAs($this->user)
            ->post("/connections/{$this->user->id}")
            ->assertRedirect();

        expect(Connection::where('sender_id', $this->user->id)
            ->where('receiver_id', $this->user->id)
            ->exists())->toBeFalse();
    });

    it('cannot send duplicate requests', function () {
        Connection::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $this->other->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->post("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::where('sender_id', $this->user->id)
            ->where('receiver_id', $this->other->id)
            ->count())->toBe(1);
    });

    it('cannot send request when reverse connection exists', function () {
        Connection::create([
            'sender_id' => $this->other->id,
            'receiver_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->post("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::count())->toBe(1);
    });
});

describe('accept request', function () {
    it('receiver can accept a pending request', function () {
        Connection::create([
            'sender_id' => $this->other->id,
            'receiver_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->post("/connections/{$this->other->id}/accept")
            ->assertRedirect();

        expect(Connection::where([
            'sender_id' => $this->other->id,
            'receiver_id' => $this->user->id,
            'status' => 'accepted',
        ])->exists())->toBeTrue();
    });

    it('sender cannot accept their own request', function () {
        Connection::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $this->other->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->post("/connections/{$this->other->id}/accept")
            ->assertStatus(404);
    });
});

describe('remove connection', function () {
    it('sender can cancel a pending request', function () {
        Connection::create([
            'sender_id' => $this->user->id,
            'receiver_id' => $this->other->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->delete("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::count())->toBe(0);
    });

    it('receiver can decline a pending request', function () {
        Connection::create([
            'sender_id' => $this->other->id,
            'receiver_id' => $this->user->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->user)
            ->delete("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::count())->toBe(0);
    });

    it('either party can remove an accepted connection', function () {
        Connection::create([
            'sender_id' => $this->other->id,
            'receiver_id' => $this->user->id,
            'status' => 'accepted',
        ]);

        $this->actingAs($this->user)
            ->delete("/connections/{$this->other->id}")
            ->assertRedirect();

        expect(Connection::count())->toBe(0);
    });
});
