<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim($request->string('q'));

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $authId = $request->user()->id;

        $users = User::query()
            ->where('id', '!=', $authId)
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'role', 'tagline', 'avatar')
            ->limit(6)
            ->get()
            ->map(function (User $user) use ($authId) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'tagline' => $user->tagline,
                    'profile_photo_url' => $user->profile_photo_url,
                    'connection_status' => $this->connectionStatus($user->id, $authId),
                ];
            });

        return response()->json($users);
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
