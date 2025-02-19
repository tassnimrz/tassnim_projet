<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model {
    use HasFactory;

    protected $fillable = [
        'dossier_medical_id',
        'date_consultation',
        'motif',
        'diagnostic',
        'traitement',
        'observations',
        'statut',
    ];

    // Relation avec DossierMedical
    public function dossierMedical() {
        return $this->belongsTo(DossierMedical::class);
    }
}
