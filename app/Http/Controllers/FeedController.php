<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class FeedController extends Controller
{
    public function index()
    {
        // Later, you can fetch actual posts here
        return Inertia::render('feeds', [
            'status' => session('status'),
            // This is sent on the first visit
            'auth_user' => auth()->user(),

            // This is only fetched when requested by the frontend
            'posts' => Inertia::lazy(
                fn() =>
                Post::with([
                    'user',
                    'media',
                    'comments.user:id,name,profile_photo_url',
                    'originalPost.user:id,name,profile_photo_url,tagline',
                    'originalPost.media'
                ])
                    ->withCount(['likes', 'comments'])
                    ->withExists(['likes as is_liked' => fn($query) => $query->where('user_id', auth()->id())])
                    ->latest()
                    ->paginate(10)
            ),
        ]);
    }
}
