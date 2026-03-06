<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class FeedController extends Controller
{
    public function index()
    {
        // Later, you can fetch actual posts here
        return Inertia::render('feeds', [
            'status' => session('status'),
        ]);
    }
}
