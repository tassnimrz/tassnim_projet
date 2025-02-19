<?php

namespace App\Http\Controllers;

use App\Models\Disponibilite;
use Illuminate\Http\Request;

class DisponibiliteController extends Controller
{
    // Méthode pour afficher les créneaux de disponibilité
    public function index()
    {
        $disponibilites = Disponibilite::all();
        return view('disponibilites.index', compact('disponibilites'));
    }

    // Méthode pour créer un nouveau créneau de disponibilité
    public function create()
    {
        return view('disponibilites.create');
    }

    // Méthode pour enregistrer un créneau de disponibilité
    public function store(Request $request)
    {
        $request->validate([
            'medecin_id' => 'required|exists:users,id', // Assurez-vous que medecin_id existe dans la table des utilisateurs
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
        ]);

        Disponibilite::create([
            'medecin_id' => $request->medecin_id,
            'date' => $request->date,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'statut' => 'disponible',
        ]);

        return redirect()->route('disponibilites.index')->with('success', 'Créneau de disponibilité ajouté avec succès.');
    }

    // Méthode pour modifier un créneau de disponibilité
    public function edit($id)
    {
        $disponibilite = Disponibilite::findOrFail($id);
        return view('disponibilites.edit', compact('disponibilite'));
    }

    // Méthode pour mettre à jour un créneau de disponibilité
    public function update(Request $request, $id)
    {
        $request->validate([
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
        ]);

        $disponibilite = Disponibilite::findOrFail($id);
        $disponibilite->update([
            'date' => $request->date,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
        ]);

        return redirect()->route('disponibilites.index')->with('success', 'Créneau de disponibilité mis à jour avec succès.');
    }

    // Méthode pour supprimer un créneau de disponibilité
    public function destroy($id)
    {
        $disponibilite = Disponibilite::findOrFail($id);
        $disponibilite->delete();

        return redirect()->route('disponibilites.index')->with('success', 'Créneau de disponibilité supprimé avec succès.');
    }
}
