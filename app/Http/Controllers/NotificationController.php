<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\User;
use App\Notifications\RendezVousNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class NotificationController extends Controller
{
    // Méthode pour envoyer une notification à un utilisateur spécifique
    public function sendRendezVousNotification($rendezVousId)
    {
        $rendezVous = RendezVous::findOrFail($rendezVousId);
        $users = User::all(); // Vous pouvez filtrer les utilisateurs par rôle si nécessaire (par exemple, patients, médecins, etc.)

        Notification::send($users, new RendezVousNotification($rendezVous));

        return redirect()->route('rendezvous.index')->with('success', 'Notification envoyée avec succès.');
    }

    // Méthode pour envoyer une notification personnalisée à un utilisateur
    public function sendCustomNotification(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        $notificationData = [
            'title' => $request->title,
            'message' => $request->message,
        ];

        // Vous pouvez créer une notification personnalisée ici
       // $user->notify(new RendezVousNotification($notificationData));

        return redirect()->route('rendezvous.index')->with('success', 'Notification personnalisée envoyée.');
    }
}
