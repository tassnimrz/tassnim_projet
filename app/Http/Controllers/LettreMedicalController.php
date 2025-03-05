<?php

namespace App\Http\Controllers;

use App\Models\LettreMedical;
use App\Models\DossierMedical;
use App\Models\User;
use Illuminate\Http\Request;




class LettreMedicalController extends Controller
{
    /**
     * Afficher la liste des lettres médicales.
     */
    public function index()
    {
        $lettres = LettreMedical::all();
        return view('lettres.index', compact('lettres'));
    }

    /**
     * Afficher le formulaire pour créer une lettre médicale.
     */
    public function create()
    {
        $dossiers = DossierMedical::all(); // Récupérer les dossiers médicaux disponibles
        $users = User::all(); // Récupérer les utilisateurs (patients)
        return view('lettres.create', compact('dossiers', 'users'));
    }

    /**
     * Enregistrer une nouvelle lettre médicale dans la base de données.
     */
    public function store(Request $request)
    {
        // Validation des données du formulaire
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'user_id' => 'nullable|exists:users,id',
            'type_lettre' => 'required|in:consultation,hospitalisation,chirurgie',
            'date_lettre' => 'required|date',
            'description' => 'nullable|string',
            'confirmation_medecin' => 'nullable|boolean',
            'jours_hospitalisation' => 'nullable|integer',
            'periode_chirurgie' => 'nullable|string',
        ]);

        // Création de la lettre médicale
        LettreMedical::create($request->all());

        return redirect()->route('lettres.index')->with('success', 'Lettre médicale créée avec succès.');
    }

    /**
     * Afficher les détails d'une lettre médicale spécifique.
     */
    public function show($id)
    {
        $lettre = LettreMedical::findOrFail($id);
        return view('lettres.show', compact('lettre'));
    }

    /**
     * Afficher le formulaire pour modifier une lettre médicale existante.
     */
    public function edit($id)
    {
        $lettre = LettreMedical::findOrFail($id);
        $dossiers = DossierMedical::all();
        $users = User::all();
        return view('lettres.edit', compact('lettre', 'dossiers', 'users'));
    }

    /**
     * Mettre à jour les informations d'une lettre médicale.
     */
    public function update(Request $request, $id)
    {
        // Validation des données du formulaire
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'user_id' => 'nullable|exists:users,id',
            'type_lettre' => 'required|in:consultation,hospitalisation,chirurgie',
            'date_lettre' => 'required|date',
            'description' => 'nullable|string',
            'confirmation_medecin' => 'nullable|boolean',
            'jours_hospitalisation' => 'nullable|integer',
            'periode_chirurgie' => 'nullable|string',
        ]);

        // Mise à jour de la lettre médicale
        $lettre = LettreMedical::findOrFail($id);
        $lettre->update($request->all());

        return redirect()->route('lettres.index')->with('success', 'Lettre médicale mise à jour avec succès.');
    }

    /**
     * Supprimer une lettre médicale.
     */
    public function destroy($id)
    {
        $lettre = LettreMedical::findOrFail($id);
        $lettre->delete();

        return redirect()->route('lettres.index')->with('success', 'Lettre médicale supprimée avec succès.');
    }


}

