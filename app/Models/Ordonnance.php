<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    use HasFactory;

    // Définir les champs qui peuvent être assignés en masse (mass assignment)
    protected $fillable = [
        'consultation_id',
        'dossier_medical_id',
        'user_id',
        'date_ordonnance',
        'description',
        'statut',
        'duree',
    ];

    /**
     * Relation avec la table consultations
     */
    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }

    /**
     * Relation avec la table dossiers_medicaux
     */
    public function dossierMedical()
    {
        return $this->belongsTo(DossierMedical::class, 'dossier_medical_id');
    }

    /**
     * Relation avec la table users (patient)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Méthode pour vérifier si l'ordonnance est expirée
     */
    public function isExpired()
    {
        return now()->gt($this->date_ordonnance->addDays($this->duree));
    }

    /**
     * Méthode pour afficher le statut de l'ordonnance
     */
    public function getStatut()
    {
        if ($this->isExpired()) {
            return 'expirée';
        }
        return $this->statut; // retourne 'valide' ou 'annulée' selon l'état
    }
}
