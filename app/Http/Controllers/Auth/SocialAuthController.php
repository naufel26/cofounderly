<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirect;

class SocialAuthController extends Controller
{
    public function redirectToGoogle(): SymfonyRedirect
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('google')->user();
        } catch (\Exception) {
            return redirect()->route('login')->withErrors(['email' => 'Google sign-in failed. Please try again.']);
        }

        return $this->loginOrCreate('google_id', $socialUser);
    }

    public function redirectToLinkedIn(): SymfonyRedirect
    {
        return Socialite::driver('linkedin-openid')->redirect();
    }

    public function handleLinkedInCallback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('linkedin-openid')->user();
        } catch (\Exception) {
            return redirect()->route('login')->withErrors(['email' => 'LinkedIn sign-in failed. Please try again.']);
        }

        return $this->loginOrCreate('linkedin_id', $socialUser);
    }

    private function loginOrCreate(string $providerField, SocialiteUser $socialUser): RedirectResponse
    {
        $user = User::where($providerField, $socialUser->getId())->first();

        if (! $user) {
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                $user->update([$providerField => $socialUser->getId()]);
            } else {
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'password' => Str::random(40),
                    $providerField => $socialUser->getId(),
                    'email_verified_at' => now(),
                ]);

                Role::firstOrCreate(['name' => 'member', 'guard_name' => 'web']);
                $user->assignRole('member');
            }
        }

        Auth::login($user, remember: true);

        return redirect()->intended(route('dashboard'));
    }
}
