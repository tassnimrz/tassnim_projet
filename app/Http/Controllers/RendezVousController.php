<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Models\PlanningJour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RendezVousController extends Controller
{
    public function index()
    {
        $rendezVous = RendezVous::with('patient', 'medecin', 'planningJour')->get();
        $planningJours = PlanningJour::all();

        foreach ($planningJours as $planningJour) {
            $planningJour->rendezvous_confirmes = RendezVous::where('planning_jour_id', $planningJour->id)
                ->where('statut', 'confirmé')
                ->count();
        }

        return view('rendezvous.index', compact('rendezVous', 'planningJours'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:users,id',
            'planning_jour_id' => 'required|exists:planning_jours,id',
            'medecin_id' => 'required|exists:users,id',
            'position' => 'required|integer',
            'statut' => 'required|string',
            'priorite' => 'required|integer',
        ]);

        $planningJour = PlanningJour::find($validated['planning_jour_id']);
        $nombreConfirmes = RendezVous::where('planning_jour_id', $validated['planning_jour_id'])
            ->where('statut', 'confirmé')
            ->count();

        if ($nombreConfirmes >= $planningJour->max_patients) {
            return response()->json(['message' => 'Aucune place disponible pour ce créneau.'], 400);
        }

        $rendezVous = RendezVous::create($validated);

        return response()->json(['message' => 'Rendez-vous pris avec succès.', 'rendezVous' => $rendezVous], 201);
    }

    public function getDisponibilites()
    {
        $plannings = PlanningJour::with(['medecin', 'rendezVous'])
            ->get()
            ->map(function ($planning) {
                $nb_confirmes = $planning->rendezVous->where('statut', 'confirmé')->count();
                $nb_attente = $planning->rendezVous->where('statut', 'attente')->count();

                return [
                    'id' => $planning->id,
                    'date' => $planning->date,
                    'heure_debut' => $planning->heure_debut,
                    'heure_fin' => $planning->heure_fin,
                    'medecin' => [
                        'id' => $planning->medecin->id ?? null,
                        'name' => $planning->medecin->name ?? 'Inconnu',
                    ],
                    'nb_confirmes' => $nb_confirmes,
                    'nb_attente' => $nb_attente,
                    'nombre_max_patients' => $planning->max_patients,
                    'nombre_max_attente' => $planning->max_attente,
                ];
            });

        return response()->json($plannings);
    }

    public function reserver(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        // Récupérer le planning demandé
        $planning = PlanningJour::find($request->planning_jour_id);
        if (!$planning) {
            return response()->json(['message' => 'Créneau non trouvé.'], 404);
        }

        // Vérifier si l'utilisateur a déjà un rendez-vous le même jour
        $rendezVousMemeJour = RendezVous::where('patient_id', $user->id)
            ->whereHas('planningJour', function ($query) use ($planning) {
                $query->whereDate('date', $planning->date);
            })
            ->exists();

        if ($rendezVousMemeJour) {
            return response()->json([
                'message' => 'Vous avez déjà un rendez-vous pour ce jour-là.'
            ], 409);
        }

        // Vérifier les places disponibles
        $confirmes = RendezVous::where('planning_jour_id', $planning->id)
            ->where('statut', 'confirmé')->count();

        $attentes = RendezVous::where('planning_jour_id', $planning->id)
            ->where('statut', 'attente')->count();

        if ($confirmes < $planning->nombre_max_patients) {
            $statut = 'confirmé';
            $position = $confirmes + 1;
        } elseif ($attentes < $planning->nombre_max_attente) {
            $statut = 'attente';
            $position = $confirmes + $attentes + 1;
        } else {
            return response()->json([
                'message' => 'Désolé, ce créneau est complet (confirmés + attente).'
            ], 409);
        }

        // Enregistrement du rendez-vous
        $rendezVous = RendezVous::create([
            'patient_id' => $user->id,
            'medecin_id' => $planning->medecin_id,
            'planning_jour_id' => $planning->id,
            'statut' => $statut,
            'position' => $position,
            'priorite' => rand(1, 5),
        ]);

        return response()->json([
            'message' => "Votre rendez-vous a été $statut avec succès.",
            'rendezVous' => $rendezVous
        ]);
    }

    public function consulterRendezVous()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $rendezVous = RendezVous::with(['planningJour', 'medecin'])
            ->where('patient_id', $user->id)
            ->get();

        return response()->json($rendezVous);
    }

    public function mesRendezVous(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $rendezVous = RendezVous::with(['planningJour', 'medecin'])
            ->where('patient_id', $user->id)
            ->get();

        return response()->json($rendezVous);
    }
    public function tousRendezVous()
    {
        $rendezVous = RendezVous::with(['planningJour', 'medecin'])->get();
    
        return response()->json($rendezVous);
    }
}    