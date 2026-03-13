<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorProfile;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctor_profiles,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = Review::create([
            'doctor_id' => $request->doctor_id,
            'patient_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json($review, 201);
    }

    public function index($doctorId)
    {
        $reviews = Review::where('doctor_id', $doctorId)
            ->with('patient:id,name') // Only get patient name
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    public function show($id)
    {
        $review = Review::findOrFail($id);
        return response()->json($review);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if (Auth::id() !== $review->patient_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review->update($request->only(['rating', 'comment']));

        return response()->json($review);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        if (Auth::id() !== $review->patient_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted']);
    }
}
