<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeen
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            $userId = $request->user()->id;
            $cacheKey = "user_last_seen_{$userId}";

            if (! Cache::has($cacheKey)) {
                $request->user()->updateQuietly(['last_seen_at' => now()]);
                Cache::put($cacheKey, true, 60);
            }
        }

        return $next($request);
    }
}
