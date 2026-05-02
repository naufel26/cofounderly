<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserRegisterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', Rules\Password::defaults()],
            'role' => 'required|string|in:founder,cofounder,investor,jobseeker,student,advisor',
            'lookingFor' => 'required|array',
            'stage' => 'required|string',
            'interests' => 'required|array',
            'tagline' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->fullName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tagline' => $request->tagline,
            'role' => $request->role,
            'looking_for' => $request->lookingFor,
            'stage' => $request->stage,
            'interests' => $request->interests,
        ]);

        // Ensure the Spatie role exists before assigning it
        Role::firstOrCreate(['name' => $request->role, 'guard_name' => 'web']);
        $user->assignRole($request->role);

        Auth::login($user);

        return redirect()->route('onboarding');
    }
}
