<?php

use App\Models\User;

$basePayload = [
    'fullName' => 'Test Founder',
    'email' => 'founder@example.com',
    'password' => 'Password1!',
    'tagline' => 'Building the future',
    'role' => 'founder',
    'lookingFor' => ['cofounder', 'team'],
    'stage' => 'idea',
    'interests' => ['networking', 'fundraising'],
];

test('user can register with all fields', function () use ($basePayload) {
    $response = $this->post(route('user.register'), $basePayload);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding'));

    $user = User::where('email', $basePayload['email'])->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('Test Founder')
        ->and($user->role)->toBe('founder')
        ->and($user->stage)->toBe('idea')
        ->and($user->looking_for)->toBe(['cofounder', 'team'])
        ->and($user->interests)->toBe(['networking', 'fundraising']);
});

test('user can register with optional steps skipped', function () use ($basePayload) {
    $payload = array_merge($basePayload, [
        'email' => 'skip@example.com',
        'lookingFor' => null,
        'stage' => null,
        'interests' => null,
    ]);

    $response = $this->post(route('user.register'), $payload);

    $this->assertAuthenticated();
    $response->assertRedirect(route('onboarding'));

    $user = User::where('email', 'skip@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->looking_for)->toBe([])
        ->and($user->stage)->toBe('')
        ->and($user->interests)->toBe([]);
});

test('registration fails without required fields', function () {
    $response = $this->post(route('user.register'), [
        'email' => 'missing@example.com',
        'password' => 'Password1!',
        'role' => 'founder',
    ]);

    $response->assertSessionHasErrors(['fullName']);
    $this->assertGuest();
});

test('registration fails with duplicate email', function () use ($basePayload) {
    User::factory()->create(['email' => $basePayload['email']]);

    $response = $this->post(route('user.register'), $basePayload);

    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});

test('registration fails with invalid role', function () use ($basePayload) {
    $payload = array_merge($basePayload, ['email' => 'badrole@example.com', 'role' => 'hacker']);

    $response = $this->post(route('user.register'), $payload);

    $response->assertSessionHasErrors(['role']);
    $this->assertGuest();
});
