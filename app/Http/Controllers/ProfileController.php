<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\Post;
use App\Models\ProfileView;
use App\Models\Status;
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
        $authId = $request->user()->id;

        if ($user->id !== $authId) {
            ProfileView::updateOrCreate(
                ['viewer_id' => $authId, 'profile_user_id' => $user->id],
                ['viewed_at' => now()],
            );
        }

        return $this->renderProfile($user, $authId);
    }

    public function viewers(Request $request): Response
    {
        $user = $request->user();

        $viewers = ProfileView::where('profile_user_id', $user->id)
            ->with('viewer:id,name,avatar,tagline,role')
            ->orderByDesc('viewed_at')
            ->paginate(20);

        $viewers->getCollection()->transform(function (ProfileView $view) {
            return [
                'viewer' => array_merge($view->viewer->toArray(), [
                    'profile_photo_url' => $view->viewer->profile_photo_url,
                ]),
                'viewed_at' => $view->viewed_at->toISOString(),
            ];
        });

        return Inertia::render('profile/viewers', [
            'viewers' => $viewers,
            'total' => ProfileView::where('profile_user_id', $user->id)->count(),
        ]);
    }

    private function renderProfile(User $profileUser, int $authId): Response
    {
        $connectionStatus = $this->connectionStatusFor($profileUser->id, $authId);

        $activeStatus = Status::active()
            ->where('user_id', $profileUser->id)
            ->with('user:id,name,avatar')
            ->latest()
            ->first();

        return Inertia::render('profile/show', [
            'profile_user' => array_merge($profileUser->toArray(), [
                'profile_photo_url' => $profileUser->profile_photo_url,
                'cover_photo_url' => $profileUser->cover_photo_url,
            ]),
            'is_own_profile' => $profileUser->id === $authId,
            'connection_status' => $connectionStatus,
            'active_status' => $activeStatus ? [
                'id' => $activeStatus->id,
                'content' => $activeStatus->content,
                'media_url' => $activeStatus->media_path
                    ? Storage::disk('public')->url($activeStatus->media_path)
                    : null,
                'expires_at' => $activeStatus->expires_at->toISOString(),
                'created_at' => $activeStatus->created_at->toISOString(),
                'user' => [
                    'id' => $profileUser->id,
                    'name' => $profileUser->name,
                    'profile_photo_url' => $profileUser->profile_photo_url,
                ],
                'is_own' => $profileUser->id === $authId,
            ] : null,
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

    public function updateCoverPhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'cover_photo' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
        ]);

        $user = $request->user();

        if ($user->cover_photo) {
            Storage::disk('public')->delete($user->cover_photo);
        }

        $path = $request->file('cover_photo')->store('covers', 'public');
        $user->update(['cover_photo' => $path]);

        return back();
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
