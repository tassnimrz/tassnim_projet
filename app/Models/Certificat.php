<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificat extends Model
{
    use HasFactory;

    protected $table = 'certificats';

    protected $fillable = [
        'dossier_medical_id',
        'user_id',
        'type_certificat',
        'date_certificat',
        'description',
        'confirmation_medecin',
        'jours_repos',
        'periode_dispense',
    ];
    protected $casts = [
        'date_certificat' => 'datetime',
    ];

    // Relation avec le modèle DossierMedical
    public function dossierMedical()
    {
        return $this->belongsTo(DossierMedical::class);
    }

    // Exemple de méthode pour récupérer le nom complet du patient via le dossier médical
    public function getNomCompletPatient()
    {
        // Accéder à FichePatient via DossierMedical
        return $this->dossierMedical->fichePatient->nom . ' ' . $this->dossierMedical->fichePatient->prenom;
    }

    // Autres méthodes et relations
}
