<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanningJour extends Model
{
    use HasFactory;

    protected $fillable = [
        'medecin_id',
        'date',
        'nombre_max_patients',
        'nombre_max_attente',
        'heure_debut',
        'heure_fin',
    ];

    // Le médecin lié à ce planning (si tu as un modèle Medecin ou User)
    public function medecin()
    {
        return $this->belongsTo(User::class, 'medecin_id');
    }

    // Les rendez-vous associés à ce jour
    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
    


public function rendezVousConfirmes()
{
    return $this->hasMany(RendezVous::class)->where('statut', 'confirmé');
}

public function rendezVousAttente()
{
    return $this->hasMany(RendezVous::class)->where('statut', 'attente');
}

}
