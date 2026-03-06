<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        // 1. Validate the incoming file
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'], // 2MB Max
        ]);

        $user = $request->user();

        // 2. Delete the old avatar if it exists to save space
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }

        // 3. Store the new avatar file in the 'avatars' folder
        $path = $request->file('avatar')->store('avatars', 'public');

        // 4. Update the user record in the database
        $user->update(['avatar' => $path]);

        // 5. Redirect back to the profile page with a success message
        return back()->with('success', 'Profile picture updated successfully.');
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|url',
            'bio' => 'nullable|string|max:300',
            'professional_summary' => 'nullable|string|max:500',
            'role' => 'required|string',
            'looking_for' => 'nullable|string',
            'business_stage' => 'nullable|string',
            'skills' => 'nullable|array',
        ]);

        $request->user()->update($request->all());

        return back()->with('success', 'Profile updated successfully!');
    }
}
