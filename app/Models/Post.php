<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'content', 'type', 'original_post_id', 'visibility'];

    // The author of the post
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Support for multiple images/videos
    public function media(): HasMany
    {
        return $this->hasMany(PostMedia::class);
    }

    // Engagement relationships
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // For Shared/Reposted content
    public function originalPost(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'original_post_id');
    }
}
