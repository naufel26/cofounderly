<?php

namespace App\Http\Middleware;

use App\Models\ProfileView;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'profile_views_count' => function () use ($request) {
                if (! $request->user()) {
                    return 0;
                }

                return ProfileView::where('profile_user_id', $request->user()->id)->count();
            },
            'notifications' => function () use ($request) {
                if (! $request->user()) {
                    return ['unread_count' => 0, 'recent' => []];
                }

                $user = $request->user();
                $recent = $user->notifications()->latest()->take(15)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'type' => $n->data['type'] ?? null,
                    'title' => $n->data['title'] ?? null,
                    'actor_name' => $n->data['actor_name'] ?? null,
                    'actor_photo' => $n->data['actor_photo'] ?? null,
                    'actor_id' => $n->data['actor_id'] ?? null,
                    'action_url' => $n->data['action_url'] ?? null,
                    'read_at' => $n->read_at?->toISOString(),
                    'created_at' => $n->created_at->toISOString(),
                ]);

                return [
                    'unread_count' => $user->unreadNotifications()->count(),
                    'recent' => $recent,
                ];
            },
        ];
    }
}
