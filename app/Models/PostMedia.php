<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class PostMedia extends Model
{
    //
    protected $fillable = ['file_path', 'file_type', 'order',];
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
