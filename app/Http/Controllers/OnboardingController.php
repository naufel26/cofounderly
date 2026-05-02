<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->user()->onboarding_completed_at !== null) {
            return redirect()->route('feeds');
        }

        return Inertia::render('onboarding', [
            'user' => array_merge($request->user()->toArray(), [
                'profile_photo_url' => $request->user()->profile_photo_url,
            ]),
        ]);
    }

    public function complete(Request $request): RedirectResponse
    {
        $request->user()->update([
            'onboarding_completed_at' => now(),
        ]);

        return redirect()->route('feeds');
    }
}
