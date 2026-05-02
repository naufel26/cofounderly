<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('feeds', [
            'status' => session('status'),
            'auth_user' => auth()->user(),

            'connection_stats' => [
                'connected' => Connection::query()
                    ->where(fn ($q) => $q->where('sender_id', $userId)->orWhere('receiver_id', $userId))
                    ->where('status', 'accepted')
                    ->count(),
                'pending_received' => Connection::query()
                    ->where('receiver_id', $userId)
                    ->where('status', 'pending')
                    ->count(),
                'pending_sent' => Connection::query()
                    ->where('sender_id', $userId)
                    ->where('status', 'pending')
                    ->count(),
            ],

            'suggested_users' => User::query()
                ->where('id', '!=', $userId)
                ->withoutConnectionTo($userId)
                ->select(['id', 'name', 'tagline', 'avatar', 'role'])
                ->limit(5)
                ->get()
                ->map(fn (User $u) => array_merge($u->toArray(), [
                    'profile_photo_url' => $u->profile_photo_url,
                ])),

            'posts' => Inertia::lazy(function () use ($userId) {
                $posts = Post::with([
                    'user',
                    'media',
                    'comments.user:id,name,avatar',
                    'originalPost.user:id,name,avatar,tagline',
                    'originalPost.media',
                ])
                    ->withCount(['likes', 'comments'])
                    ->withExists(['likes as is_liked' => fn ($q) => $q->where('user_id', $userId)])
                    ->latest()
                    ->paginate(10);

                // Append connection_status to each post in a single extra query
                $postUserIds = $posts->pluck('user_id')->unique()->filter()->values()->toArray();

                $connectionMap = empty($postUserIds) ? collect() : Connection::query()
                    ->where(fn ($q) => $q->where('sender_id', $userId)->whereIn('receiver_id', $postUserIds))
                    ->orWhere(fn ($q) => $q->where('receiver_id', $userId)->whereIn('sender_id', $postUserIds))
                    ->get()
                    ->mapWithKeys(function (Connection $conn) use ($userId) {
                        $otherId = $conn->sender_id === $userId ? $conn->receiver_id : $conn->sender_id;
                        $status = $conn->status === 'pending'
                            ? ($conn->sender_id === $userId ? 'sent_pending' : 'received_pending')
                            : $conn->status;

                        return [$otherId => $status];
                    });

                $posts->getCollection()->transform(function (Post $post) use ($connectionMap, $userId) {
                    $post->connection_status = $post->user_id === $userId
                        ? 'self'
                        : $connectionMap->get($post->user_id);

                    return $post;
                });

                return $posts;
            }),
        ]);
    }
}
