<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return \App\Models\Conversation::query()
        ->whereKey($conversationId)
        ->whereHas('users', fn ($q) => $q->where('user_id', $user->id))
        ->exists();
});
