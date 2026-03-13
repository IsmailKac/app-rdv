<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DoctorProfile>
 */
class DoctorProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'specialty_id' => \App\Models\Specialty::factory(),
            'bio' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'office_address' => $this->faker->address(),
        ];
    }
}
