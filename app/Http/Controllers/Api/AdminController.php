<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getPendingDoctors()
    {
        // Fetch users with role 'doctor' who are NOT verified
        $pendingDoctors = User::where('role', 'doctor')
            ->where('is_verified', false)
            ->with(['doctorProfile.specialty']) // Eager load profile and specialty
            ->get();

        return response()->json($pendingDoctors);
    }

    public function verifyDoctor($id)
    {
        $doctor = User::findOrFail($id);

        if ($doctor->role !== 'doctor') {
            return response()->json(['message' => 'User is not a doctor'], 400);
        }

        $doctor->update(['is_verified' => true]);

        return response()->json(['message' => 'Doctor verified successfully', 'doctor' => $doctor]);
    }
}
