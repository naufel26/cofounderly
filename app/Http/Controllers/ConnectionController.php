<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\User;
use App\Notifications\ConnectionRequestReceived;
use Illuminate\Http\RedirectResponse;

class ConnectionController extends Controller
{
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
            ->where('status', 'pending')
            ->firstOrFail();

        $connection->update(['status' => 'accepted']);

        return back()->with('success', 'Connection accepted.');
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
}
