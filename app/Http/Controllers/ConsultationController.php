<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\DossierMedical;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConsultationController extends Controller
{
    /**
     * Afficher la liste des consultations.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $consultations = Consultation::all();
        return view('consultations.index', compact('consultations'));
    }

    /**
     * Afficher le formulaire de création d'une consultation.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        // Récupérer tous les dossiers médicaux disponibles
        $dossiers = DossierMedical::all();
        return view('consultations.create', compact('dossiers'));
    }

    /**
     * Enregistrer une nouvelle consultation dans la base de données.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validation des données de la consultation
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'date_consultation' => 'required|date',
            'motif' => 'required|string',
            'diagnostic' => 'required|string',
            'traitement' => 'required|string',
            'observations' => 'nullable|string',
            'statut' => 'required|in:terminée,en attente,annulée',
        ]);

        // Créer une nouvelle consultation
        Consultation::create([
            'dossier_medical_id' => $request->dossier_medical_id,
            'date_consultation' => $request->date_consultation,
            'motif' => $request->motif,
            'diagnostic' => $request->diagnostic,
            'traitement' => $request->traitement,
            'observations' => $request->observations,
            'statut' => $request->statut,
        ]);

        // Rediriger vers la liste des consultations avec un message de succès
        return redirect()->route('consultations.index')->with('success', 'Consultation créée avec succès.');
    }

    /**
     * Afficher les détails d'une consultation spécifique.
     *
     * @param Consultation $consultation
     * @return \Illuminate\View\View
     */
    public function show(Consultation $consultation)
    {
        return view('consultations.show', compact('consultation'));
    }

    /**
     * Afficher le formulaire pour modifier une consultation.
     *
     * @param Consultation $consultation
     * @return \Illuminate\View\View
     */
    public function edit(Consultation $consultation)
    {
        // Récupérer tous les dossiers médicaux disponibles
        $dossiers = DossierMedical::all();
        return view('consultations.edit', compact('consultation', 'dossiers'));
    }

    /**
     * Mettre à jour une consultation existante.
     *
     * @param \Illuminate\Http\Request $request
     * @param Consultation $consultation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Consultation $consultation)
    {
        // Validation des données de la consultation
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'date_consultation' => 'required|date',
            'motif' => 'required|string',
            'diagnostic' => 'required|string',
            'traitement' => 'required|string',
            'observations' => 'nullable|string',
            'statut' => 'required|in:terminée,en attente,annulée',
        ]);

        // Mettre à jour les informations de la consultation
        $consultation->update([
            'dossier_medical_id' => $request->dossier_medical_id,
            'date_consultation' => $request->date_consultation,
            'motif' => $request->motif,
            'diagnostic' => $request->diagnostic,
            'traitement' => $request->traitement,
            'observations' => $request->observations,
            'statut' => $request->statut,
        ]);

        // Rediriger après la mise à jour
        return redirect()->route('consultations.index')->with('success', 'Consultation mise à jour avec succès.');
    }

    /**
     * Supprimer une consultation spécifique.
     *
     * @param Consultation $consultation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Consultation $consultation)
    {
        $consultation->delete();
        return redirect()->route('consultations.index')->with('success', 'Consultation supprimée avec succès.');
    }
    
}
