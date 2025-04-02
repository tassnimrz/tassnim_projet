<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\LettreMedicalController;
use App\Http\Controllers\DossierMedicalController;
use App\Models\User;

use App\Http\Controllers\ServiceController;

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
| Ici, tu peux enregistrer des routes API pour ton application.
| Ces routes sont chargées par le RouteServiceProvider dans un groupe
| auquel est assigné le groupe middleware "api".
| Profite bien de la construction de ton API !
|
*/

Route::post('/register', [RegisteredUserController::class, 'store']);  // La route pour l'inscription



Route::get('/users', function () {
    return User::all();  // Récupère tous les utilisateurs
});

// Route API pour afficher un dossier médical


Route::get('dossier-medical/{id}', [DossierMedicalController::class, 'show']);




// routes/api.php
use App\Http\Controllers\ReportController;

Route::get('/reports', [ReportController::class, 'getReports']);

use App\Http\Controllers\AvisController;

Route::get('avis', [AvisController::class, 'index']);


Route::get('/avis/stats', [AvisController::class, 'getStats']);
use App\Http\Controllers\ProfilController;

Route::get('/profil', [ProfilController::class, 'getProfil']);
Route::put('/profil/update', [ProfilController::class, 'updateProfil']);
