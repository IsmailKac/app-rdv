<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestReminderSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('role', 'patient')->first() ?: User::where('email', 'admin@gmail.com')->first();

        if ($user) {
            Notification::create([
                'user_id' => $user->id,
                'type' => 'reminder',
                'message' => "Rappel de test : Votre rendez-vous est prévu pour demain à 10:00.",
                'is_read' => false,
            ]);
        }
    }
}
