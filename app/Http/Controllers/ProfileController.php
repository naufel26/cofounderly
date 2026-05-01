<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        return $this->renderProfile($request->user(), $request->user()->id);
    }

    public function showUser(User $user, Request $request): Response
    {
        return $this->renderProfile($user, $request->user()->id);
    }

    private function renderProfile(User $profileUser, int $authId): Response
    {
        $connectionStatus = $this->connectionStatusFor($profileUser->id, $authId);

        return Inertia::render('profile/show', [
            'profile_user' => array_merge($profileUser->toArray(), [
                'profile_photo_url' => $profileUser->profile_photo_url,
            ]),
            'is_own_profile' => $profileUser->id === $authId,
            'connection_status' => $connectionStatus,
            'connection_stats' => [
                'connected' => Connection::query()
                    ->where(fn ($q) => $q->where('sender_id', $profileUser->id)->orWhere('receiver_id', $profileUser->id))
                    ->where('status', 'accepted')
                    ->count(),
            ],
            'posts' => Inertia::lazy(function () use ($profileUser, $authId, $connectionStatus) {
                $posts = Post::where('user_id', $profileUser->id)
                    ->with([
                        'user',
                        'media',
                        'comments.user:id,name,avatar',
                        'originalPost.user:id,name,avatar,tagline',
                        'originalPost.media',
                    ])
                    ->withCount(['likes', 'comments'])
                    ->withExists(['likes as is_liked' => fn ($q) => $q->where('user_id', $authId)])
                    ->latest()
                    ->paginate(10);

                $posts->getCollection()->transform(function (Post $post) use ($connectionStatus) {
                    $post->connection_status = $connectionStatus;

                    return $post;
                });

                return $posts;
            }),
        ]);
    }

    private function connectionStatusFor(int $profileUserId, int $authId): ?string
    {
        if ($profileUserId === $authId) {
            return 'self';
        }

        $conn = Connection::query()
            ->where(fn ($q) => $q->where('sender_id', $authId)->where('receiver_id', $profileUserId))
            ->orWhere(fn ($q) => $q->where('sender_id', $profileUserId)->where('receiver_id', $authId))
            ->first();

        if (! $conn) {
            return null;
        }

        if ($conn->status === 'accepted') {
            return 'accepted';
        }

        return $conn->sender_id === $authId ? 'sent_pending' : 'received_pending';
    }

    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $path]);
        }

        return back();
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'tagline' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'bio' => ['nullable', 'string', 'max:300'],
            'professional_summary' => ['nullable', 'string', 'max:500'],
            'role' => ['required', 'string'],
            'looking_for' => ['nullable', 'string'],
            'business_stage' => ['nullable', 'string'],
            'skills' => ['nullable', 'array'],
            'experience' => ['nullable', 'array'],
            'experience.*.title' => ['required', 'string', 'max:255'],
            'experience.*.company' => ['required', 'string', 'max:255'],
            'experience.*.from_date' => ['nullable', 'string', 'max:50'],
            'experience.*.to_date' => ['nullable', 'string', 'max:50'],
            'experience.*.is_current' => ['boolean'],
            'experience.*.description' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();
        $user->fill($request->except('_token'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.show');
    }
}
