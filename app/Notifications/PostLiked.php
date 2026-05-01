<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostLiked extends Notification
{
    use Queueable;

    public function __construct(public User $liker, public Post $post) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'post_liked',
            'title' => "{$this->liker->name} liked your post",
            'actor_name' => $this->liker->name,
            'actor_photo' => $this->liker->profile_photo_url,
            'actor_id' => $this->liker->id,
            'post_id' => $this->post->id,
            'action_url' => '/feeds',
        ];
    }
}
