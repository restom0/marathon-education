<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

use function PHPUnit\Framework\returnValue;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }
    public function callBack()
    {
        try {
            $user = Socialite::driver('google')->user();
            $is_user = User::where('email', $user->getEmail())->first();
            if (!$is_user) {
                $saveUser = User::updateORCreate([
                    'google_id' => $user->getId()
                ], [
                    'name' => $user->getName(),
                    'email' => $user->getEmail(),
                    'idRole' => 2,
                    'phone' => '0000000000',
                    'password' => Hash::make($user->getName() . '@' . $user->getId()),
                ]);
            } else {
                $saveUser = User::where('email', $user->getEmail())->update([
                    'google_id' => $user->getId(),
                ]);
                $saveUser = User::where('email', $user->getEmail())->first();
            }
            Auth::loginUsingId($saveUser->id);
            return redirect('/roles');
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
