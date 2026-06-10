<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdvisorController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $authId = $request->user()->id;

        $advisors = User::query()
            ->where('role', 'advisor')
            ->where('id', '!=', $authId)
            ->select('id', 'name', 'tagline', 'bio', 'avatar', 'role', 'skills', 'location')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'tagline' => $user->tagline,
                'bio' => $user->bio,
                'profile_photo_url' => $user->profile_photo_url,
                'skills' => $user->skills ?? [],
                'location' => $user->location,
                'connection_status' => $this->connectionStatus($user->id, $authId),
            ]);

        return Inertia::render('advisors', [
            'advisors' => $advisors,
        ]);
    }

    private function connectionStatus(int $userId, int $authId): ?string
    {
        $conn = Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $authId)->where('receiver_id', $userId))
            ->orWhere(fn ($q) => $q->where('sender_id', $userId)->where('receiver_id', $authId))
            ->first();

        if (! $conn) {
            return null;
        }

        if ($conn->status === 'accepted') {
            return 'accepted';
        }

        return $conn->sender_id === $authId ? 'sent_pending' : 'received_pending';
    }
}
