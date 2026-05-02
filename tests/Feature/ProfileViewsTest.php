<?php

use App\Models\ProfileView;
use App\Models\User;

test('viewing another users profile records a view', function () {
    $viewer = User::factory()->create();
    $profileUser = User::factory()->create();

    $this->actingAs($viewer)->get("/profile/{$profileUser->id}");

    expect(ProfileView::where('viewer_id', $viewer->id)->where('profile_user_id', $profileUser->id)->exists())->toBeTrue();
});

test('viewing own profile does not record a view', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/profile');

    expect(ProfileView::where('viewer_id', $user->id)->where('profile_user_id', $user->id)->exists())->toBeFalse();
});

test('revisiting a profile updates the timestamp rather than creating duplicates', function () {
    $viewer = User::factory()->create();
    $profileUser = User::factory()->create();

    $this->actingAs($viewer)->get("/profile/{$profileUser->id}");
    $this->actingAs($viewer)->get("/profile/{$profileUser->id}");

    expect(ProfileView::where('viewer_id', $viewer->id)->where('profile_user_id', $profileUser->id)->count())->toBe(1);
});

test('viewers page requires authentication', function () {
    $this->get('/profile/viewers')->assertRedirect('/login');
});

test('viewers page lists users who viewed the authenticated users profile', function () {
    $profileUser = User::factory()->create();
    $viewer1 = User::factory()->create();
    $viewer2 = User::factory()->create();

    ProfileView::create(['viewer_id' => $viewer1->id, 'profile_user_id' => $profileUser->id, 'viewed_at' => now()]);
    ProfileView::create(['viewer_id' => $viewer2->id, 'profile_user_id' => $profileUser->id, 'viewed_at' => now()]);

    $this->actingAs($profileUser)
        ->get('/profile/viewers')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('profile/viewers')
            ->has('viewers.data', 2)
            ->where('total', 2)
        );
});

test('profile views count is shared in inertia props', function () {
    $profileUser = User::factory()->create();
    $viewer = User::factory()->create();

    ProfileView::create(['viewer_id' => $viewer->id, 'profile_user_id' => $profileUser->id, 'viewed_at' => now()]);

    $this->actingAs($profileUser)
        ->get('/feeds')
        ->assertInertia(fn ($page) => $page->where('profile_views_count', 1));
});
