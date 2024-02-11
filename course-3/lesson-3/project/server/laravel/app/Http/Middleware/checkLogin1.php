<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class checkLogin1
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (isset($request->token)) {
            $check = User::where('remember_token', $request->token)->count('id');
            if ($check == 0) {
                return response()->json(['msg' => 'Login required'], 401);
            }
        } else {
            return response()->json(['msg' => 'Login required'], 401);
        }
        return $next($request);
    }
}
