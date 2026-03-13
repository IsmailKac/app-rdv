<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "--- Admin Feature Verification ---\n";

// 1. Ensure we have an admin and a pending doctor
$admin = User::where('role', 'admin')->first();
if (!$admin) {
    echo "Creating Admin user...\n";
    $admin = User::factory()->create(['role' => 'admin', 'email' => 'admin@test.com', 'password' => bcrypt('password')]);
}

$pendingDoctor = User::where('role', 'doctor')->where('is_verified', false)->first();
if (!$pendingDoctor) {
    echo "Creating Pending Doctor...\n";
    $pendingDoctor = User::factory()->create(['role' => 'doctor', 'is_verified' => false, 'email' => 'doc_pending@test.com', 'password' => bcrypt('password')]);
}

echo "Admin ID: " . $admin->id . "\n";
echo "Pending Doctor ID: " . $pendingDoctor->id . "\n";

// 2. Test getPendingDoctors via AdminController (simulated)
echo "\n--- Testing getPendingDoctors ---\n";
$controller = new \App\Http\Controllers\Api\AdminController();
$response = $controller->getPendingDoctors();
$data = $response->getData();
echo "Pending Doctors Count: " . count($data) . "\n";
$found = false;
foreach ($data as $d) {
    if ($d->id === $pendingDoctor->id)
        $found = true;
}
echo "Pending Doctor Found in Response: " . ($found ? 'YES' : 'NO') . "\n";

// 3. Test verifyDoctor
echo "\n--- Testing verifyDoctor ---\n";
$response = $controller->verifyDoctor($pendingDoctor->id);
$data = $response->getData();
echo "Response Message: " . $data->message . "\n";

$pendingDoctor->refresh();
echo "Doctor Verified Status in DB: " . ($pendingDoctor->is_verified ? 'TRUE' : 'FALSE') . "\n";

// 4. Test StatsController
echo "\n--- Testing StatsController ---\n";
// Mocking auth
auth()->login($admin);
$statsController = new \App\Http\Controllers\Api\StatsController();
$response = $statsController->adminStats();
$stats = $response->getData();

echo "Stats Keys Found:\n";
print_r(array_keys((array) $stats));

if (isset($stats->appointments_by_status)) {
    echo "Appointments by Status: OK\n";
} else {
    echo "Appointments by Status: MISSING\n";
}

if (isset($stats->top_specialties)) {
    echo "Top Specialties: OK\n";
} else {
    echo "Top Specialties: MISSING\n";
}

echo "\n--- Verification Complete ---\n";
