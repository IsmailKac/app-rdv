<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Slot>
 */
class SlotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('now', '+1 month');
        return [
            'doctor_id' => \App\Models\DoctorProfile::factory(),
            'start_time' => $start,
            'end_time' => (clone $start)->modify('+30 minutes'),
            'is_booked' => false,
        ];
    }
}
