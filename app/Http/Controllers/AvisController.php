<?php

namespace App\Http\Controllers;

use App\Models\Avis; // Importation du modèle
use Illuminate\Http\Request;

// AvisController.php

namespace App\Http\Controllers;

use App\Models\Avis; // Importation du modèle
use Illuminate\Http\Request;

class AvisController extends Controller
{
    // Afficher tous les avis dans la vue dashboard/admin
    public function index()
    {
        $avis = Avis::all();
        return response()->json($avis);
    }

    // Méthode pour obtenir les statistiques des avis
    public function getStats()
    {
        try {
            $totalAvis = Avis::count(); // Nombre total d'avis
            $totalPositifs = Avis::where('note', '>=', 4)->count(); // Avis positifs (par exemple, note >= 4)
            $totalNegatifs = Avis::where('note', '<', 4)->count(); // Avis négatifs (note < 4)
            $tauxSatisfaction = ($totalPositifs / $totalAvis) * 100;
            $tauxMecontentement = ($totalNegatifs / $totalAvis) * 100;

            return response()->json([
                'totalAvis' => $totalAvis,
                'totalPositifs' => $totalPositifs,
                'totalNegatifs' => $totalNegatifs,
                'tauxSatisfaction' => $tauxSatisfaction,
                'tauxMecontentement' => $tauxMecontentement,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors du calcul des statistiques.'], 500);
        }
    }
}