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

test('conversations include other user online status', function () {
    $user = User::factory()->create();
    $onlineUser = User::factory()->create(['last_seen_at' => now()->subMinutes(2)]);
    $offlineUser = User::factory()->create(['last_seen_at' => now()->subMinutes(10)]);

    $conv1 = Conversation::create();
    $conv1->users()->attach([$user->id, $onlineUser->id]);

    $conv2 = Conversation::create();
    $conv2->users()->attach([$user->id, $offlineUser->id]);

    $response = $this->actingAs($user)->getJson('/chat/conversations')->assertOk()->json();

    $conv1Data = collect($response)->firstWhere('id', $conv1->id);
    $conv2Data = collect($response)->firstWhere('id', $conv2->id);

    expect($conv1Data['other_user']['is_online'])->toBeTrue();
    expect($conv2Data['other_user']['is_online'])->toBeFalse();
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
        ->assertJsonStructure(['messages', 'other_last_read_at'])
        ->assertJsonCount(1, 'messages');
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

test('other_last_read_at reflects when other user read my messages', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);

    $msg = Message::create(['conversation_id' => $conversation->id, 'sender_id' => $user->id, 'body' => 'Hello!']);
    $msg->update(['read_at' => now()]);

    $response = $this->actingAs($user)
        ->getJson("/chat/conversations/{$conversation->id}/messages")
        ->assertOk()
        ->json();

    expect($response['other_last_read_at'])->not->toBeNull();
});

test('other_last_read_at is null when no messages have been read', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $conversation = Conversation::create();
    $conversation->users()->attach([$user->id, $other->id]);
    Message::create(['conversation_id' => $conversation->id, 'sender_id' => $user->id, 'body' => 'Hello!']);

    $response = $this->actingAs($user)
        ->getJson("/chat/conversations/{$conversation->id}/messages")
        ->assertOk()
        ->json();

    expect($response['other_last_read_at'])->toBeNull();
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

test('messages page requires authentication', function () {
    $this->get('/messages')->assertRedirect('/login');
});

test('messages page renders for authenticated user', function () {
    $user = User::factory()->create(['onboarding_completed_at' => now()]);

    $this->actingAs($user)
        ->get('/messages')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('messages'));
});

test('messages page accepts initial conversation id', function () {
    $user = User::factory()->create(['onboarding_completed_at' => now()]);

    $this->actingAs($user)
        ->get('/messages?c=42')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('messages')
            ->where('initialConversationId', 42)
        );
});
