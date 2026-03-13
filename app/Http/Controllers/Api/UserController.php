<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DoctorProfile;
use App\Models\Specialty;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use \App\Traits\GeneratesSlots;

    /**
     * Display a listing of all users.
     */
    public function index()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admin only.'], 403);
        }
        $users = User::all();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|in:patient,doctor,admin',
            'specialty_id' => 'nullable|required_if:role,doctor|exists:specialties,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role ?? 'patient',
            'is_verified' => ($request->role === 'doctor') ? false : true,
        ]);

        if ($user->role === 'doctor') {
            $profile = DoctorProfile::create([
                'user_id' => $user->id,
                'specialty_id' => $request->specialty_id,
                'bio' => 'Médecin ajouté par l\'administrateur.',
                'office_address' => 'À renseigner',
                'phone' => '0000000000'
            ]);

            // Auto-generate slots
            $this->generateDefaultSlots($profile);
        }

        return response()->json($user, 201);
    }

    public function show($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:patient,doctor,admin',
            'is_verified' => 'sometimes|boolean',
            'specialty_id' => 'nullable|required_if:role,doctor|exists:specialties,id',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }
        if ($request->has('role')) {
            $user->role = $request->role;

            // If changed to doctor/updated and profile needs specialty update
            if ($user->role === 'doctor') {
                $user->doctorProfile()->updateOrCreate(
                    ['user_id' => $user->id],
                    ['specialty_id' => $request->specialty_id]
                );
            }
        }
        if ($request->has('is_verified')) {
            $user->is_verified = $request->is_verified;

            // Automation: If verifying a doctor, ensure they have at least a basic profile to appear in search
            if ($user->role === 'doctor' && $user->is_verified) {
                $profile = $user->doctorProfile()->firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'specialty_id' => Specialty::first()->id ?? 1, // Fallback to first specialty
                        'bio' => 'Médecin vérifié sur la plateforme.',
                        'office_address' => 'À renseigner',
                        'phone' => '0000000000'
                    ]
                );

                // Auto-generate slots only if they don't have any yet or to ensure 14 days
                $this->generateDefaultSlots($profile);
            }
        }

        $user->save();

        return response()->json($user);
    }

    public function destroy($id)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
