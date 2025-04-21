<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\RendezVous;
use Carbon\Carbon;
use App\Services\TwilioService;

class RappelsSms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rappels:sms';



    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoyer des rappels de rendez-vous aux patients via SMS';

    protected $twilioService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(TwilioService $twilioService)
    {
        parent::__construct();
        $this->twilioService = $twilioService;
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
{
    $now = Carbon::now();

    $isTest = $this->option('test');

    if ($isTest) {
        $this->info("📢 Mode TEST activé : envoi des rappels pour tous les rendez-vous du jour.");

        // Tous les rendez-vous de la journée, peu importe l’heure
        $rendezVous = RendezVous::with(['planningJour', 'patient','medecin'])
            ->whereHas('planningJour', function ($query) use ($now) {
                $query->where('date', $now->toDateString());
            })->get();
    } else {
        // Seulement ceux dans 2h à 2h10
        $rendezVous = RendezVous::with(['planningJour', 'patient'])
            ->whereHas('planningJour', function ($query) use ($now) {
                $query->where('date', $now->toDateString())
                    ->where('heure_debut', '>', $now->copy()->addMinutes(120)->format('H:i:s'))
                    ->where('heure_debut', '<', $now->copy()->addMinutes(130)->format('H:i:s'));
            })->get();
    }

    if ($rendezVous->isEmpty()) {
        $this->info("Aucun rendez-vous trouvé pour les rappels SMS.");
        return;
    }

    foreach ($rendezVous as $rdv) {
        $patient = $rdv->patient;
        $medecinNom = $rdv->medecin->name ?? 'Inconnu';
        $patientNom = $patient->name ?? 'Inconnu';

        $this->info("Rappel SMS : Patient = $patientNom | Médecin = Dr. $medecinNom");

        // Appel pour envoyer le SMS
        $this->sendSmsReminder($patient, $rdv);
    }

        }

    /**
     * Méthode pour envoyer un rappel SMS au patient
     *
     * @param $patient
     * @param $rdv
     */
    private function sendSmsReminder($patient, $rdv)
    {
        $date = $rdv->planningJour->date ?? null;
        $heure = $rdv->planningJour->heure_debut ?? null;
    
        if (!$date || !$heure) {
            $this->warn("⚠️ Impossible d'envoyer un SMS car la date ou l'heure est manquante.");
            return;
        }
    
        $dateHeure = \Carbon\Carbon::parse("$date $heure")->format('d/m/Y H:i');
        $message = "Bonjour " . $patient->name . ", ceci est un rappel pour votre rendez-vous médical prévu le $dateHeure.";
    
        // ✅ Formatage du numéro de téléphone
        $tel = $this->formatPhoneNumber($patient->tel ?? null);
    
        if (!$tel) {
            $this->warn("⚠️ Numéro de téléphone invalide pour le patient {$patient->name} : {$patient->tel}");
            return;
        }
    
        $this->twilioService->sendSms($tel, $message);
    }
    
    private function formatPhoneNumber($phone)
{
    // Si déjà au format international, on ne touche pas
    if (str_starts_with($phone, '+')) {
        return $phone;
    }

    // Si c’est un numéro tunisien à 8 chiffres, on ajoute +216
    if (preg_match('/^[0-9]{8}$/', $phone)) {
        return '+216' . $phone;
    }

    // Sinon, c’est invalide
    return null;
}

    }