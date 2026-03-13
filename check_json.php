<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;

$doctor = User::where('role', 'doctor')->first();
if ($doctor) {
    $doctor->load('doctorProfile');
    echo "--- DOCTOR JSON ---\n";
    echo json_encode($doctor, JSON_PRETTY_PRINT) . "\n";
    echo "-------------------\n";
} else {
    echo "No doctor found.\n";
}
