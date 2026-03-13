<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\SlotController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SpecialtyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
});

Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{id}', [DoctorController::class, 'show']);
Route::get('/specialties', [SpecialtyController::class, 'index']);
Route::get('/appointments/{appointment}/download', [AppointmentController::class, 'downloadPDF']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::apiResource('users', UserController::class);
    Route::get('/admin/stats', [\App\Http\Controllers\Api\StatsController::class, 'adminStats']);
    Route::get('/admin/doctors/pending', [\App\Http\Controllers\Api\AdminController::class, 'getPendingDoctors']);
    Route::patch('/admin/doctors/{id}/verify', [\App\Http\Controllers\Api\AdminController::class, 'verifyDoctor']);

    // Doctor Profile
    Route::put('/doctor/profile', [DoctorController::class, 'update']);

    // Doctor Slots
    Route::get('/slots', [SlotController::class, 'index']); // Custom index with filters
    Route::apiResource('slots', SlotController::class)->except(['index']);

    // Appointments
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::apiResource('appointments', AppointmentController::class);

    // Reviews
    Route::get('/doctors/{id}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'index']); // Custom index by doctor
    Route::apiResource('reviews', \App\Http\Controllers\Api\ReviewController::class)->except(['index']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/check', [\App\Http\Controllers\Api\NotificationController::class, 'checkReminders']);
    Route::patch('/notifications/{id}/read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);

    // Documents
    Route::apiResource('documents', \App\Http\Controllers\Api\DocumentController::class);

});
