<?php
namespace App\Events;

use App\Models\RendezVous;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\BroadcastEvent;
use Illuminate\Queue\SerializesModels;

class RendezVousUpdated
{
    use InteractsWithSockets, SerializesModels;

    public $rendezVous;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(RendezVous $rendezVous)
    {
        $this->rendezVous = $rendezVous;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('rendezvous');
    }

    /**
     * Le nom de l'événement à diffuser.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'rendezvous.updated';
    }
}
