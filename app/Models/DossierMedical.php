<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DossierMedical extends Model
{
    use HasFactory;
    protected $table = 'dossiers_medicaux';
    protected $fillable = [
        'fiche_patient_id',  // Clé étrangère liée à FichePatient
        'vaccins',           // Informations sur les vaccins du patient
        'notes_medecin',     // Notes laissées par le médecin
    ];

    // Relation avec FichePatient
    public function fichePatient()
    {
        return $this->belongsTo(FichePatient::class, 'fiche_patient_id');
    }
}
