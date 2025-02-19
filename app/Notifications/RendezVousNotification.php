<?php
namespace App\Notifications;

use App\Models\RendezVous;
use Illuminate\Notifications\Notification;

class RendezVousNotification extends Notification
{
    private $rendezVous;

    // Le constructeur prend un objet RendezVous
    public function __construct(RendezVous $rendezVous)
    {
        $this->rendezVous = $rendezVous;
    }

    public function via($notifiable)
    {
        return ['database', 'mail']; // Les canaux de notification, par exemple 'database' et 'mail'
    }

    public function toArray($notifiable)
    {
        return [
            'title' => 'Rendez-vous confirmé',
            'message' => 'Votre rendez-vous pour le ' . $this->rendezVous->date_rendez_vous . ' est confirmé.',
        ];
    }
}
