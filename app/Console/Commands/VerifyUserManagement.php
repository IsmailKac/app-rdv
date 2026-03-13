<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\DoctorProfile;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class VerifyUserManagement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:user-management';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify User Management CRUD operations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("--- User Management Verification ---");

        // 1. Setup Admin
        $adminEmail = 'admin_tester@test.com';
        $admin = User::where('email', $adminEmail)->first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin Tester',
                'email' => $adminEmail,
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_verified' => true
            ]);
        }

        Auth::login($admin);
        $this->info("Logged in as Admin: " . $admin->email);

        $controller = new UserController();

        // 2. Test Create Patient
        $this->info("\n--- Testing Create Patient ---");
        $patientEmail = 'patient_t_' . time() . '@test.com';

        // Mock Request for Patient
        $requestData = [
            'name' => 'Test Patient',
            'email' => $patientEmail,
            'password' => 'password',
            'role' => 'patient'
        ];

        // We need to simulate a request object properly or ensure controller handles array access via Request
        $request = new Request([], $requestData); // Parameter bag is crucial? No, Request::create matches closer
        $request->merge($requestData); // Better way to populate input

        try {
            $response = $controller->store($request);
            // In API context, response is usually JsonResponse. We get data from it.
            $patient = $response->getData();
            $this->info("Patient Created: ID " . $patient->id);

            if (User::find($patient->id)->role === 'patient') {
                $this->info("Role Verified: OK");
            } else {
                $this->error("Role Verification Failed");
            }
        } catch (\Exception $e) {
            $this->error("Create Patient Failed: " . $e->getMessage());
            $this->error($e->getTraceAsString());
        }

        // 3. Test Create Doctor
        $this->info("\n--- Testing Create Doctor ---");
        $doctorEmail = 'doctor_t_' . time() . '@test.com';
        $specialty = \App\Models\Specialty::first();
        if (!$specialty) {
            $specialty = \App\Models\Specialty::create(['name' => 'Generalist', 'description' => 'Test']);
        }

        $doctorData = [
            'name' => 'Test Doctor',
            'email' => $doctorEmail,
            'password' => 'password',
            'role' => 'doctor',
            'specialty_id' => $specialty->id
        ];

        $request = new Request();
        $request->merge($doctorData);

        try {
            $response = $controller->store($request);
            $doctor = $response->getData();
            $this->info("Doctor Created: ID " . $doctor->id);

            $profile = DoctorProfile::where('user_id', $doctor->id)->first();
            if ($profile) {
                $this->info("Doctor Profile Created: OK");
                if ($profile->specialty_id == $specialty->id) {
                    $this->info("Specialty Linked: OK");
                } else {
                    $this->error("Specialty Link Failed");
                }

                // Check slots
                if ($profile->slots()->count() > 0) {
                    $this->info("Slots Auto-generated: OK (" . $profile->slots()->count() . ")");
                } else {
                    $this->warn("Slots Not Generated (Check GeneratesSlots trait on Controller)");
                }

            } else {
                $this->error("Doctor Profile Creation Failed");
            }

        } catch (\Exception $e) {
            $this->error("Create Doctor Failed: " . $e->getMessage());
        }

        // Cleanup
        $this->info("\n--- Cleanup ---");
        if (isset($patient))
            User::destroy($patient->id);
        if (isset($doctor)) {
            DoctorProfile::where('user_id', $doctor->id)->delete();
            User::destroy($doctor->id);
        }
        $this->info("Test users deleted.");

        $this->info("\n--- Verification Complete ---");
    }
}
