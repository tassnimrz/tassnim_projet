<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileAttente extends Model
{
    use HasFactory;

    // Spécifie la table à laquelle ce modèle correspond
    protected $table = 'file_de_attente';

    // Définir les champs que tu peux remplir en masse
    protected $fillable = [
        'user_id',
        'disponibilite_id',
        'motif',
        'statut',
        'date_demande',
        'date_heure_rdv',
        'commentaires',
    ];

    /**
     * Relation avec le modèle User (Médecin ou Patient)
     */
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation avec le modèle Disponibilite
     */
    public function disponibilite()
    {
        return $this->belongsTo(Disponibilite::class, 'disponibilite_id');
    }
}
