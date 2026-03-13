<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'admin@gmail.com';
$password = 'password123';

$user = User::where('email', $email)->first();

if ($user) {
    echo "Updating existing user to Admin...\n";
    $user->update([
        'role' => 'admin',
        'password' => Hash::make($password)
    ]);
} else {
    echo "Creating new Admin user...\n";
    User::create([
        'name' => 'Super Admin',
        'email' => $email,
        'password' => Hash::make($password),
        'role' => 'admin'
    ]);
}

echo "Done! You can now log in with:\n";
echo "Email: $email\n";
echo "Password: $password\n";
