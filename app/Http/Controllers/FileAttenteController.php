<?php

namespace App\Http\Controllers;

use App\Models\FileAttente;
use App\Models\RendezVous;
use Illuminate\Http\Request;

class FileAttenteController extends Controller
{
    // Méthode pour afficher la liste des rendez-vous en file d'attente
    public function index()
    {
        $fileAttente = FileAttente::all();
        return view('fileattente.index', compact('fileAttente'));
    }

    // Méthode pour ajouter un rendez-vous à la file d'attente
    public function store(Request $request)
    {
        // Ajouter la logique pour vérifier les conditions avant d'ajouter à la file
        FileAttente::create([
            'rendezvous_id' => $request->rendezvous_id,
            'statut' => 'en attente', // Le statut initial est "en attente"
        ]);

        return redirect()->route('fileattente.index')->with('success', 'Rendez-vous ajouté à la file d\'attente.');
    }

    // Méthode pour mettre à jour le statut dans la file d'attente (ex : passer à "confirmé")
    public function update(Request $request, $id)
    {
        $fileAttente = FileAttente::findOrFail($id);
        $fileAttente->update([
            'statut' => $request->statut,
        ]);

        // Mettre à jour le statut du rendez-vous lié
        $rendezVous = RendezVous::findOrFail($fileAttente->rendezvous_id);
        $rendezVous->statut = $request->statut;
        $rendezVous->save();

        return redirect()->route('fileattente.index')->with('success', 'Statut du rendez-vous mis à jour.');
    }

    // Méthode pour supprimer un rendez-vous de la file d'attente
    public function destroy($id)
    {
        $fileAttente = FileAttente::findOrFail($id);
        $fileAttente->delete();

        return redirect()->route('fileattente.index')->with('success', 'Rendez-vous supprimé de la file d\'attente.');
    }
}
