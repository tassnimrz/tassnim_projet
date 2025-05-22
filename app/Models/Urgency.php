<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Urgency extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_patient', 'telephone', 'adresse', 'age',
        'symptomes', 'type_urgence', 'hopital_cible', 
        'medecin_referent', 'etat', 'latitude', 'longitude'
    ];

    // États possibles
    const ETAT_EN_ATTENTE = 'en_attente';
    const ETAT_APPEL_EN_COURS = 'appel_en_cours';
    const ETAT_AMBULANCE_EN_ROUTE = 'ambulance_en_route';
    const ETAT_TERMINE = 'termine';
    const ETAT_ECHEC = 'echec';

    // Types d'urgence
    const TYPE_AMBULANCE = 'ambulance';
    const TYPE_SAMU = 'samu';
    const TYPE_AUTRE = 'autre';
    public static function gouvernorats() {
        return [
            'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
            'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
            'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir',
            'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
            'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
        ];
    }


    public function getEtatLabelAttribute()
    {
        $labels = [
            self::ETAT_EN_ATTENTE => 'En attente',
            self::ETAT_APPEL_EN_COURS => 'Appel en cours',
            self::ETAT_AMBULANCE_EN_ROUTE => 'Ambulance en route',
            self::ETAT_TERMINE => 'Terminé',
            self::ETAT_ECHEC => 'Échec'
        ];
        
        return $labels[$this->etat] ?? $this->etat;
    }
}