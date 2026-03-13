<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => \App\Models\User::factory(),
            'doctor_id' => \App\Models\DoctorProfile::factory(),
            'appointment_id' => \App\Models\Appointment::factory(),
            'type' => $this->faker->word(),
            'file_path' => $this->faker->filePath(),
        ];
    }
}
