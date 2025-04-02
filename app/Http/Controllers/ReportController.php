<?php

namespace App\Http\Controllers;

use App\Models\Consultation; // Importation du modèle
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        // Obtenir toutes les consultations
        $consultations = Consultation::all();

        // Retourner les données à la vue
        return view('reports.index', ['consultations' => $consultations]);
    }

    public function getReports()
    {
        // Nombre de consultations réussies
        $totalReussies = Consultation::where('statut', 'terminée')->count();

        // Nombre de consultations annulées
        $totalAnnulees = Consultation::where('statut', 'en attente')->count();

        // Nombre total de consultations terminées (réussies ou annulées uniquement)
        $totalConsultationsTerminees = Consultation::whereIn('statut', ['terminée', 'en attente'])->count();

        // Calcul du taux de réussite et d'annulation
        $tauxReussite = $totalConsultationsTerminees > 0 ? ($totalReussies / $totalConsultationsTerminees) * 100 : 0;
        $tauxAnnulation = $totalConsultationsTerminees > 0 ? ($totalAnnulees / $totalConsultationsTerminees) * 100 : 0;
        // Statistiques par motif
        $motifStats = Consultation::select('motif', \DB::raw('count(*) as total'))
                        ->groupBy('motif')
                        ->get();
        return response()->json([
            'totalConsultations' => $totalConsultationsTerminees,
            'totalReussies' => $totalReussies,
            'totalAnnulees' => $totalAnnulees,
            'tauxReussite' => round($tauxReussite, 2),
            'tauxAnnulation' => round($tauxAnnulation, 2),
            'motifStats' => $motifStats
        ]);
    }
}
