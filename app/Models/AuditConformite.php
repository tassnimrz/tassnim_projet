<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditConformite extends Model
{
    protected $fillable = ['type_verification', 'statut', 'date_verification', 'alertes'];

    use HasFactory;
}
