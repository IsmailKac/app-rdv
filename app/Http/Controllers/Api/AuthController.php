<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use \App\Traits\GeneratesSlots;

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|string|in:patient,doctor,admin', // Allow specifying role, default to patient
            'specialty_id' => 'nullable|required_if:role,doctor|exists:specialties,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'patient',
            'is_verified' => ($request->role === 'doctor') ? false : true,
        ]);

        if ($user->role === 'doctor') {
            $profile = $user->doctorProfile()->create([
                'specialty_id' => $request->specialty_id,
                'bio' => 'Nouveau médecin sur la plateforme.',
                'office_address' => 'À définir',
            ]);

            // Notify all Admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                \App\Models\Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'verification_required',
                    'message' => "Un nouveau médecin, " . $user->name . ", s'est inscrit et nécessite une vérification.",
                    'is_read' => false
                ]);
            }

            // Generate default slots for the new doctor
            $this->generateDefaultSlots($profile);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('doctorProfile'),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('doctorProfile'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->load('doctorProfile'));
    }
}
