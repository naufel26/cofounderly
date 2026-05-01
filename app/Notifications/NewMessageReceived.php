<?php

namespace App\Notifications;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMessageReceived extends Notification
{
    use Queueable;

    public function __construct(public User $sender, public Conversation $conversation) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'new_message',
            'title' => "{$this->sender->name} sent you a message",
            'actor_name' => $this->sender->name,
            'actor_photo' => $this->sender->profile_photo_url,
            'actor_id' => $this->sender->id,
            'conversation_id' => $this->conversation->id,
            'action_url' => '/feeds',
        ];
    }
}
