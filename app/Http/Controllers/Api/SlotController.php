<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SlotController extends Controller
{
    public function index(Request $request)
    {
        $query = Slot::query();

        // Filter by doctor if provided
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        } elseif (Auth::check() && Auth::user()->role === 'doctor') {
            $query->where('doctor_id', Auth::user()->doctorProfile->id);
        }

        // Default to showing only future available slots unless specified otherwise
        if (!$request->has('all')) {
            $query->where('is_booked', false)
                ->where('start_time', '>', now());
        }

        $slots = $query->with(['appointment.patient'])->orderBy('start_time')->get();

        return response()->json($slots);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'doctor' || !$user->doctorProfile) {
            return response()->json(['message' => 'Unauthorized. Only doctors can create slots.'], 403);
        }

        $request->validate([
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ]);

        $slot = $user->doctorProfile->slots()->create([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => false,
        ]);

        return response()->json($slot, 201);
    }

    public function show($id)
    {
        $slot = Slot::findOrFail($id);
        return response()->json($slot);
    }

    public function update(Request $request, $id)
    {
        $slot = Slot::findOrFail($id);

        // Security check
        if (Auth::user()->role !== 'doctor' || $slot->doctor_id !== Auth::user()->doctorProfile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'start_time' => 'sometimes|date|after:now',
            'end_time' => 'sometimes|date|after:start_time',
            'is_booked' => 'sometimes|boolean',
        ]);

        $slot->update($request->all());

        return response()->json($slot);
    }

    public function destroy(Slot $slot)
    {
        $user = Auth::user();

        if ($user->role !== 'doctor' || $slot->doctor_id !== $user->doctorProfile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($slot->is_booked) {
            return response()->json(['message' => 'Cannot delete a booked slot.'], 400);
        }

        $slot->delete();

        return response()->json(['message' => 'Slot deleted']);
    }
}
