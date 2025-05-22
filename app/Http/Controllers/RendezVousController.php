<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;

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
        $rendezVous = RendezVous::with(['planningJour', 'medecin','patient'])->get();
    
        return response()->json($rendezVous);

    }
    public function prochainRdv(Request $request)
    {
        try {
            $user = auth()->user();
    
            if (!$user) {
                return response()->json(['message' => 'Non connecté'], 401);
            }
    
            // 👇 Affiche l'ID du user connecté pour vérifier
            Log::info('Utilisateur connecté : ' . $user->id);
    
            $rdv = RendezVous::with('planningJour')
                ->where('patient_id', $user->id)
                ->whereHas('planningJour', function ($query) {
                    $query->where('date', '>=', now()->toDateString());
                })
                ->orderByRaw('(SELECT date FROM planning_jours WHERE planning_jours.id = rendez_vous.planning_jour_id)')
                ->first();
    
            if (!$rdv) {
                return response()->json(['message' => 'Aucun rendez-vous trouvé'], 404);
            }
    
            if (!$rdv->planningJour) {
                return response()->json(['message' => 'PlanningJour manquant'], 500);
            }
    
            $planning = $rdv->planningJour;
            $medecin = $planning->medecin ?? User::find($planning->medecin_id);
    
            return response()->json([
                'date' => $planning->date,
                'heure' => $planning->heure_debut,
                'medecin' => $medecin ? $medecin->name : 'Docteur',
                'conseil' => "Préparez-vous bien pour votre rendez-vous. Buvez de l’eau et arrivez à l’heure.",
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur dans prochainRdv : ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage(),
            ], 500);
        }}
        public function capsuleSante()
{
    $user = auth()->user();

    $now = Carbon::now();
    $twoHoursLater = $now->copy()->addHours(2);

    $rdv = RendezVous::with(['medecin', 'planningJour'])
        ->where('patient_id', $user->id)
        ->whereHas('planningJour', function ($query) use ($now, $twoHoursLater) {
            $query->whereBetween('heure_debut', [$now, $twoHoursLater]);
        })
        ->first();

    if ($rdv && $rdv->planningJour) {
        $motif = strtolower($rdv->motif ?? 'général');
        $conseils = [
            'général' => 'Buvez de l’eau avant votre consultation.',
            'prise de sang' => 'Évitez de manger 12h avant la prise de sang.',
            'cardio' => 'Reposez-vous bien la veille.',
        ];

        $conseil = $conseils[$motif] ?? $conseils['général'];

        return response()->json([
            'date' => $rdv->planningJour->date,
            'heure' => $rdv->planningJour->heure_debut,
            'medecin' => $rdv->medecin->name ?? 'Médecin inconnu',
            'conseil' => $conseil
        ]);
    }

    return response()->json(null);
}
public function mesRendezVousPageblade()
{
    $user = Auth::user();
    $rendezVous = RendezVous::with(['planningJour', 'medecin'])
                ->where('patient_id', $user->id)
                ->orderByRaw('(SELECT date FROM planning_jours WHERE planning_jours.id = rendez_vous.planning_jour_id)')
                ->get();

    return view('mes-rendez-vous', compact('rendezVous'));
}

public function destroy($id)
{
    $user = Auth::user();
    
    // 1. Trouver le rendez-vous à supprimer
    $rendezVous = RendezVous::where('id', $id)
                ->where('patient_id', $user->id)
                ->firstOrFail();

    // 2. Sauvegarder l'ID du planning avant suppression
    $planningId = $rendezVous->planning_jour_id;
    $wasConfirmed = $rendezVous->statut === 'confirmé';
    
    // 3. Supprimer le rendez-vous
    $rendezVous->delete();

    // 4. Si c'était un rendez-vous confirmé, promouvoir un rendez-vous en attente
    if ($wasConfirmed) {
        $this->promouvoirProchainPatient($planningId);
    }

    return back()->with('success', 'Rendez-vous supprimé avec succès.');
}

protected function promouvoirProchainPatient($planningId)
{
    // 1. Trouver le planning concerné
    $planning = PlanningJour::findOrFail($planningId);
    
    // 2. Compter les rendez-vous confirmés restants
    $nbConfirmes = RendezVous::where('planning_jour_id', $planningId)
                   ->where('statut', 'confirmé')
                   ->count();
    
    // 3. Vérifier s'il reste de la place pour confirmer quelqu'un
    if ($nbConfirmes < $planning->nombre_max_patients) {
        // 4. Trouver le prochain patient en attente (le plus ancien)
        $prochainEnAttente = RendezVous::where('planning_jour_id', $planningId)
                             ->where('statut', 'attente')
                             ->orderBy('created_at')
                             ->first();
        
        // 5. Si trouvé, le confirmer
        if ($prochainEnAttente) {
            $prochainEnAttente->update([
                'statut' => 'confirmé',
                'position' => $nbConfirmes + 1
            ]);
            
       
        }
    }
}
public function tauxRendezVousJournalier()
{
    $today = now()->toDateString();
    $yesterday = now()->subDay()->toDateString();

    $rdvToday = RendezVous::whereHas('planningJour', function ($q) use ($today) {
        $q->whereDate('date', $today);
    })->count();

    $rdvYesterday = RendezVous::whereHas('planningJour', function ($q) use ($yesterday) {
        $q->whereDate('date', $yesterday);
    })->count();

    // Éviter la division par zéro et gérer les cas limites
    $evolution = 0;
    if ($rdvYesterday > 0) {
        $evolution = round((($rdvToday - $rdvYesterday) / $rdvYesterday) * 100);
    } else if ($rdvToday > 0) {
        $evolution = 100; // Cas où hier = 0 et aujourd'hui > 0
    }

    return response()->json([
        'today' => $rdvToday,
        'yesterday' => $rdvYesterday,
        'evolution' => $evolution,
    ]);
}
public function getAnnulationsCetteSemaine()
{
    $dateDebut = now()->subDays(7);
    
    $annulations = RendezVous::with(['patient', 'planningJour'])
        ->where('statut', 'annulé')
        ->whereHas('planningJour', function($query) use ($dateDebut) {
            $query->where('date', '>=', $dateDebut);
        })
        ->get()
        ->map(function($rdv) {
            return [
                'patient' => $rdv->patient ? $rdv->patient->name : 'Inconnu',
                'date' => $rdv->planningJour->date,
                'heure' => $rdv->planningJour->heure_debut
            ];
        });
    
    return response()->json($annulations);
}

public function getPatientFrequent()
{
    $rdvs = RendezVous::with('patient')->get();
    
    $patients = [];
    foreach ($rdvs as $rdv) {
        if ($rdv->patient) {
            $patients[$rdv->patient->id] = ($patients[$rdv->patient->id] ?? 0) + 1;
        }
    }
    
    arsort($patients);
    $mostFrequent = key($patients);
    
    $patient = User::find($mostFrequent);
    
    return response()->json([
        'patient' => $patient ? $patient->name : 'Inconnu',
        'count' => $patients[$mostFrequent] ?? 0
    ]);
}

public function statsPourChatbot()
{
    $aujourdhui = now()->toDateString();

    $rdvAujourdhui = RendezVous::with(['patient', 'medecin', 'planningJour'])
        ->whereHas('planningJour', function ($query) use ($aujourdhui) {
            $query->whereDate('date', $aujourdhui);
        })
        ->get();

    $annulationsSemaine = RendezVous::with(['patient', 'planningJour'])
        ->where('statut', 'annulé')
        ->whereHas('planningJour', function ($query) {
            $query->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()]);
        })
        ->get();

    $patientFrequent = RendezVous::selectRaw('patient_id, COUNT(*) as count')
        ->groupBy('patient_id')
        ->orderByDesc('count')
        ->first();

    $prochain = RendezVous::with(['planningJour', 'medecin'])
        ->where('statut', 'confirmé')
        ->whereHas('planningJour', function ($q) {
            $q->whereDate('date', '>=', now()->toDateString());
        })
        ->orderByRaw('(SELECT date FROM planning_jours WHERE planning_jours.id = rendez_vous.planning_jour_id)')
        ->first();

    // Calcul des stats journalières
    $todayCount = $rdvAujourdhui->count();
    $yesterdayCount = RendezVous::whereHas('planningJour', function ($q) {
        $q->whereDate('date', now()->subDay()->toDateString());
    })->count();

    $evolution = $yesterdayCount > 0 
        ? round((($todayCount - $yesterdayCount) / $yesterdayCount) * 100)
        : 0;

    return response()->json([
        'rdv_aujourdhui' => [
            'count' => $todayCount,
            'details' => $rdvAujourdhui->map(function ($rdv) {
                return [
                    'patient' => $rdv->patient->name ?? 'Inconnu',
                    'medecin' => $rdv->medecin->name ?? 'Inconnu',
                    'heure' => $rdv->planningJour->heure_debut ?? '--',
                    'statut' => $rdv->statut,
                ];
            }),
        ],
        'annulations_semaine' => $annulationsSemaine->map(function ($a) {
            return [
                'patient' => $a->patient->name ?? 'Inconnu',
                'date' => optional($a->planningJour)->date,
                'heure' => optional($a->planningJour)->heure_debut,
                'motif' => $a->motif ?? null,
            ];
        }),
        'patient_frequent' => $patientFrequent ? [
            'patient' => optional($patientFrequent->patient)->name ?? 'Inconnu',
            'count' => $patientFrequent->count,
        ] : ['patient' => 'Aucun', 'count' => 0],
        'prochain_rdv' => $prochain ? [
            'date' => $prochain->planningJour->date ?? 'N/A',
            'heure' => $prochain->planningJour->heure_debut ?? 'N/A',
            'medecin' => $prochain->medecin->name ?? 'Médecin',
            'conseil' => 'Soyez à l’heure et préparez vos documents.',
        ] : ['message' => 'Aucun RDV à venir.'],
        'stats_journalieres' => [
            'today' => $todayCount,
            'yesterday' => $yesterdayCount,
            'evolution' => $evolution,
        ]
    ]);
}


private function getRdvAujourdhui()
{
    $today = now()->toDateString();
    $rdvs = RendezVous::with(['patient', 'medecin', 'planningJour'])
        ->whereHas('planningJour', function($q) use ($today) {
            $q->whereDate('date', $today);
        })
        ->get()
        ->map(function($rdv) {
            return [
                'patient' => $rdv->patient->name ?? 'Inconnu',
                'medecin' => $rdv->medecin->name ?? 'Inconnu',
                'heure' => $rdv->planningJour->heure_debut,
                'statut' => $rdv->statut
            ];
        });

    return [
        'count' => $rdvs->count(),
        'details' => $rdvs
    ];
}
public function getRemplissageAujourdhui()
{
    $today = now()->toDateString();

    $rdvs = RendezVous::whereHas('planningJour', function ($query) use ($today) {
        $query->whereDate('date', $today);
    })->get();

    $confirmes = $rdvs->where('statut', 'confirmé')->count();
    $attentes = $rdvs->where('statut', 'attente')->count();
    $total = $confirmes + $attentes;

    return response()->json([
        'confirmes' => $confirmes,
        'attentes' => $attentes,
        'total' => $total
    ]);
}
public function rendezVousAujourdhui()
{
    $aujourdhui = date('Y-m-d');

    $rdvs = RendezVous::with(['patient', 'medecin', 'planningJour'])
        ->whereDate('created_at', $aujourdhui)  // Filtrer par date sur created_at
        ->get();

    return response()->json([
        'count' => $rdvs->count(),
        'confirmes' => $rdvs->where('statut', 'confirmé')->count(),
        'annules' => $rdvs->where('statut', 'annulé')->count(),
        'details' => $rdvs->map(function ($r) {
            return [
                'patient' => $r->patient->name ?? 'Inconnu',
                'medecin' => $r->medecin->name ?? 'Inconnu',
                'heure' => $r->created_at->format('H:i'), // heure du created_at
                'statut' => $r->statut,
            ];
        }),
    ]);
}









}