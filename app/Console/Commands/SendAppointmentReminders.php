<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use App\Models\Notification as CustomNotification;
use App\Notifications\AppointmentReminder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send automatic reminders to patients 24h before their appointments.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to send appointment reminders...');

        $tomorrowStart = Carbon::tomorrow();
        $tomorrowEnd = Carbon::tomorrow()->endOfDay();

        // Get appointments for tomorrow that haven't received a reminder yet
        $appointments = Appointment::with(['patient', 'slot.doctor.user'])
            ->where('status', 'confirmed')
            ->whereNull('reminder_sent_at')
            ->whereHas('slot', function ($query) use ($tomorrowStart, $tomorrowEnd) {
                $query->whereBetween('start_time', [$tomorrowStart, $tomorrowEnd]);
            })
            ->get();

        if ($appointments->isEmpty()) {
            $this->info('No appointments found for reminders tomorrow.');
            return;
        }

        foreach ($appointments as $appointment) {
            $patient = $appointment->patient;

            // 1. Send Laravel Notification (handles Email)
            $patient->notify(new AppointmentReminder($appointment));

            // 2. Create the custom Notification record for the frontend UI
            $time = Carbon::parse($appointment->slot->start_time)->format('H:i');
            CustomNotification::create([
                'user_id' => $patient->id,
                'type' => 'reminder',
                'message' => "Rappel : Votre rendez-vous avec le Dr. " . ($appointment->slot->doctor->user->name ?? '') . " est prévu pour demain à " . $time . ".",
                'is_read' => false,
                'appointment_id' => $appointment->id
            ]);

            // 3. Mock SMS Logging
            Log::info("MOCK SMS : Rappel envoyé à " . $patient->phone . " pour le RDV du " . $appointment->slot->start_time);

            // 4. Mark as sent
            $appointment->update(['reminder_sent_at' => now()]);

            $this->info("Reminder sent to patient: " . $patient->name);
        }

        $this->info('All reminders processed.');
    }
}
