<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ConnectionRequestReceived extends Notification
{
    use Queueable;

    public function __construct(public User $sender) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'connection_request',
            'title' => "{$this->sender->name} sent you a connection request",
            'actor_name' => $this->sender->name,
            'actor_photo' => $this->sender->profile_photo_url,
            'actor_id' => $this->sender->id,
            'action_url' => '/feeds',
        ];
    }
}
