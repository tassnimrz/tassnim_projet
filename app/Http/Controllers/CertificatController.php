<?php

namespace App\Http\Controllers;

use App\Models\Certificat;
use App\Models\DossierMedical;
use App\Models\User;
use Illuminate\Http\Request;

class CertificatController extends Controller
{
    /**
     * Afficher la liste des certificats.
     */
    public function index()
    {
        // Récupérer tous les certificats avec les informations associées (dossier médical et fiche patient)
        $certificats = Certificat::with('dossierMedical.fichePatient')->get();

        return view('certificats.index', compact('certificats'));
    }

    /**
     * Afficher le formulaire pour créer un certificat.
     */
    public function create()
    {
        // Récupérer les dossiers médicaux et les utilisateurs pour remplir le formulaire
        $dossiers = DossierMedical::all();
        $users = User::all();

        return view('certificats.create', compact('dossiers', 'users'));
    }

    /**
     * Enregistrer un nouveau certificat dans la base de données.
     */
    public function store(Request $request)
    {
        // Validation des données du formulaire
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'user_id' => 'nullable|exists:users,id',
            'type_certificat' => 'required|in:aptitude,repos,dispense',
            'date_certificat' => 'required|date',
            'description' => 'nullable|string',
            'confirmation_medecin' => 'nullable|boolean',
            'jours_repos' => 'nullable|integer',
            'periode_dispense' => 'nullable|string',
        ]);

        // Création du certificat
        Certificat::create($request->all());

        return redirect()->route('certificats.index')->with('success', 'Certificat créé avec succès.');
    }

    /**
     * Afficher les détails d'un certificat spécifique.
     */
    public function show($id)
    {
        // Récupérer le certificat avec ses relations associées (dossier médical et fiche patient)
        $certificat = Certificat::with('dossierMedical.fichePatient')->findOrFail($id);

        return view('certificats.show', compact('certificat'));
    }

    /**
     * Afficher le formulaire pour modifier un certificat existant.
     */
    public function edit($id)
    {
        // Récupérer le certificat à modifier, ainsi que les dossiers médicaux et utilisateurs
        $certificat = Certificat::findOrFail($id);
        $dossiers = DossierMedical::all();
        $users = User::all();

        return view('certificats.edit', compact('certificat', 'dossiers', 'users'));
    }

    /**
     * Mettre à jour les informations d'un certificat.
     */
    public function update(Request $request, $id)
    {
        // Validation des données du formulaire
        $request->validate([
            'dossier_medical_id' => 'required|exists:dossiers_medicaux,id',
            'user_id' => 'nullable|exists:users,id',
            'type_certificat' => 'required|in:aptitude,repos,dispense',
            'date_certificat' => 'required|date',
            'description' => 'nullable|string',
            'confirmation_medecin' => 'nullable|boolean',
            'jours_repos' => 'nullable|integer',
            'periode_dispense' => 'nullable|string',
        ]);

        // Mise à jour du certificat
        $certificat = Certificat::findOrFail($id);
        $certificat->update($request->all());

        return redirect()->route('certificats.index')->with('success', 'Certificat mis à jour avec succès.');
    }

    /**
     * Supprimer un certificat.
     */
    public function destroy($id)
    {
        // Récupérer le certificat à supprimer
        $certificat = Certificat::findOrFail($id);
        $certificat->delete();

        return redirect()->route('certificats.index')->with('success', 'Certificat supprimé avec succès.');
    }
}
