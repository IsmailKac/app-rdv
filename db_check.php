<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\Appointment;
use App\Models\User;

echo "--- ALL USERS ---\n";
$users = User::all();
foreach ($users as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Role: {$u->role}\n";
}

echo "\n--- APPOINTMENTS ---\n";
try {
    $appointments = Appointment::with(['slot.doctor.user', 'patient'])->get();
    echo "Count: " . $appointments->count() . "\n";
    foreach ($appointments as $a) {
        echo "ID: {$a->id}, Patient: {$a->patient->name} (ID: {$a->patient_id}), Status: {$a->status}\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
echo "--------------------\n";
