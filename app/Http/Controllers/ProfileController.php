<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect;

class ProfileController extends Controller
{
    //
    public function show(Request $request)
    {
        // Render the React component and pass the logged-in user data
        return Inertia::render('profile/show', [
            'user' => $request->user(),
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {

            // 1. Delete old file from storage
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // 2. Store new file (returns path like "avatars/filename.jpg")
            $path = $request->file('avatar')->store('avatars', 'public');

            // 3. Update the 'avatar' column
            $user->update([
                'avatar' => $path,
            ]);
            // dd($request->file('avatar'));
        }

        // IMPORTANT: Remove dd() so Inertia can trigger onSuccess
        return back();
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users')->ignore($request->user()->id),
            ],
            'tagline' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'bio' => ['nullable', 'string', 'max:300'],
            'professional_summary' => ['nullable', 'string', 'max:500'],
            'role' => ['required', 'string'],
            'looking_for' => ['nullable', 'string'],
            'business_stage' => ['nullable', 'string'],
            'skills' => ['nullable', 'array'],
        ]);

        // Update all validated fields
        $request->user()->fill($request->all());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.show');
    }
}
