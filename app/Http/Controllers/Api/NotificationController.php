<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', Auth::id())->findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function checkReminders()
    {
        $user = Auth::user();
        if (!$user)
            return response()->json(['message' => 'Unauthenticated'], 401);

        // Find confirmed appointments in the next 24 hours that don't have a reminder yet
        $appointments = $user->appointments()
            ->where('status', 'confirmed')
            ->whereHas('slot', function ($q) {
                $q->where('start_time', '>', now())
                    ->where('start_time', '<=', now()->addHours(24));
            })
            ->whereDoesntHave('notifications', function ($q) {
                $q->where('type', 'reminder');
            })
            ->with('slot.doctor.user')
            ->get();

        foreach ($appointments as $appointment) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'reminder',
                'message' => "Rappel : Vous avez un rendez-vous demain avec Dr. " . $appointment->slot->doctor->user->name . " à " . \Carbon\Carbon::parse($appointment->slot->start_time)->format('H:i'),
                'is_read' => false,
                'appointment_id' => $appointment->id
            ]);
        }

        return $this->index();
    }
}
