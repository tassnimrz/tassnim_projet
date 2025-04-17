<?php

namespace App\Http\Controllers;

use App\Models\FichePatient;
use Illuminate\Http\Request;

class FichePatientController extends Controller
{
    public function index()
    {
        $fichePatients = FichePatient::all();

        if (request()->wantsJson()) {
            return response()->json($fichePatients);
        }

        return view('fiche-patient.index', compact('fichePatients'));
    }

    public function create()
    {
        return view('fiche-patient.create');
    }

    public function store(Request $request)
    {
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

        $fichePatient = FichePatient::create($validatedData);

        return response()->json($fichePatient, 201);
    }

  public function show(string $id)
    {
        // Trouver la fiche patient par son ID
        $fichePatient = FichePatient::findOrFail($id);

        // Récupérer l'utilisateur actuellement authentifié
        $user = auth()->user();

        // Vérifier si l'utilisateur est un médecin ou une secrétaire (en plus du patient)
        if ($user->hasRole('medecin') || $user->hasRole('secretaire')) {
            // Si l'utilisateur est un médecin ou une secrétaire, il peut voir toutes les fiches
            return view('fiche-patient.show', compact('fichePatient'));
        }

        // Vérifier si l'email de l'utilisateur correspond à celui de la fiche patient
        if ($user->email !== $fichePatient->email) {
            // Si l'email ne correspond pas, refuser l'accès
            abort(403, 'Accès non autorisé à cette fiche patient.');
        }

        // Si l'email correspond, afficher la fiche patient
        return view('fiche-patient.show', compact('fichePatient'));
    }


    
public function edit($id)
{
    $fichePatient = FichePatient::findOrFail($id); // On récupère la fiche par son ID

    return view('fiche-patient.edit', compact('fichePatient'));
}
public function update(Request $request, $id)
{
    $fichePatient = FichePatient::findOrFail($id);

    $validatedData = $request->validate([
        'nom' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'date_naissance' => 'required|date',
        'sexe' => 'required|in:Masculin,Féminin,Autre',
        'etat_civil' => 'required|in:Célibataire,Marié,Divorcé,Veuf',
        'telephone' => 'required|string|max:15',
        'email' => 'required|email|unique:fiche_patients,email,' . $fichePatient->id,
        'adresse' => 'nullable|string|max:255',
        'code_postal' => 'nullable|string|max:10',
        'ville' => 'nullable|string|max:100',
        'groupe_sanguin' => 'nullable|string|max:10',
        'date_premiere_visite' => 'nullable|date',
    ]);

 
  // Trouver et mettre à jour la fiche du patient
  $fichePatient = FichePatient::findOrFail($id);
  $fichePatient->update($validatedData);

  // Redirection vers la route 'fiche-patient'
  return redirect()->to('http://127.0.0.1:8000/fiche-patient');

}


    public function destroy($id)
    {
        $fichePatient = FichePatient::findOrFail($id);
        $fichePatient->delete();

        return response()->json(['message' => 'Fiche supprimée.']);
    }
    public function generatePDF($id)
    {
        $fiche = FichePatient::find($id);

        if (!$fiche) {
            return response()->json(['error' => 'Patient non trouvé'], 404);
        }

        // Générer le PDF ici (par exemple, en utilisant une bibliothèque comme domPDF ou mpdf)
        // Par exemple, tu peux utiliser 'dompdf/dompdf' pour générer un fichier PDF
        $pdf = \PDF::loadView('pdf.fiche_patient', compact('fiche'));

        return $pdf->download('fiche_patient_' . $fiche->id . '.pdf');
    }
}

