<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    //
    /**
     * Store a newly created post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required_without:media|string|nullable',
            'media.*' => 'nullable|image|max:5120', // 5MB max per image
            'type'    => 'required|in:text,media,share',
            'original_post_id' => 'nullable|exists:posts,id',
        ]);

        $post = $request->user()->posts()->create([
            'content' => $validated['content'],
            'type'    => $validated['type'],
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
            $like->delete(); // Unlike
        } else {
            $post->likes()->create(['user_id' => auth()->id()]); // Like
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

        // return back() tells Inertia to seamlessly refresh the props (including the new comment)
        return back();
    }
}
