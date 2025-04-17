<?php

namespace App\Http\Controllers;

use App\Models\PlanningJour;  // Importer le modèle PlanningJour
use Illuminate\Http\Request;

class PlanningJourController extends Controller
{
    public function index()
{
    // Récupérer les plannings avec la relation 'medecin'
    $plannings = PlanningJour::with('medecin')->get();
    return response()->json($plannings);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'medecin_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'nombre_max_attente' => 'required|integer',
            'nombre_max_patients' => 'required|integer',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i',
        ]);

        // Créer un nouveau planning jour
        $planningJour = PlanningJour::create([
            'medecin_id' => $request->medecin_id,
            'date' => $request->date,
            'nombre_max_attente' => $request->nombre_max_attente,
            'nombre_max_patients' => $request->nombre_max_patients,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
        ]);

        return response()->json($planningJour, 201);
    }
    public function getDisponibilites()
{
    $plannings = PlanningJour::with(['medecin', 'rendezVousConfirmes', 'rendezVousAttente'])
        ->get()
        ->map(function ($planning) {
            return [
                'id' => $planning->id,
                'date' => $planning->date,
                'heure_debut' => $planning->heure_debut,
                'heure_fin' => $planning->heure_fin,
                'medecin' => $planning->medecin->name ?? null,
                'places_confirmes_restantes' => $planning->nombre_max_patients - $planning->rendezVousConfirmes->count(),
                'places_attente_restantes' => $planning->nombre_max_attente - $planning->rendezVousAttente->count(),
            ];
        });

    return response()->json($plannings);
}
public function destroy($id)
{
    $planning = PlanningJour::find($id);

    if (!$planning) {
        return response()->json(['message' => 'Planning non trouvé'], 404);
    }

    $planning->delete();

    return response()->json(['message' => 'Planning supprimé avec succès']);
}
}

