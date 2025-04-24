<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AProposNous extends Model
{
    use HasFactory;

    protected $table = 'a_propos_nous'; // Spécifie le nom de la table si nécessaire

    protected $fillable = ['title', 'description']; // Colonnes autorisées pour insertion en masse
}