<?php

namespace App\repositories;

use App\Models\User;
use App\interfaces\AuthInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthRepository implements AuthInterface
{
    public function checkIfAuthenticated(Request $request)
    {
        $email = mb_strtolower(trim((string) $request->input('email')));
        $password = (string) $request->input('password');
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if (!$user) {
            return false;
        }

        $storedPassword = (string) $user->password;
        $passwordInfo = password_get_info($storedPassword);

        if (!empty($passwordInfo['algo']) && Hash::check($password, $storedPassword)) {
            return true;
        }

        // Older accounts may have been saved by the legacy App\\User model,
        // which did not hash passwords. Upgrade a matching password on login.
        if (empty($passwordInfo['algo']) && hash_equals($storedPassword, $password)) {
            $user->password = Hash::make($password);
            $user->save();
            return true;
        }

        return false;
    }

    public function registerUser(Request $request)
    {
        $user = new User();
        $user->name = $request->name;
        $user->email = mb_strtolower(trim((string) $request->email));
        $user->password = $request->password;
        $user->save();
        return $user;
    }

    public function findUserByEmailAddress($email)
    {
        $user = User::whereRaw('LOWER(email) = ?', [mb_strtolower(trim((string) $email))])->first();
        return $user;
    }
}
