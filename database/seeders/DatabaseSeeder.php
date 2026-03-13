<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Specialty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a list of medical specialties
        $specialties = [
            'General Medicine',
            'Cardiology',
            'Dermatology',
            'Pediatrics',
            'Gynecology',
            'Ophthalmology',
            'Orthopedics',
            'Dentistry',
            'Neurology',
            'Psychiatry',
            'Urology',
            'Dermatology',
            'Endocrinology',
            'ENT (Ear, Nose, Throat)',
            'Gastroenterology',
        ];

        foreach ($specialties as $name) {
            Specialty::firstOrCreate(['name' => $name]);
        }

        // Simple Admin User Creation
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'role' => 'admin',
                'is_verified' => true,
            ]
        );

        // Sample Verified Doctors
        $doctors = [
            [
                'name' => 'Zerwali',
                'email' => 'zerwali@example.com',
                'specialty' => 'General Medicine',
                'bio' => 'Médecin généraliste avec 10 ans d\'expérience.',
                'address' => '123 Rue de la Santé, Casablanca',
            ],
        ];

        foreach ($doctors as $d) {
            $user = User::updateOrCreate(
                ['email' => $d['email']],
                [
                    'name' => $d['name'],
                    'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                    'role' => 'doctor',
                    'is_verified' => true,
                ]
            );

            $spec = Specialty::where('name', $d['specialty'])->first();

            $profile = $user->doctorProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'specialty_id' => $spec->id,
                    'bio' => $d['bio'],
                    'office_address' => $d['address'],
                    'phone' => '0123456789'
                ]
            );

            // Clear old slots to avoid mixing different durations
            $profile->slots()->delete();

            // Add 1-hour slots for the next 14 days
            for ($i = 1; $i <= 14; $i++) {
                $date = now()->addDays($i)->format('Y-m-d');
                // Hourly slots: 08:00 to 12:00 and 14:00 to 18:00
                $startTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
                foreach ($startTimes as $time) {
                    $profile->slots()->create([
                        'start_time' => "$date $time:00",
                        'end_time' => now()->parse("$date $time:00")->addHour(),
                        'is_booked' => false
                    ]);
                }
            }
        }
    }
}
