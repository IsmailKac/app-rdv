<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class VerifyAdminFeatures extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:admin-features';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify Admin Features implementation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("--- Admin Feature Verification ---");

        // 1. Ensure we have an admin
        $admin = User::where('email', 'admin@test.com')->first();
        if (!$admin) {
            $this->info("Creating Admin user...");
            $admin = User::factory()->create(['role' => 'admin', 'email' => 'admin@test.com', 'password' => bcrypt('password')]);
        } else {
            $this->info("Admin user found.");
        }

        // 2. Ensure we have a pending doctor
        $pendingDoctor = User::where('email', 'doc_pending@test.com')->first();
        if (!$pendingDoctor) {
            $this->info("Creating Pending Doctor...");
            $pendingDoctor = User::factory()->create(['role' => 'doctor', 'is_verified' => false, 'email' => 'doc_pending@test.com', 'password' => bcrypt('password')]);
        } else {
            $this->info("Pending Doctor found. Resetting status.");
            $pendingDoctor->update(['is_verified' => false]);
        }

        $this->info("Admin ID: " . $admin->id);
        $this->info("Pending Doctor ID: " . $pendingDoctor->id);

        // 2. Test getPendingDoctors via AdminController (simulated)
        $this->info("\n--- Testing getPendingDoctors ---");
        $controller = new \App\Http\Controllers\Api\AdminController();
        $response = $controller->getPendingDoctors();
        $data = $response->getData();
        $this->info("Pending Doctors Count: " . count($data));
        $found = false;
        foreach ($data as $d) {
            if ($d->id === $pendingDoctor->id)
                $found = true;
        }
        $this->info("Pending Doctor Found in Response: " . ($found ? 'YES' : 'NO'));

        // 3. Test verifyDoctor
        $this->info("\n--- Testing verifyDoctor ---");
        $response = $controller->verifyDoctor($pendingDoctor->id);
        $data = $response->getData();
        $this->info("Response Message: " . $data->message);

        $pendingDoctor->refresh();
        $this->info("Doctor Verified Status in DB: " . ($pendingDoctor->is_verified ? 'TRUE' : 'FALSE'));

        // 4. Test StatsController
        $this->info("\n--- Testing StatsController ---");
        // Mocking auth
        auth()->login($admin);
        $statsController = new \App\Http\Controllers\Api\StatsController();
        $response = $statsController->adminStats();
        $stats = $response->getData();

        // Check for new keys
        $keys = array_keys((array) $stats);

        if (in_array('appointments_by_status', $keys)) {
            $this->info("Appointments by Status: OK");
        } else {
            $this->error("Appointments by Status: MISSING");
        }

        if (in_array('top_specialties', $keys)) {
            $this->info("Top Specialties: OK");
        } else {
            $this->error("Top Specialties: MISSING");
        }

        $this->info("\n--- Verification Complete ---");
    }
}
