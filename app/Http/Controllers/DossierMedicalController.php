<?php

namespace App\Http\Controllers;

use App\Models\DossierMedical;
use App\Models\FichePatient;
use Illuminate\Http\Request;

class DossierMedicalController extends Controller
{
    /**
     * Affiche le formulaire pour créer un dossier médical pour un patient donné.
     *
     * @param  int  $fichePatientId
     * @return \Illuminate\View\View
     */
    public function create($fichePatientId)
    {
        // Trouver le patient par son ID
        $fichePatient = FichePatient::findOrFail($fichePatientId);

        // Retourner la vue avec l'objet patient
        return view('dossier-medical.create', compact('fichePatient'));
    }

    /**
     * Enregistre un nouveau dossier médical pour un patient.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'fiche_patient_id' => 'required|exists:fiche_patients,id', // Assurez-vous que l'ID du patient existe
            'vaccins' => 'nullable|string',
            'notes_medecin' => 'nullable|string',
        ]);

        $existingDossier = DossierMedical::where('fiche_patient_id', $request->fiche_patient_id)->first();

    if ($existingDossier) {
        // Si un dossier médical existe déjà, retourner une erreur ou une alerte
        return redirect()->back()->with('error', 'Ce patient a déjà un dossier médical.');
    }

    // Si aucun dossier médical n'existe, créer un nouveau dossier médical
    DossierMedical::create($validatedData);



        // Rediriger avec un message de succès
        return redirect()->route('dossier-medical.index')->with('success', 'Dossier médical créé avec succès!');
    }

    /**
     * Affiche une liste de tous les dossiers médicaux.
     *
     * @return \Illuminate\View\View
     */
    public function index()
{
    // Récupérer tous les dossiers médicaux avec la relation 'fichePatient'
    $dossiersMedicaux = DossierMedical::with('fichePatient')->get();

    // Vérifier si des dossiers sont récupérés
    if ($dossiersMedicaux->isEmpty()) {
        session()->flash('error', 'Aucun dossier médical disponible.');
    }

    // Retourner la vue avec les dossiers médicaux
    return view('dossier-medical.index', compact('dossiersMedicaux'));
}




    /**
     * Affiche un dossier médical spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\View\View
     */
    public function show($id)
    {
        // Trouver le dossier médical par son ID
        $dossierMedical = DossierMedical::findOrFail($id);

        // Retourner la vue avec le dossier médical
        return view('dossier-medical.show', compact('dossierMedical'));
    }

    /**
     * Affiche le formulaire pour éditer un dossier médical spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\View\View
     */
    public function edit($id)
    {
        // Trouver le dossier médical par son ID
        $dossierMedical = DossierMedical::findOrFail($id);

        // Retourner la vue d'édition avec le dossier médical
        return view('dossier-medical.edit', compact('dossierMedical'));
    }

    /**
     * Met à jour un dossier médical existant.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Validation des données
        $validatedData = $request->validate([
            'vaccins' => 'nullable|string',
            'notes_medecin' => 'nullable|string',
        ]);

        // Trouver le dossier médical par son ID
        $dossierMedical = DossierMedical::findOrFail($id);

        // Mettre à jour le dossier médical
        $dossierMedical->update($validatedData);

        // Rediriger avec un message de succès
        return redirect()->route('dossier-medical.index')->with('success', 'Dossier médical mis à jour avec succès!');
    }

    /**
     * Supprimer un dossier médical spécifique.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        // Trouver le dossier médical par son ID
        $dossierMedical = DossierMedical::findOrFail($id);

        // Supprimer le dossier médical
        $dossierMedical->delete();

        // Rediriger avec un message de succès
        return redirect()->route('dossier-medical.index')->with('success', 'Dossier médical supprimé avec succès!');
    }
}
