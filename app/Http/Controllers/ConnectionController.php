<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\User;
use App\Notifications\ConnectionRequestReceived;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConnectionController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $connected = Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $userId)->orWhere('receiver_id', $userId))
            ->where('status', 'accepted')
            ->with(['sender:id,name,role,tagline,avatar', 'receiver:id,name,role,tagline,avatar'])
            ->latest()
            ->get()
            ->map(fn (Connection $c) => $this->formatConnection($c, $userId));

        $pendingReceived = Connection::query()
            ->where('receiver_id', $userId)
            ->where('status', 'pending')
            ->with('sender:id,name,role,tagline,avatar')
            ->latest()
            ->get()
            ->map(fn (Connection $c) => $this->formatConnection($c, $userId));

        $pendingSent = Connection::query()
            ->where('sender_id', $userId)
            ->where('status', 'pending')
            ->with('receiver:id,name,role,tagline,avatar')
            ->latest()
            ->get()
            ->map(fn (Connection $c) => $this->formatConnection($c, $userId));

        $ignored = Connection::query()
            ->where('receiver_id', $userId)
            ->where('status', 'ignored')
            ->with('sender:id,name,role,tagline,avatar')
            ->latest()
            ->get()
            ->map(fn (Connection $c) => $this->formatConnection($c, $userId));

        $suggested = User::query()
            ->where('id', '!=', $userId)
            ->withoutConnectionTo($userId)
            ->select('id', 'name', 'role', 'tagline', 'avatar')
            ->inRandomOrder()
            ->limit(12)
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->role,
                'tagline' => $u->tagline,
                'profile_photo_url' => $u->profile_photo_url,
            ]);

        return Inertia::render('connections/index', [
            'connected' => $connected,
            'pending_received' => $pendingReceived,
            'pending_sent' => $pendingSent,
            'ignored' => $ignored,
            'suggested' => $suggested,
            'connection_stats' => [
                'connected' => $connected->count(),
                'pending_received' => $pendingReceived->count(),
                'pending_sent' => $pendingSent->count(),
                'ignored' => $ignored->count(),
            ],
        ]);
    }

    public function sendRequest(User $user): RedirectResponse
    {
        $authId = auth()->id();

        if ($user->id === $authId) {
            return back()->with('error', 'You cannot connect with yourself.');
        }

        $exists = Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $authId)->where('receiver_id', $user->id))
            ->orWhere(fn ($q) => $q->where('sender_id', $user->id)->where('receiver_id', $authId))
            ->exists();

        if ($exists) {
            return back()->with('error', 'A connection already exists with this user.');
        }

        Connection::create([
            'sender_id' => $authId,
            'receiver_id' => $user->id,
            'status' => 'pending',
        ]);

        $user->notify(new ConnectionRequestReceived(auth()->user()));

        return back()->with('success', 'Connection request sent.');
    }

    public function acceptRequest(User $user): RedirectResponse
    {
        $connection = Connection::query()
            ->where('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->whereIn('status', ['pending', 'ignored'])
            ->firstOrFail();

        $connection->update(['status' => 'accepted']);

        return back()->with('success', 'Connection accepted.');
    }

    public function ignoreRequest(User $user): RedirectResponse
    {
        $connection = Connection::query()
            ->where('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        $connection->update(['status' => 'ignored']);

        return back()->with('success', 'Connection request ignored.');
    }

    public function removeConnection(User $user): RedirectResponse
    {
        $authId = auth()->id();

        Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $authId)->where('receiver_id', $user->id))
            ->orWhere(fn ($q) => $q->where('sender_id', $user->id)->where('receiver_id', $authId))
            ->delete();

        return back()->with('success', 'Connection removed.');
    }

    /** @return array<string, mixed> */
    private function formatConnection(Connection $connection, int $authId): array
    {
        $other = $connection->sender_id === $authId ? $connection->receiver : $connection->sender;

        return [
            'connection_id' => $connection->id,
            'status' => $connection->status,
            'created_at' => $connection->created_at->toISOString(),
            'user' => [
                'id' => $other->id,
                'name' => $other->name,
                'role' => $other->role,
                'tagline' => $other->tagline,
                'profile_photo_url' => $other->profile_photo_url,
            ],
        ];
    }
}
