<?php

namespace App\Http\Controllers;

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
        ]);

        $post = $request->user()->posts()->create([
            'content' => $validated['content'],
            'type'    => $validated['type'],
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
}
