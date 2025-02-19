<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disponibilite extends Model
{
    use HasFactory;

    // Définir les champs que tu peux remplir en masse
    protected $fillable = [
        'user_id',
        'jour_disponible',
        'heure_debut',
        'heure_fin',
        'statut',
    ];

    // Relation avec le modèle User (Médecin)
    public function medecin()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
