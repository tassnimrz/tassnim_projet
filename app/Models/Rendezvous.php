<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    // Définir les champs que tu peux remplir en masse
    protected $fillable = [
        'user_id',
        'dossier_medical_id',
        'date_rendez_vous',
        'statut',
        'motif',
        'type',
        'disponibilite_id',
    ];

    // Relation avec le modèle User (patient)
    public function patient()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relation avec le modèle DossierMedical
    public function dossierMedical()
    {
        return $this->belongsTo(DossierMedical::class, 'dossier_medical_id');
    }

    // Relation avec le modèle Disponibilite
    public function disponibilite()
    {
        return $this->belongsTo(Disponibilite::class, 'disponibilite_id');
    }
}
