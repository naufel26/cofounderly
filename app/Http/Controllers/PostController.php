<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;
use App\Notifications\CommentMentioned;
use App\Notifications\PostLiked;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function show(Post $post): Response
    {
        $userId = auth()->id();

        $post->load([
            'user',
            'media',
            'comments' => fn ($q) => $q->with('user:id,name,avatar')->latest(),
            'originalPost.user:id,name,avatar,tagline',
            'originalPost.media',
        ]);

        $post->loadCount(['likes', 'comments']);
        $post->loadExists(['likes as is_liked' => fn ($q) => $q->where('user_id', $userId)]);

        $conn = Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $userId)->where('receiver_id', $post->user_id))
            ->orWhere(fn ($q) => $q->where('sender_id', $post->user_id)->where('receiver_id', $userId))
            ->first();

        $post->connection_status = $post->user_id === $userId
            ? 'self'
            : ($conn
                ? ($conn->status === 'accepted' ? 'accepted' : ($conn->sender_id === $userId ? 'sent_pending' : 'received_pending'))
                : null);

        return Inertia::render('posts/show', [
            'post' => $post,
            'post_url' => url('/posts/'.$post->id),
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required_without:media|string|nullable',
            'media.*' => 'nullable|image|max:5120', // 5MB max per image
            'type' => 'required|in:text,media,share',
            'original_post_id' => 'nullable|exists:posts,id',
        ]);

        $post = $request->user()->posts()->create([
            'content' => $validated['content'],
            'type' => $validated['type'],
            'original_post_id' => $validated['original_post_id'] ?? null,
        ]);

        // Handle multiple media uploads
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('post-media', 'public');
                $post->media()->create([
                    'file_path' => $path,
                    'file_type' => 'image',
                ]);
            }
        }

        return back()->with('success', 'Post created successfully!');
    }

    public function toggleLike(Post $post)
    {
        $like = $post->likes()->where('user_id', auth()->id())->first();

        if ($like) {
            $like->delete();
        } else {
            $post->likes()->create(['user_id' => auth()->id()]);

            if ($post->user_id !== auth()->id()) {
                $post->user->notify(new PostLiked(auth()->user(), $post));
            }
        }

        return back();
    }

    public function storeComment(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $post->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        preg_match_all('/@(\w+)/', $request->content, $matches);
        foreach (array_unique($matches[1]) as $username) {
            $mentioned = User::where('name', $username)->first();
            if ($mentioned && $mentioned->id !== auth()->id()) {
                $mentioned->notify(new CommentMentioned(auth()->user(), $post));
            }
        }

        return back();
    }
}
