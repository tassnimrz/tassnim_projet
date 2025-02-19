<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // Spécifie la table à laquelle ce modèle correspond
    protected $table = 'notifications';

    // Définir les champs que tu peux remplir en masse
    protected $fillable = [
        'user_id',
        'type',
        'message',
        'date_notification',
        'statut',
    ];

    /**
     * Relation avec le modèle User (utilisateur qui reçoit la notification)
     */
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
