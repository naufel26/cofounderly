<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class UserRegisterController extends Controller
{
    //
    public function store(Request $request)
    {
        // 1. Validation
        $request->validate([
            'fullName'   => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:' . User::class,
            'password'   => ['required', 'string', Rules\Password::defaults()],
            'role'       => 'required|string',
            'lookingFor' => 'required|array',
            'stage'      => 'required|string',
            'interests'  => 'required|array',
            'tagline'    => 'nullable|string|max:255',
        ]);

        // 2. Create User with extended fields
        $user = User::create([
            'name'        => $request->fullName,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'tagline'     => $request->tagline,
            'role'        => $request->role,
            'looking_for' => $request->lookingFor, // Casted to array automatically
            'stage'       => $request->stage,
            'interests'   => $request->interests,  // Casted to array automatically
        ]);

        // 3. SPATIE: Assign the role
        // This allows you to use $user->hasRole('founder') later
        $user->assignRole($request->role);

        // 3. Log them in
        Auth::login($user);

        // 4. Redirect (Inertia will take them to the dashboard)
        // return redirect()->intended(route('dashboard', absolute: false));
        return redirect()->route('feeds');
    }
}
