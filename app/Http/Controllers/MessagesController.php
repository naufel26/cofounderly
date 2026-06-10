<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessagesController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('messages', [
            'initialConversationId' => $request->integer('c') ?: null,
        ]);
    }
}
