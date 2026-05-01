<?php

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Event;

test('authenticated user can list conversations', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $this->actingAs($user)
        ->getJson('/chat/conversations')
        ->assertOk()
        ->assertJsonCount(1);
});

test('user cannot access conversations unauthenticated', function () {
    $this->getJson('/chat/conversations')->assertUnauthorized();
});

test('user can start a conversation with another user', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($user)
        ->postJson("/chat/conversations/{$other->id}")
        ->assertOk()
        ->assertJsonStructure(['conversation_id', 'other_user']);

    expect(Conversation::count())->toBe(1);
});

test('starting the same conversation twice returns the same conversation', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $first = $this->actingAs($user)->postJson("/chat/conversations/{$other->id}")->json('conversation_id');
    $second = $this->actingAs($user)->postJson("/chat/conversations/{$other->id}")->json('conversation_id');

    expect($first)->toBe($second)->and(Conversation::count())->toBe(1);
});

test('participant can load messages', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);
    Message::create(['conversation_id' => $conversation->id, 'sender_id' => $other->id, 'body' => 'Hello!']);

    $this->actingAs($user)
        ->getJson("/chat/conversations/{$conversation->id}/messages")
        ->assertOk()
        ->assertJsonCount(1);
});

test('non-participant cannot load messages', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $outsider = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $this->actingAs($outsider)
        ->getJson("/chat/conversations/{$conversation->id}/messages")
        ->assertForbidden();
});

test('loading messages marks them as read', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);
    Message::create(['conversation_id' => $conversation->id, 'sender_id' => $other->id, 'body' => 'Hi!']);

    $this->actingAs($user)->getJson("/chat/conversations/{$conversation->id}/messages");

    expect(Message::whereNull('read_at')->count())->toBe(0);
});

test('participant can send a message', function () {
    Event::fake();

    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $this->actingAs($user)
        ->postJson("/chat/conversations/{$conversation->id}/messages", ['body' => 'Hey there!'])
        ->assertCreated()
        ->assertJsonFragment(['body' => 'Hey there!']);

    expect(Message::count())->toBe(1);
});

test('non-participant cannot send a message', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $outsider = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $this->actingAs($outsider)
        ->postJson("/chat/conversations/{$conversation->id}/messages", ['body' => 'Hacked!'])
        ->assertForbidden();

    expect(Message::count())->toBe(0);
});

test('message body is required', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $this->actingAs($user)
        ->postJson("/chat/conversations/{$conversation->id}/messages", ['body' => ''])
        ->assertUnprocessable();
});
