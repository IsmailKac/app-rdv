<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\Specialty;

$count = Specialty::count();
echo "Total Specialties: $count\n";
if ($count > 0) {
    foreach (Specialty::all() as $s) {
        echo "- {$s->id}: {$s->name}\n";
    }
}
