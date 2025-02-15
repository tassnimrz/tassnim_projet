<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DossierMedical;

class FichePatient extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'sexe',
        'etat_civil',
        'telephone',
        'email',
        'adresse',
        'ville',
        'code_postal',
        'groupe_sanguin',
        'allergies',
        'antecedents_medicaux',
        'traitement_en_cours',
        'assurance_medicale',
        'numero_assurance',
        'date_premiere_visite',
    ];

    // Hook pour créer un dossier médical lors de la création d'une fiche patient
    protected static function booted()
    {
        static::created(function ($fichePatient) {
            // Créer un dossier médical lié à la fiche patient
            DossierMedical::create([
                'fiche_patient_id' => $fichePatient->id,
                'vaccins' => null, // Si pas d'infos pour l'instant
                'notes_medecin' => null, // Notes médicales initiales, si non renseignées
            ]);
        });
    }

    // Relation avec DossierMedical (Un patient a un seul dossier médical)
    public function dossierMedical()
    {
       // return $this->hasOne(DossierMedical::class);
       return $this->hasOne(DossierMedical::class, 'fiche_patient_id');
    }
}
