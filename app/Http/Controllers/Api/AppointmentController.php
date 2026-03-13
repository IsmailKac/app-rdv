<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Barryvdh\DomPDF\Facade\Pdf;

use Laravel\Sanctum\PersonalAccessToken;

class AppointmentController extends Controller
{
    public function downloadPDF(Appointment $appointment)
    {
        $token = request('token');
        $user = Auth::user();

        // If not authenticated via header/session, try the query token
        if (!$user && $token) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
                Auth::login($user); // Establish temporary session for this request
            }
        }

        // Security check: only allow patient or doctor involved to download
        if (!$user || ($user->id !== $appointment->patient_id && ($user->role !== 'doctor' || ($user->doctorProfile && $user->doctorProfile->id !== $appointment->slot->doctor_id)))) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->load(['slot.doctor.user', 'slot.doctor.specialty', 'patient']);

        if (!$appointment->slot || !$appointment->slot->doctor || !$appointment->slot->doctor->user) {
            return response()->json(['message' => 'Data incomplete for this appointment.'], 404);
        }

        $pdf = Pdf::loadView('pdf.appointment_confirmation', compact('appointment'));

        return $pdf->download('SIGREM_Confirmation_' . $appointment->id . '.pdf');
    }

    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'patient') {
            $appointments = $user->appointments()->with(['slot.doctor.user', 'slot.doctor.specialty'])->get();
        } elseif ($user->role === 'doctor') {
            // For doctors, find appointments via their slots
            $appointments = Appointment::whereHas('slot', function ($q) use ($user) {
                $q->where('doctor_id', $user->doctorProfile->id);
            })->with(['patient', 'slot'])->get();
        } elseif ($user->role === 'admin') {
            $appointments = Appointment::with(['patient', 'slot.doctor.user'])->get();
        } else {
            $appointments = [];
        }

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'slot_id' => 'required|exists:slots,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
            // lockForUpdate prevents other concurrent transactions from reading/writing this row
            $slot = Slot::where('id', $request->slot_id)->lockForUpdate()->firstOrFail();

            if ($slot->is_booked) {
                return response()->json(['message' => 'This slot was just booked by someone else.'], 409);
            }

            $appointment = Appointment::create([
                'patient_id' => Auth::id(),
                'slot_id' => $slot->id,
                'status' => 'confirmed',
                'notes' => $request->notes,
            ]);

            $slot->update(['is_booked' => true]);

            // Notify Doctor
            \App\Models\Notification::create([
                'user_id' => $slot->doctor->user_id,
                'type' => 'booking',
                'message' => "Nouveau rendez-vous réservé par " . Auth::user()->name . " pour le " . \Carbon\Carbon::parse($slot->start_time)->format('d/m à H:i'),
                'is_read' => false,
                'appointment_id' => $appointment->id
            ]);

            // Broadcast event
            \App\Events\AppointmentBooked::dispatch($appointment);

            return response()->json($appointment, 201);
        });
    }

    public function cancel(Appointment $appointment)
    {
        // ... (existing logic) ...
        if (Auth::id() !== $appointment->patient_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->update(['status' => 'cancelled']);
        $appointment->slot->update(['is_booked' => false]);

        return response()->json(['message' => 'Appointment cancelled']);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        // Security: simplified for demo, ideally check ownership

        $request->validate([
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($request->only(['status', 'notes']));

        return response()->json($appointment);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);

        // Cleanup: free up the slot if it wasn't already cancelled/freed
        if ($appointment->status !== 'cancelled') {
            $appointment->slot->update(['is_booked' => false]);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted']);
    }

    public function show($id)
    {
        $appointment = Appointment::with(['slot.doctor.user', 'patient'])
            ->findOrFail($id);

        // Security check: only allow patient or doctor involved to view
        $user = Auth::user();
        if ($user->id !== $appointment->patient_id && $user->id !== $appointment->slot->doctor->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($appointment);
    }
}
