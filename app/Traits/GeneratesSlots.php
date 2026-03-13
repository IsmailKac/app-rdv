<?php

namespace App\Traits;

use App\Models\Slot;
use Carbon\Carbon;

trait GeneratesSlots
{
    /**
     * Generate default 1-hour slots for the next 14 days.
     */
    public function generateDefaultSlots($doctorProfile)
    {
        // Clear existing slots to avoid overlaps
        $doctorProfile->slots()->delete();

        $startTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

        for ($i = 1; $i <= 14; $i++) {
            $date = Carbon::now()->addDays($i)->format('Y-m-d');

            foreach ($startTimes as $time) {
                Slot::create([
                    'doctor_id' => $doctorProfile->id,
                    'start_time' => "$date $time:00",
                    'end_time' => Carbon::parse("$date $time:00")->addHour(),
                    'is_booked' => false
                ]);
            }
        }
    }
}
