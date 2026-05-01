<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentMentioned extends Notification
{
    use Queueable;

    public function __construct(public User $mentioner, public Post $post) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'comment_mentioned',
            'title' => "{$this->mentioner->name} mentioned you in a comment",
            'actor_name' => $this->mentioner->name,
            'actor_photo' => $this->mentioner->profile_photo_url,
            'actor_id' => $this->mentioner->id,
            'post_id' => $this->post->id,
            'action_url' => '/feeds',
        ];
    }
}
