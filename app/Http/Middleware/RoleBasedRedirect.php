<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleBasedRedirect
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // 1. If Admin, send to the Dashboard
            if ($user->hasRole('admin')) {
                return redirect()->intended('/dashboard');
            }

            // 2. If any other role, send to the Feeds page
            return redirect()->intended('/feeds');
        }

        return $next($request);
    }
}
