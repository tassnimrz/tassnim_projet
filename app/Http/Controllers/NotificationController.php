<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller; 

class NotificationController extends Controller
{
    public function create()
    {
        $patients = User::all(); // tu peux filtrer si tu veux que les patients
        return view('notification', compact('patients'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        Notification::create([
            'user_id' => $request->user_id,
            'type' => 'rappel', // par exemple
            'message' => $request->message,
            'statut' => 'non lu',
            'date_notification' => now(),
        ]);

        return redirect()->route('notifications.create')->with('success', 'Notification envoyée !');
    }
}
