<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Status;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StatusController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $connectedIds = Connection::where(function ($q) use ($userId) {
            $q->where('sender_id', $userId)->orWhere('receiver_id', $userId);
        })
            ->where('status', 'accepted')
            ->get()
            ->map(fn ($c) => $c->sender_id === $userId ? $c->receiver_id : $c->sender_id)
            ->push($userId);

        $statuses = Status::active()
            ->whereIn('user_id', $connectedIds)
            ->with('user:id,name,avatar')
            ->latest()
            ->get()
            ->map(fn (Status $s) => $this->formatStatus($s, $userId));

        return response()->json($statuses);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'content' => ['nullable', 'string', 'max:500', 'required_without:media'],
            'media' => ['nullable', 'image', 'max:8192'],
        ]);

        Status::where('user_id', $request->user()->id)->delete();

        $mediaPath = $request->hasFile('media')
            ? $request->file('media')->store('statuses', 'public')
            : null;

        $status = Status::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'media_path' => $mediaPath,
            'expires_at' => now()->addHours(24),
        ]);

        $status->load('user:id,name,avatar');

        return response()->json($this->formatStatus($status, $request->user()->id), 201);
    }

    public function destroy(Request $request, Status $status): JsonResponse
    {
        abort_unless($status->user_id === $request->user()->id, 403);
        $status->delete();

        return response()->json(null, 204);
    }

    /** @return array<string, mixed> */
    private function formatStatus(Status $status, int $authId): array
    {
        return [
            'id' => $status->id,
            'content' => $status->content,
            'media_url' => $status->media_path
                ? Storage::disk('public')->url($status->media_path)
                : null,
            'expires_at' => $status->expires_at->toISOString(),
            'created_at' => $status->created_at->toISOString(),
            'user' => [
                'id' => $status->user->id,
                'name' => $status->user->name,
                'profile_photo_url' => $status->user->profile_photo_url,
            ],
            'is_own' => $status->user_id === $authId,
        ];
    }
}
