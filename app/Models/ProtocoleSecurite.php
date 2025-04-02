<?php

namespace App\Models;
use App\Http\Controllers\ProtocoleSecuriteController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProtocoleSecurite extends Model
{
    use HasFactory;

    protected $table = 'protocoles_securite';

    protected $fillable = [
        'type_protocole',
        'statut',
        'date_mise_en_place',
        'description',
    ];

    // Si tu veux que Eloquent gère automatiquement les timestamps created_at et updated_at
    public $timestamps = true;
}
