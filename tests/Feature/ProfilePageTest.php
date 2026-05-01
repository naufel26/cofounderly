<?php

use App\Models\Connection;
use App\Models\User;

describe('own profile', function () {
    it('redirects unauthenticated users', function () {
        $this->get('/profile')->assertRedirect('/login');
    });

    it('renders own profile page', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/profile')
            ->assertInertia(
                fn ($page) => $page
                    ->component('profile/show')
                    ->where('is_own_profile', true)
                    ->where('connection_status', 'self')
            );
    });

    it('includes connection stats', function () {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Connection::create(['sender_id' => $user->id, 'receiver_id' => $other->id, 'status' => 'accepted']);

        $this->actingAs($user)
            ->get('/profile')
            ->assertInertia(
                fn ($page) => $page
                    ->where('connection_stats.connected', 1)
            );
    });
});

describe('other user profile', function () {
    it('renders another user profile', function () {
        $viewer = User::factory()->create();
        $subject = User::factory()->create();

        $this->actingAs($viewer)
            ->get("/profile/{$subject->id}")
            ->assertInertia(
                fn ($page) => $page
                    ->component('profile/show')
                    ->where('is_own_profile', false)
                    ->where('profile_user.id', $subject->id)
            );
    });

    it('returns correct connection status when pending', function () {
        $viewer = User::factory()->create();
        $subject = User::factory()->create();
        Connection::create(['sender_id' => $viewer->id, 'receiver_id' => $subject->id, 'status' => 'pending']);

        $this->actingAs($viewer)
            ->get("/profile/{$subject->id}")
            ->assertInertia(fn ($page) => $page->where('connection_status', 'sent_pending'));
    });

    it('returns correct connection status when accepted', function () {
        $viewer = User::factory()->create();
        $subject = User::factory()->create();
        Connection::create(['sender_id' => $subject->id, 'receiver_id' => $viewer->id, 'status' => 'accepted']);

        $this->actingAs($viewer)
            ->get("/profile/{$subject->id}")
            ->assertInertia(fn ($page) => $page->where('connection_status', 'accepted'));
    });

    it('returns null connection status when no connection', function () {
        $viewer = User::factory()->create();
        $subject = User::factory()->create();

        $this->actingAs($viewer)
            ->get("/profile/{$subject->id}")
            ->assertInertia(fn ($page) => $page->where('connection_status', null));
    });
});

describe('update profile', function () {
    it('saves website and experience fields', function () {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/profile/update-profile', [
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'Founder',
                'website' => 'https://example.com',
                'experience' => [
                    ['title' => 'CTO', 'company' => 'Acme', 'is_current' => true],
                ],
            ])
            ->assertRedirect('/profile');

        expect($user->fresh()->website)->toBe('https://example.com')
            ->and($user->fresh()->experience[0]['title'])->toBe('CTO');
    });
});
