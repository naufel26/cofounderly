<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim($request->string('q'));

        if (strlen($query) < 2) {
            return response()->json(['people' => [], 'posts' => []]);
        }

        $authId = $request->user()->id;

        $people = User::query()
            ->where('id', '!=', $authId)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('tagline', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'role', 'tagline', 'avatar')
            ->limit(5)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'tagline' => $user->tagline,
                'profile_photo_url' => $user->profile_photo_url,
                'connection_status' => $this->connectionStatus($user->id, $authId),
            ]);

        $posts = Post::query()
            ->whereNotNull('content')
            ->where('content', 'like', "%{$query}%")
            ->with('user:id,name,avatar,role')
            ->select('id', 'content', 'user_id', 'created_at')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'excerpt' => Str::limit($post->content, 100),
                'author_name' => $post->user->name,
                'author_photo' => $post->user->profile_photo_url,
                'author_role' => $post->user->role,
            ]);

        return response()->json(['people' => $people, 'posts' => $posts]);
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
