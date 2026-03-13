<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function adminStats()
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'total_users' => User::count(),
            'total_doctors' => User::where('role', 'doctor')->count(),
            'total_patients' => User::where('role', 'patient')->count(),
            'total_appointments' => Appointment::count(),
            'appointments_by_status' => [
                'pending' => Appointment::where('status', 'pending')->count(),
                'confirmed' => Appointment::where('status', 'confirmed')->count(),
                'cancelled' => Appointment::where('status', 'cancelled')->count(),
            ],
            'top_specialties' => \App\Models\Specialty::withCount([
                'doctorProfiles as appointments_count' => function ($query) {
                    $query->whereHas('slots', function ($q) {
                        $q->has('appointment');
                    });
                }
            ])->orderByDesc('appointments_count')->limit(5)->get(),
            'users_last_7_days' => User::where('created_at', '>=', now()->subDays(7))->count(),
            'recent_appointments' => Appointment::with(['patient', 'slot.doctor.user'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
        ]);
    }
}
