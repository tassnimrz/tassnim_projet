<?php

namespace App\Http\Controllers;

use App\Models\FichePatient;
use App\Models\DossierMedical;
use Illuminate\Http\Request;

class FichePatientController extends Controller
{
    /**
     * Afficher la liste des fiches patients.
     */
    public function index()
    {
        // Récupérer toutes les fiches patients
        $fichePatients = FichePatient::all();

        // Retourner une vue avec la liste des fiches
        return view('fiche-patient.index', compact('fichePatients'));
    }

    /**
     * Afficher le formulaire pour créer une nouvelle fiche patient.
     */
    public function create()
    {
        // Retourner la vue de création de fiche patient
        return view('fiche-patient.create');
    }

    /**
     * Enregistrer une nouvelle fiche patient dans la base de données.
     */
    public function store(Request $request)
{
    // Validation des données de la fiche patient
    $validatedData = $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'date_naissance' => 'required|date',
        'sexe' => 'required|in:Masculin,Féminin,Autre',
        'etat_civil' => 'required|in:Célibataire,Marié,Divorcé,Veuf',
        'telephone' => 'required|string|max:15',
        'email' => 'required|email|unique:fiche_patients,email',
        'adresse' => 'nullable|string|max:255',
        'ville' => 'nullable|string|max:255',
        'code_postal' => 'nullable|string|max:10',
        'groupe_sanguin' => 'nullable|string|max:5',
        'allergies' => 'nullable|string',
        'antecedents_medicaux' => 'nullable|string',
        'traitement_en_cours' => 'nullable|string',
        'assurance_medicale' => 'nullable|string',
        'numero_assurance' => 'nullable|string|max:50',
        'date_premiere_visite' => 'required|date',
    ]);

    // Créer la fiche patient
    $fichePatient = FichePatient::create($validatedData);

    // Vérifier si un dossier médical existe déjà pour ce patient
    $existingDossier = DossierMedical::where('fiche_patient_id', $fichePatient->id)->first();

    if (!$existingDossier) {
        // Créer un dossier médical si aucun dossier n'existe pour ce patient
        DossierMedical::create([
            'fiche_patient_id' => $fichePatient->id,
            'vaccins' => null,
            'notes_medecin' => null,
        ]);
    }

    // Retourner à la vue ou rediriger vers une autre page
    return redirect()->route('fiche-patient.index')->with('success', 'Fiche patient et dossier médical créés avec succès.');
}
    /**
     * Afficher une fiche patient spécifique.
     */
    public function show(string $id)
    {
        // Trouver la fiche patient par son ID
        $fichePatient = FichePatient::findOrFail($id);

        // Afficher la fiche patient
        return view('fiche-patient.show', compact('fichePatient'));
    }

    /**
     * Afficher le formulaire pour modifier une fiche patient.
     */
    public function edit(string $id)
    {
        // Trouver la fiche patient par son ID
        $fichePatient = FichePatient::findOrFail($id);

        // Afficher le formulaire d'édition de la fiche patient
        return view('fiche-patient.edit', compact('fichePatient'));
    }

    /**
     * Mettre à jour une fiche patient.
     */
    public function update(Request $request, string $id)
    {
        // Validation des données du formulaire
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'sexe' => 'required|in:Masculin,Féminin,Autre',
            'etat_civil' => 'required|in:Célibataire,Marié,Divorcé,Veuf',
            'telephone' => 'required|string|max:15',
            'email' => 'required|email|unique:fiche_patients,email,' . $id,
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:10',
            'groupe_sanguin' => 'nullable|string|max:5',
            'allergies' => 'nullable|string',
            'antecedents_medicaux' => 'nullable|string',
            'traitement_en_cours' => 'nullable|string',
            'assurance_medicale' => 'nullable|string',
            'numero_assurance' => 'nullable|string|max:50',
            'date_premiere_visite' => 'required|date',
        ]);

        // Trouver la fiche patient à mettre à jour
        $fichePatient = FichePatient::findOrFail($id);

        // Mettre à jour la fiche patient
        $fichePatient->update($validatedData);

        // Retourner à la fiche patient ou à la liste avec un message de succès
        return redirect()->route('fiche-patient.show', $id)->with('success', 'Fiche patient mise à jour avec succès!');
    }

    /**
     * Supprimer une fiche patient.
     */
    public function destroy(string $id)
    {
        // Trouver et supprimer la fiche patient
        $fichePatient = FichePatient::findOrFail($id);

        // Supprimer le dossier médical lié à cette fiche patient
        $fichePatient->dossierMedical()->delete();

        // Supprimer la fiche patient
        $fichePatient->delete();

        // Retourner à la liste des fiches patients avec un message de succès
        return redirect()->route('fiche-patient.index')->with('success', 'Fiche patient et son dossier médical supprimés avec succès!');
    }
}
