<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => Storage::fake('public'));

test('cover photo upload requires authentication', function () {
    $this->post('/profile/cover-photo')->assertRedirect('/login');
});

test('authenticated user can upload a cover photo', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('cover.jpg', 1200, 400);

    $this->actingAs($user)
        ->post('/profile/cover-photo', ['cover_photo' => $file])
        ->assertRedirect();

    expect($user->fresh()->cover_photo)->not->toBeNull();
    Storage::disk('public')->assertExists($user->fresh()->cover_photo);
});

test('cover photo must be a valid image', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/profile/cover-photo', ['cover_photo' => 'not-a-file'])
        ->assertSessionHasErrors('cover_photo');
});

test('uploading a new cover photo replaces the old one', function () {
    $user = User::factory()->create();
    $first = UploadedFile::fake()->image('first.jpg');
    $second = UploadedFile::fake()->image('second.jpg');

    $this->actingAs($user)->post('/profile/cover-photo', ['cover_photo' => $first]);
    $firstPath = $user->fresh()->cover_photo;

    $this->actingAs($user)->post('/profile/cover-photo', ['cover_photo' => $second]);
    $secondPath = $user->fresh()->cover_photo;

    expect($secondPath)->not->toBe($firstPath);
    Storage::disk('public')->assertMissing($firstPath);
    Storage::disk('public')->assertExists($secondPath);
});

test('cover_photo_url is included in profile page props', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/profile')
        ->assertInertia(fn ($page) => $page
            ->component('profile/show')
            ->has('profile_user.cover_photo_url')
        );
});
