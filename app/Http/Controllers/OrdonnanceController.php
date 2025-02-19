<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use App\Models\Consultation;
use App\Models\DossierMedical;
use Illuminate\Http\Request;

class OrdonnanceController extends Controller
{
    /**
     * Afficher la liste des ordonnances.
     */
    public function index()
    {
        $ordonnances = Ordonnance::with(['consultation', 'dossierMedical'])->get();
        return view('ordonnances.index', compact('ordonnances'));
    }

    /**
     * Afficher le formulaire de création d'une ordonnance.
     */
    public function create()
    {
        $consultations = Consultation::all();
        $dossiers_medicaux = DossierMedical::all();
        return view('ordonnances.create', compact('consultations', 'dossiers_medicaux'));
    }

    /**
     * Enregistrer une nouvelle ordonnance.
     */
    public function store(Request $request)
    {
        $request->validate([
            'consultation_id' => 'required|exists:consultations,id',
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'description' => 'required|string',
            'date_ordonnance' => 'required|date',
            'statut' => 'required|in:valide,expirée,annulée',
            'duree' => 'nullable|integer|min:1'
        ]);

        Ordonnance::create($request->all());

        return redirect()->route('ordonnances.index')->with('success', 'Ordonnance créée avec succès.');
    }

    /**
     * Afficher une ordonnance spécifique.
     */
    public function show(Ordonnance $ordonnance)
    {
        return view('ordonnances.show', compact('ordonnance'));
    }

    /**
     * Afficher le formulaire d'édition d'une ordonnance.
     */
    public function edit(Ordonnance $ordonnance)
    {
        $consultations = Consultation::all();
        $dossiers_medicaux = DossierMedical::all();
        return view('ordonnances.edit', compact('ordonnance', 'consultations', 'dossiers_medicaux'));
    }

    /**
     * Mettre à jour une ordonnance.
     */
    public function update(Request $request, Ordonnance $ordonnance)
    {
        $request->validate([
            'consultation_id' => 'required|exists:consultations,id',
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'description' => 'required|string',
            'date_ordonnance' => 'required|date',
            'statut' => 'required|in:valide,expirée,annulée',
            'duree' => 'nullable|integer|min:1'
        ]);

        $ordonnance->update($request->all());

        return redirect()->route('ordonnances.index')->with('success', 'Ordonnance mise à jour.');
    }

    /**
     * Supprimer une ordonnance.
     */
    public function destroy(Ordonnance $ordonnance)
    {
        $ordonnance->delete();
        return redirect()->route('ordonnances.index')->with('success', 'Ordonnance supprimée.');
    }
}
