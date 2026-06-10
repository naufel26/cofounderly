<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageReceived;
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = $request->user()
            ->conversations()
            ->with(['users:id,name,avatar,last_seen_at', 'latestMessage'])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->whereNull('read_at')->where('sender_id', '!=', $userId);
            }])
            ->latest('updated_at')
            ->get()
            ->map(function (Conversation $conversation) use ($userId) {
                $other = $conversation->users->firstWhere('id', '!=', $userId);

                return [
                    'id' => $conversation->id,
                    'other_user' => $other ? [
                        'id' => $other->id,
                        'name' => $other->name,
                        'profile_photo_url' => $other->profile_photo_url,
                        'is_online' => $other->last_seen_at && $other->last_seen_at->gt(now()->subMinutes(5)),
                    ] : null,
                    'latest_message' => $conversation->latestMessage ? [
                        'body' => $conversation->latestMessage->body,
                        'created_at' => $conversation->latestMessage->created_at->toISOString(),
                        'is_mine' => $conversation->latestMessage->sender_id === $userId,
                    ] : null,
                    'unread_count' => $conversation->unread_count,
                ];
            });

        return response()->json($conversations);
    }

    public function startConversation(Request $request, User $user): JsonResponse
    {
        $existing = Conversation::query()
            ->whereHas('users', fn ($q) => $q->where('user_id', $request->user()->id))
            ->whereHas('users', fn ($q) => $q->where('user_id', $user->id))
            ->first();

        if (! $existing) {
            $existing = Conversation::create();
            $existing->users()->attach([$request->user()->id, $user->id]);
        }

        return response()->json([
            'conversation_id' => $existing->id,
            'other_user' => [
                'id' => $user->id,
                'name' => $user->name,
                'profile_photo_url' => $user->profile_photo_url,
                'is_online' => $user->last_seen_at && $user->last_seen_at->gt(now()->subMinutes(5)),
            ],
        ]);
    }

    public function messages(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        abort_unless(
            $conversation->users()->where('user_id', $userId)->exists(),
            403
        );

        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()
            ->with('sender:id,name,avatar')
            ->latest()
            ->limit(50)
            ->get()
            ->reverse()
            ->values()
            ->map(fn (Message $message) => [
                'id' => $message->id,
                'body' => $message->body,
                'sender_id' => $message->sender_id,
                'created_at' => $message->created_at->toISOString(),
                'read_at' => $message->read_at?->toISOString(),
                'sender' => [
                    'id' => $message->sender->id,
                    'name' => $message->sender->name,
                    'profile_photo_url' => $message->sender->profile_photo_url,
                ],
            ]);

        $otherLastReadAt = $conversation->messages()
            ->where('sender_id', $userId)
            ->whereNotNull('read_at')
            ->max('read_at');

        return response()->json([
            'messages' => $messages,
            'other_last_read_at' => $otherLastReadAt,
        ]);
    }

    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        abort_unless(
            $conversation->users()->where('user_id', $userId)->exists(),
            403
        );

        $request->validate(['body' => ['required', 'string', 'max:5000']]);

        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'body' => $request->body,
        ]);

        $message->load('sender:id,name,avatar');

        try {
            broadcast(new MessageSent($message))->toOthers();
        } catch (BroadcastException) {
            // Reverb may not be running; message is saved regardless
        }

        $conversation->users()
            ->where('user_id', '!=', $userId)
            ->get()
            ->each(fn ($recipient) => $recipient->notify(new NewMessageReceived($request->user(), $conversation)));

        $conversation->touch();

        return response()->json([
            'id' => $message->id,
            'body' => $message->body,
            'sender_id' => $message->sender_id,
            'created_at' => $message->created_at->toISOString(),
            'read_at' => null,
            'sender' => [
                'id' => $message->sender->id,
                'name' => $message->sender->name,
                'profile_photo_url' => $message->sender->profile_photo_url,
            ],
        ], 201);
    }
}
