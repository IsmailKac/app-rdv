<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\User;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        // Get all verified users with role doctor
        $query = User::where(function ($q) {
            $q->where('role', 'doctor')->orWhere('role', 'DOCTOR');
        })
            ->where('is_verified', 1)
            ->with([
                'doctorProfile.specialty',
                'doctorProfile' => function ($q) {
                    $q->withCount('reviews')->withAvg('reviews', 'rating');
                }
            ]);

        // Search by name
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Search by specialty
        if ($request->filled('specialty_id')) {
            $query->whereHas('doctorProfile', function ($q) use ($request) {
                $q->where('specialty_id', $request->specialty_id);
            });
        }

        // Search by location
        if ($request->filled('location')) {
            $query->whereHas('doctorProfile', function ($q) use ($request) {
                $q->where('office_address', 'like', '%' . $request->location . '%');
            });
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $doctor = User::where('role', 'doctor')
            ->with([
                'doctorProfile.specialty',
                'doctorProfile' => function ($q) {
                    $q->withCount('reviews')->withAvg('reviews', 'rating');
                },
                'doctorProfile.reviews.patient:id,name',
                'doctorProfile.slots' => function ($query) {
                    $query->where('is_booked', false)
                        ->where('start_time', '>', now())
                        ->orderBy('start_time');
                }
            ])
            ->findOrFail($id);

        return response()->json($doctor);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'doctor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'bio' => 'nullable|string',
            'phone' => 'nullable|string',
            'office_address' => 'nullable|string',
            'specialty_id' => 'sometimes|exists:specialties,id',
        ]);

        $profile = $user->doctorProfile;

        if (!$profile) {
            $profile = new DoctorProfile(['user_id' => $user->id]);
        }

        $profile->fill($request->only(['bio', 'phone', 'office_address', 'specialty_id']));
        $profile->save();

        return response()->json($user->load('doctorProfile'));
    }
}
