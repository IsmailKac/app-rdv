<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'type' => 'required|string',
            'file' => 'required|file|mimes:pdf,jpg,png,doc,docx|max:2048', // 2MB max
        ]);

        // Mock file upload - in production this would verify user perms and save to storage
        $path = $request->file('file')->store('documents', 'public');

        $document = Document::create([
            'patient_id' => Auth::id(), // Simplified: uploader owns it or from appointment
            'doctor_id' => 1, // Placeholder: logic to get doctor from appointment
            'appointment_id' => $request->appointment_id,
            'type' => $request->type,
            'file_path' => $path,
        ]);

        // Fix: Ideally fetch patient/doctor from the appointment relation
        $appointment = \App\Models\Appointment::find($request->appointment_id);
        $document->patient_id = $appointment->patient_id;
        $document->doctor_id = $appointment->slot->doctor_id;
        $document->save();

        return response()->json($document, 201);
    }

    public function index()
    {
        $user = Auth::user();
        $documents = Document::where('patient_id', $user->id)
            ->orWhere('doctor_id', $user->doctorProfile->id ?? 0)
            ->latest()
            ->get();

        return response()->json($documents);
    }

    public function show($id)
    {
        $document = Document::findOrFail($id);

        // Security check
        $user = Auth::user();
        if ($user->id !== $document->patient_id && ($user->doctorProfile && $user->doctorProfile->id !== $document->doctor_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($document);
    }

    public function update(Request $request, $id)
    {
        $document = Document::findOrFail($id);

        // Only allow updating metadata, not the file itself
        $request->validate([
            'type' => 'sometimes|string',
        ]);

        $document->update($request->only('type'));

        return response()->json($document);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        // Add security check here...

        // Delete file from storage
        // \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);

        $document->delete();

        return response()->json(['message' => 'Document deleted']);
    }
}
