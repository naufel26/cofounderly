<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboarded
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->user() &&
            $request->user()->onboarding_completed_at === null &&
            ! $request->routeIs(['onboarding', 'onboarding.complete', 'profile.avatar.update', 'profile.cover.update', 'logout', 'verification.*'])
        ) {
            return redirect()->route('onboarding');
        }

        return $next($request);
    }
}
