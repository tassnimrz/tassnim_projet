<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;
    protected $table = 'rendez_vous';
    protected $fillable = [
        'patient_id', 'medecin_id', 'planning_jour_id', 'statut', 'position', 'priorite'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function medecin()
    {
        return $this->belongsTo(User::class, 'medecin_id');
    }

    public function planningJour()
    {
        return $this->belongsTo(PlanningJour::class, 'planning_jour_id');
    }
}
