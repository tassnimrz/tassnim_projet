<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LettreMedical extends Model
{
    use HasFactory;

    protected $table = 'lettres_medicales';

    protected $fillable = [
        'dossier_medical_id',
        'user_id',
        'type_lettre',
        'date_lettre',
        'description',
        'confirmation_medecin',
        'jours_hospitalisation',
        'periode_chirurgie',
    ];

    // Relation avec le modèle DossierMedical
    public function dossierMedical()
    {
        return $this->belongsTo(DossierMedical::class);
    }

    // Méthode pour récupérer le nom complet du patient via DossierMedical
    public function getNomCompletPatient()
    {
        return $this->dossierMedical->fichePatient->nom . ' ' . $this->dossierMedical->fichePatient->prenom;
    }

    // Autres méthodes et relations
}
