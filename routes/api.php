<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\LettreMedicalController;
use App\Http\Controllers\DossierMedicalController;
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

Route::get('dossier-medical/data/{id}', [DossierMedicalController::class, 'getDossierMedicalData']);

Route::get('/lettres', [LettreController::class, 'indexApi']);
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
