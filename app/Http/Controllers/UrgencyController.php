<?php
namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Urgency;
use Illuminate\Http\Request;
use Twilio\Rest\Client;
use App\Events\UrgencyStatusUpdated;
use Illuminate\Support\Facades\DB;

class UrgencyController extends Controller
{
    public function bladePage()
{
    // Charger les urgences
    $urgencies = Urgency::orderBy('created_at', 'desc')->get();

    // Charger les urgences récentes (5 dernières)
    $recentUrgencies = Urgency::orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    // Urgences actives (états spécifiques)
    $activeUrgencies = Urgency::whereIn('etat', ['en_attente', 'appel_en_cours', 'ambulance_en_route'])
        ->get();

    // Charger tous les utilisateurs (médecins, opérateurs, etc.)
    $users = User::all();

    // Statistiques CORRIGÉES - utiliser les mêmes noms que dans la BD
    $enAttente = Urgency::where('etat', 'en_attente')->count();
    $terminees = Urgency::where('etat', 'termine')->count(); // ou 'terminee' selon votre BD
    $echecs = Urgency::where('etat', 'echec')->count();
    $total = $enAttente + $terminees + $echecs; // Ou simplement Urgency::count()

    // Liste des hôpitaux
    $hospitals = $this->getTunisianHospitalList();
   
    $hospitalsData = $this->getHospitalsData();
    // Liste des gouvernorats
    $gouvernorats = Urgency::gouvernorats();
    $monthlyData = Urgency::selectRaw('EXTRACT(MONTH FROM created_at)::integer as month, COUNT(*) as count')
    ->whereYear('created_at', date('Y'))
    ->groupBy('month')
    ->orderBy('month')
    ->get()
    ->pluck('count', 'month')
    ->toArray();

// Remplir tous les mois (même ceux sans données)
$monthlyCounts = [];
for ($i = 1; $i <= 12; $i++) {
    $monthlyCounts[] = $monthlyData[$i] ?? 0;
}

// Pour les urgences terminées par mois
$monthlyTerminated = Urgency::selectRaw('EXTRACT(MONTH FROM created_at)::integer as month, COUNT(*) as count')
    ->whereYear('created_at', date('Y'))
    ->where('etat', 'termine')
    ->groupBy('month')
    ->orderBy('month')
    ->get()
    ->pluck('count', 'month')
    ->toArray();

$monthlyTerminatedCounts = [];
for ($i = 1; $i <= 12; $i++) {
    $monthlyTerminatedCounts[] = $monthlyTerminated[$i] ?? 0;
}

    return view('urgencies.single_page', compact(
        'urgencies',
        'recentUrgencies',
        'activeUrgencies',
        'users',
        'enAttente',
        'terminees',
        'echecs',
        'total',
        'hospitals',
        'gouvernorats',
        'monthlyCounts',
        'hospitalsData',
          'monthlyCounts',
    'monthlyTerminatedCounts'
    ));
}


    public function store(Request $request)
    {
        $data = $request->validate([
            'nom_patient' => 'required',
            'telephone' => 'required',
            'adresse' => 'required',
            'age' => 'nullable|integer',
            'symptomes' => 'required',
            'type_urgence' => 'required|in:ambulance,samu,autre',
            'hopital_cible' => 'required', // Champ maintenant obligatoire
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'ville' => 'nullable|string',
            'gouvernorat' => 'nullable|string'
        ]);

        $urgency = Urgency::create($data);
        
        if ($request->input('initier_appel')) {
            $this->initierAppelUrgence($urgency);
        }

        return response()->json($urgency);
    }

    public function edit($id)
    {
        $urgency = Urgency::findOrFail($id);
        $hospitals = $this->getTunisianHospitalList();
        return response()->json([
            'urgency' => $urgency,
            'hospitals' => $hospitals
        ]);
    }

    public function update(Request $request, $id)
    {
        $urgency = Urgency::findOrFail($id);
        
        $data = $request->validate([
            'nom_patient' => 'required',
            'telephone' => 'required',
            'adresse' => 'required',
            'age' => 'nullable|integer',
            'symptomes' => 'required',
            'type_urgence' => 'required|in:ambulance,samu,autre',
            'hopital_cible' => 'required', // Champ maintenant obligatoire
            'etat' => 'sometimes|required',
            'notes_appel' => 'nullable',
            'ville' => 'nullable|string',
            'gouvernorat' => 'nullable|string'
        ]);

        $urgency->update($data);
        
        if ($request->has('etat') && $urgency->wasChanged('etat')) {
            event(new UrgencyStatusUpdated($urgency));
        }

        return response()->json($urgency);
    }

    public function destroy($id)
    {
        Urgency::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function initierAppel(Request $request, $id)
    {
        $urgency = Urgency::findOrFail($id);
        
        // Vérification supplémentaire
        if (empty($urgency->hopital_cible)) {
            return response()->json([
                'success' => false,
                'error' => 'Veuillez sélectionner un hôpital cible avant d\'initier l\'appel'
            ], 422);
        }

        $result = $this->initierAppelUrgence($urgency);
        return response()->json($result);
    }

    protected function initierAppelUrgence(Urgency $urgency)
    {
        try {
            // Vérification des paramètres Twilio
            $requiredConfigs = ['sid', 'token', 'from'];
            foreach ($requiredConfigs as $config) {
                if (empty(config("services.twilio.$config"))) {
                    throw new \Exception("Configuration Twilio incomplète: $config manquant");
                }
            }

            // Récupération du numéro à appeler
            $hospitalNumber = $this->getHospitalPhoneNumber($urgency->hopital_cible);
            
            // Initialisation client Twilio
            $twilio = new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );

            // Message d'urgence
            $message = $this->generateEmergencyMessage($urgency);
            $callUrl = route('urgency.call.message', ['message' => urlencode($message)]);

            // Passer l'appel
            $call = $twilio->calls->create(
                $hospitalNumber,
                config('services.twilio.from'),
                [
                    'url' => $callUrl,
                    'statusCallback' => route('urgency.call.status', ['urgency' => $urgency->id]),
                    'timeout' => 30,
                ]
            );

            // Mise à jour de l'urgence
            $urgency->update([
                'etat' => Urgency::ETAT_APPEL_EN_COURS,
                'notes_appel' => ($urgency->notes_appel ?? '')."\nAppel initié: ".now()." (SID: ".$call->sid.")"
            ]);

            return [
                'success' => true,
                'call_sid' => $call->sid,
                'message' => 'Appel initié avec succès vers '.$hospitalNumber
            ];

        } catch (\Exception $e) {
            \Log::error("Erreur appel urgence: ".$e->getMessage());
            
            $urgency->update([
                'etat' => Urgency::ETAT_ECHEC,
                'notes_appel' => ($urgency->notes_appel ?? '')."\nÉchec appel: ".$e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
public function statsPage()
{
    $total = Urgency::count();
    $enAttente = Urgency::where('etat', 'en_attente')->count();
    $terminees = Urgency::where('etat', 'terminee')->count();
    $echecs = Urgency::where('etat', 'echec')->count();

    return view('urgency.stats', [
        'total' => $total,
        'enAttente' => $enAttente,
        'terminees' => $terminees,
        'echecs' => $echecs,
    ]);
}
    
    protected function getTunisianHospitalList()
    {
        return [
            'Hôpital Charles Nicolle Tunis' => '+21693114631',
            'Hôpital La Rabta Tunis' => '+21693114631',
            'Hôpital Habib Thameur Tunis' => '+21693114631',
            'Hôpital militaire Tunis' => '+21693114631',
            'Hôpital Farhat Hached Sousse' => '+21693114631',
            'Hôpital Sahloul Sousse' => '+21693114631',
            'Hôpital Fattouma Bourguiba Monastir' => '+21693114631',
            'Hôpital Hédi Chaker Sfax' => '+21693114631',
            'Hôpital Taher Sfar Mahdia' =>'+21693114631',
            'Hôpital Ibn Jazzar Kairouan' => '+21693114631',
            'SAMU Tunisie' => '190'
        ];
    }
    
    protected function getHospitalPhoneNumber($hospitalName)
    {
        $hospitals = $this->getTunisianHospitalList();
        
        if ($hospitalName && isset($hospitals[$hospitalName])) {
            return $hospitals[$hospitalName];
        }
        
        return config('services.twilio.emergency_default', '190');
    }
    
    protected function generateEmergencyMessage(Urgency $urgency)
    {
        return sprintf(
            "Bonjour, nous avons une urgence médicale. " .
            "Patient: %s, %d ans. Symptômes: %s. " .
            "Adresse: %s, %s. " .
            "Nous demandons une %s immédiate. " .
            "Merci de confirmer la prise en charge.",
            $urgency->nom_patient,
            $urgency->age ?? 'âge inconnu',
            $urgency->symptomes,
            $urgency->adresse,
            $urgency->ville ?? 'Tunisie',
            $urgency->type_urgence == 'samu' ? 'intervention du SAMU' : 'ambulance'
        );
    }
    
    public function handleCallStatus(Request $request, $urgencyId)
    {
        $urgency = Urgency::findOrFail($urgencyId);
        $status = $request->input('CallStatus');
        
        $newState = $urgency->etat;
        $notes = $urgency->notes_appel ?? '';
        
        switch ($status) {
            case 'completed':
                $newState = Urgency::ETAT_AMBULANCE_EN_ROUTE;
                $notes .= "\nAppel complété avec succès à " . now();
                break;
            case 'failed':
            case 'busy':
            case 'no-answer':
                $newState = Urgency::ETAT_ECHEC;
                $notes .= "\nÉchec de l'appel: " . $status . " à " . now();
                break;
        }
        
        $urgency->update([
            'etat' => $newState,
            'notes_appel' => $notes
        ]);
        
        return response()->json(['success' => true]);
    }
    public function getUrgencyStats()
{
    // Statistiques par type d'urgence
    $types = Urgency::selectRaw('type_urgence as type, count(*) as count')
        ->groupBy('type_urgence')
        ->get();

    // Statistiques par gouvernorat
    $regions = Urgency::selectRaw('gouvernorat as region, count(*) as count')
        ->whereNotNull('gouvernorat')
        ->groupBy('gouvernorat')
        ->orderByDesc('count')
        ->limit(5)
        ->get();

    // Évolution mensuelle
    $monthly = Urgency::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, count(*) as count')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    // Temps moyen de traitement
    $avgTime = Urgency::selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as avg_time')
        ->where('etat', 'termine')
        ->first();

    return response()->json([
        'types' => $types,
        'regions' => $regions,
        'monthly' => $monthly,
        'avg_time' => round($avgTime->avg_time ?? 0),
        'total' => Urgency::count(),
        'today' => Urgency::whereDate('created_at', today())->count(),
        'success_rate' => Urgency::where('etat', 'termine')->count() / max(1, Urgency::count()) * 100
    ]);
}


protected function getHospitalsData()
{
    return [
        'Hôpital Charles Nicolle Tunis' => [
            'phone' => '+21671336000',
            'city' => 'Tunis',
            'region' => 'Tunis',
            'lat' => 36.8065,
            'lng' => 10.1815,
            'type' => 'public'
        ],
        'Hôpital La Rabta Tunis' => [
            'phone' => '+21671566000',
            'city' => 'Tunis',
            'region' => 'Tunis',
            'lat' => 36.8136,
            'lng' => 10.1651,
            'type' => 'public'
        ],
        'Hôpital Habib Thameur Tunis' => [ // Ajouté
            'phone' => '+21671569000',
            'city' => 'Tunis',
            'region' => 'Tunis',
            'lat' => 36.8202,
            'lng' => 10.1674,
            'type' => 'public'
        ],
        'Hôpital militaire Tunis' => [ // Ajouté
            'phone' => '+21671783000',
            'city' => 'Tunis',
            'region' => 'Tunis',
            'lat' => 36.8406,
            'lng' => 10.1734,
            'type' => 'public'
        ],
        'Clinique Les Oliviers' => [
            'phone' => '+21671783000',
            'city' => 'Tunis',
            'region' => 'Tunis',
            'lat' => 36.8382,
            'lng' => 10.1657,
            'type' => 'private'
        ],
        // Ajoutez tous les autres hôpitaux de votre liste
    ];
}
public function showDashboard()
{
    // 1. Répartition par type d'urgence (existant)
    $urgencyTypes = Urgency::select('type_urgence', DB::raw('count(*) as total'))
        ->groupBy('type_urgence')
        ->pluck('total', 'type_urgence');

    // 2. Statistiques des 7 derniers jours (existant)
    $dates = [];
    $dailyCounts = [];
    for ($i = 6; $i >= 0; $i--) {
        $date = Carbon::now()->subDays($i)->format('Y-m-d');
        $dates[] = $date;
        $dailyCounts[] = Urgency::whereDate('created_at', $date)->count();
    }

    // 3. Répartition par tranche d'âge (existant)
    $ageGroups = [
        '0-17' => Urgency::where('age', '<', 18)->count(),
        '18-30' => Urgency::whereBetween('age', [18, 30])->count(),
        '31-50' => Urgency::whereBetween('age', [31, 50])->count(),
        '51-70' => Urgency::whereBetween('age', [51, 70])->count(),
        '71+' => Urgency::where('age', '>', 70)->count()
    ];

    // 4. Statut des urgences (existant)
    $statusCounts = [
        'en_attente' => Urgency::where('etat', 'en_attente')->count(),
        'appel_en_cours' => Urgency::where('etat', 'appel_en_cours')->count(),
        'termine' => Urgency::where('etat', 'termine')->count(),
        'echec' => Urgency::where('etat', 'echec')->count()
    ];

    // 5. NOUVEAU: Répartition par hôpital (basé sur hopital_cible)
    $hospitalDistribution = Urgency::select('hopital_cible', DB::raw('count(*) as total'))
        ->whereNotNull('hopital_cible')
        ->groupBy('hopital_cible')
        ->orderBy('total', 'desc')
        ->limit(10) // On limite aux 10 hôpitaux les plus sollicités
        ->get()
        ->mapWithKeys(function ($item) {
            return [$item->hopital_cible => $item->total];
        })
        ->toArray();

    // Données existantes
    $recentUrgencies = Urgency::latest()
        ->take(5)
        ->get();

    $hospitals = Hospital::pluck('phone', 'name')->toArray();
    
    $hospitalsData = Hospital::select('name', 'phone', 'city', 'region', 'latitude', 'longitude')
        ->get()
        ->keyBy('name')
        ->toArray();

    $gouvernorats = [
        'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
        'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba',
        'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
        'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
    ];

    // Statistiques pour les cartes
    $totalUrgencies = Urgency::count();
    $enAttente = Urgency::where('etat', 'en_attente')->count();
    $terminees = Urgency::where('etat', 'termine')->count();
    $echecs = Urgency::where('etat', 'echec')->count();

    // Urgences actives
    $activeUrgencies = Urgency::whereIn('etat', ['en_attente', 'appel_en_cours'])
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->get();

    return view('single_page', [
        // Données pour les statistiques
        'urgencyTypes' => $urgencyTypes,
        'dates' => $dates,
        'dailyCounts' => $dailyCounts,
        'ageGroups' => $ageGroups,
        'statusCounts' => $statusCounts,
        'hospitalDistribution' => $hospitalDistribution, // Nouvelle donnée
        
        // Données existantes
        'recentUrgencies' => $recentUrgencies,
        'hospitals' => $hospitals,
        'hospitalsData' => $hospitalsData,
        'gouvernorats' => $gouvernorats,
        'activeUrgencies' => $activeUrgencies,
        
        // Statistiques pour les cartes
        'total' => $totalUrgencies,
        'enAttente' => $enAttente,
        'terminees' => $terminees,
        'echecs' => $echecs,
        
        // Autres données
        'monthlyCounts' => $this->getMonthlyCounts(),
        'users' => User::all()
    ]);
}

/**
 * Récupère le nombre d'urgences par mois pour l'année en cours
 */
protected function getMonthlyCounts()
{
    return Urgency::select(
        
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
        
        ->whereYear('created_at', date('Y'))
        ->groupBy('month')
        ->orderBy('month')
        ->pluck('count')
        ->toArray();
}














public function showUrgenceStats()
{
    $ageStats = DB::table('urgencies')
        ->selectRaw("
            COUNT(*) FILTER (WHERE age BETWEEN 0 AND 17) as age_0_17,
            COUNT(*) FILTER (WHERE age BETWEEN 18 AND 35) as age_18_35,
            COUNT(*) FILTER (WHERE age BETWEEN 36 AND 60) as age_36_60,
            COUNT(*) FILTER (WHERE age > 60) as age_61_plus
        ")
        ->first();
        $typeStats = DB::table('urgencies')
        ->select('type_urgence', DB::raw('count(*) as total'))
        ->groupBy('type_urgence')
        ->get();
        $gouvernorats = DB::table('urgencies')
        ->select('adresse', DB::raw('COUNT(*) as total'))
        ->groupBy('adresse')
        ->get();
        

    return view('urgencies.single_page', ['ageStats' => $ageStats,   'typeStats' => $typeStats,  'gouvernorats' => $gouvernorats,]);
}



}