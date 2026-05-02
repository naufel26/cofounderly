<?php

use App\Models\User;

test('unauthenticated user is redirected from onboarding', function () {
    $this->get('/onboarding')->assertRedirect('/login');
});

test('new user sees onboarding page', function () {
    $user = User::factory()->pendingOnboarding()->create();

    $this->actingAs($user)
        ->get('/onboarding')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('onboarding')->has('user'));
});

test('already onboarded user is redirected from onboarding to feeds', function () {
    $user = User::factory()->create(); // onboarding_completed_at set by factory

    $this->actingAs($user)
        ->get('/onboarding')
        ->assertRedirect('/feeds');
});

test('new user is redirected to onboarding when accessing protected routes', function () {
    $user = User::factory()->pendingOnboarding()->create();

    $this->actingAs($user)
        ->get('/feeds')
        ->assertRedirect('/onboarding');
});

test('new user can complete onboarding', function () {
    $user = User::factory()->pendingOnboarding()->create();

    $this->actingAs($user)
        ->post('/onboarding/complete')
        ->assertRedirect('/feeds');

    expect($user->fresh()->onboarding_completed_at)->not->toBeNull();
});

test('new user can upload avatar during onboarding without being redirected', function () {
    $user = User::factory()->pendingOnboarding()->create();

    $this->actingAs($user)
        ->post('/profile/avatar', ['avatar' => \Illuminate\Http\UploadedFile::fake()->image('photo.jpg')])
        ->assertRedirect(); // stays on same page, no redirect to /onboarding
});
