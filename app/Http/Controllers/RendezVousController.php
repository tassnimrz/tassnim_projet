<?php
namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\Disponibilite;
use App\Models\User;
use App\Models\DossierMedical;
use App\Events\RendezVousUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\RendezVousNotification;

class RendezVousController extends Controller
{
    // Méthode pour afficher tous les rendez-vous
    public function index()
    {
        $rendezVous = RendezVous::all();
        return view('rendezvous.index', compact('rendezVous'));
    }

    // Méthode pour afficher les détails d'un rendez-vous spécifique
    public function show($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        return view('rendezvous.show', compact('rendezVous'));
    }

    // Méthode pour afficher le formulaire de création d'un rendez-vous
    public function create()
    {
        $disponibilites = Disponibilite::where('statut', 'disponible')->get();
        $patients = User::role('patient')->get(); // Sélectionner uniquement les patients
        return view('rendezvous.create', compact('disponibilites', 'patients'));
    }

    // Méthode pour enregistrer un rendez-vous
    // Méthode pour enregistrer un rendez-vous
public function store(Request $request)
{
    // Validation des données
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'dossier_medical_id' => 'required|exists:dossier_medicals,id',
        'date_rendez_vous' => 'required|date',
        'motif' => 'required|string',
        'type' => 'required|string',
        'disponibilite_id' => 'required|exists:disponibilites,id',
    ]);

    // Vérifier la disponibilité du créneau
    $disponibilite = Disponibilite::findOrFail($request->disponibilite_id);

    // Si le créneau est déjà occupé, on renvoie un message d'erreur
    if ($disponibilite->statut == 'occupé') {
        return redirect()->back()->with('error', 'Le créneau est déjà occupé.');
    }

    // Vérifier que l'utilisateur est bien un patient
    $user = User::findOrFail($request->user_id);
    if (!$user->hasRole('patient')) {
        return redirect()->back()->with('error', 'L\'utilisateur n\'est pas un patient.');
    }

    // Créer un nouveau rendez-vous
    $rendezVous = new RendezVous([
        'user_id' => $request->user_id,
        'dossier_medical_id' => $request->dossier_medical_id,
        'date_rendez_vous' => $request->date_rendez_vous,
        'statut' => 'en attente', // Statut initial
        'motif' => $request->motif,
        'type' => $request->type,
        'disponibilite_id' => $disponibilite->id,
    ]);
    $rendezVous->save();

    // Marquer le créneau comme occupé
    $disponibilite->statut = 'occupé';
    $disponibilite->save();

    // Diffuser l'événement de mise à jour
    broadcast(new RendezVousUpdated($rendezVous));

    // Envoyer des notifications au patient, médecin et secrétaire
    Notification::send(User::all(), new RendezVousNotification($rendezVous));
  // Notification::send(User::all(), new RendezVousNotification($notificationData));

    // Retourner une réponse ou rediriger
    return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous pris avec succès!');
}

    // Méthode pour afficher le formulaire d'édition d'un rendez-vous
    public function edit($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $disponibilites = Disponibilite::where('statut', 'disponible')->get();
        $patients = User::role('patient')->get(); // Sélectionner uniquement les patients
        return view('rendezvous.edit', compact('rendezVous', 'disponibilites', 'patients'));
    }

    // Méthode pour mettre à jour un rendez-vous
    public function update(Request $request, $id)
    {
        $rendezVous = RendezVous::findOrFail($id);

        $rendezVous->update([
            'date_rendez_vous' => $request->date_rendez_vous,
            'statut' => $request->statut,
            'motif' => $request->motif,
            'disponibilite_id' => $request->disponibilite_id,
        ]);

        // Diffuser l'événement de mise à jour
        broadcast(new RendezVousUpdated($rendezVous));

        // Envoyer une notification de mise à jour
        Notification::send(User::all(), new RendezVousNotification($rendezVous));

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous mis à jour.');
    }

    // Méthode pour annuler un rendez-vous
    public function cancel($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $rendezVous->statut = 'annulé';
        $rendezVous->save();

        // Marquer le créneau comme disponible
        $disponibilite = $rendezVous->disponibilite;
        $disponibilite->statut = 'disponible';
        $disponibilite->save();

        // Diffuser l'événement d'annulation
        broadcast(new RendezVousUpdated($rendezVous));

        // Envoyer une notification d'annulation
        Notification::send(User::all(), new RendezVousNotification($rendezVous));

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous annulé.');
    }

    // Méthode pour confirmer un rendez-vous
    public function confirm($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $rendezVous->statut = 'confirmé';
        $rendezVous->save();

        // Diffuser l'événement de confirmation
        broadcast(new RendezVousUpdated($rendezVous));

        // Envoyer une notification de confirmation
        Notification::send(User::all(), new RendezVousNotification($rendezVous));

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous confirmé.');
    }

    // Méthode pour créer un créneau de disponibilité
    public function createDisponibilite(Request $request)
    {
        $disponibilite = new Disponibilite([
            'medecin_id' => $request->medecin_id,
            'date' => $request->date,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'statut' => 'disponible', // Statut initial
        ]);
        $disponibilite->save();

        return redirect()->route('disponibilites.index')->with('success', 'Créneau créé avec succès.');
    }

    // Méthode pour afficher les créneaux de disponibilité
    public function showDisponibilites()
    {
        $disponibilites = Disponibilite::where('statut', 'disponible')->get();
        return view('disponibilites.index', compact('disponibilites'));
    }

    // Méthode pour supprimer un rendez-vous
    public function destroy($id)
    {
        $rendezVous = RendezVous::findOrFail($id);
        $rendezVous->delete();

        // Marquer le créneau comme disponible
        $disponibilite = $rendezVous->disponibilite;
        $disponibilite->statut = 'disponible';
        $disponibilite->save();

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous supprimé.');
    }
}
