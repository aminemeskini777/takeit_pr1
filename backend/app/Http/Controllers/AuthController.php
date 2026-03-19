<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (array_key_exists('status', $user->getAttributes()) && $user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is not active',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json($request->user(), 200);
    }
}
 // tafsir : 
 // This is the AuthController class that handles user authentication in a Laravel application. It has three main methods: login, logout, and me.
 // The login method validates the user's email and password, checks if the user exists and if the credentials are correct, and then creates a new authentication token for the user. It also checks if the user's account is active before allowing them to log in.
 // The logout method deletes the current access token for the authenticated user, effectively logging them out.
 // The me method returns the authenticated user's information.
