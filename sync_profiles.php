<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;
use App\Models\DoctorProfile;
use App\Models\Specialty;

echo "--- DOCTOR PROFILE SYNC ---\n";

// Ensure at least one specialty exists
$specialty = Specialty::first();
if (!$specialty) {
    $specialty = Specialty::create(['name' => 'Generalist']);
}

$doctors = User::where('role', 'doctor')->get();
echo "Found " . $doctors->count() . " doctors.\n";

foreach ($doctors as $doctor) {
    if (!$doctor->doctorProfile) {
        echo "Creating profile for: {$doctor->name} (ID: {$doctor->id})...\n";
        $doctor->doctorProfile()->create([
            'bio' => 'Experienced medical professional.',
            'office_address' => 'Central Medical Clinic',
            'specialty_id' => $specialty->id,
            'phone' => '0123456789'
        ]);
        echo "Done.\n";
    } else {
        echo "Profile exists for: {$doctor->name}.\n";
    }
}

echo "---------------------------\n";
