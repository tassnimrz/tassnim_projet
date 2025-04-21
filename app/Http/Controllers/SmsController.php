<?php

namespace App\Http\Controllers;

use App\Services\TwilioService;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function sendTestSms()
    {
        $to = '+21693114631';  
        $message = 'Cher patient,

      Nous vous rappelons que vous avez un rendez-vous médical prévu  dans notre cabinet.';

        $response = $this->twilioService->sendSms($to, $message);

        return response()->json([
            'message' => 'SMS envoyé avec succès!',
            'response' => $response
        ]);
    }
    
protected function getRendezVousDuJour()
{
    // Date et heure actuelles
    $now = Carbon::now();

    // Heure cible = maintenant + 2 heures
    $target = $now->copy()->addHours(2);

    // Extraire la date et l'heure séparément
    $targetDate = $target->toDateString(); // YYYY-MM-DD
    $targetTime = $target->format('H:i');  // HH:MM

    return RendezVous::with(['patient', 'medecin', 'planningJour'])
        ->whereHas('planningJour', function ($query) use ($targetDate, $targetTime) {
            $query->where('date', $targetDate)
                  ->where('heure_debut', $targetTime);
        })
        ->get();
}
}
