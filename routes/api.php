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

Route::get('/patient-stats-daily', [RegisteredUserController::class, 'getDailyPatientStats']);

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
use App\Http\Controllers\NotificationController;

Route::get('/patients', [NotificationController::class, 'index']); // Nouvelle route API
Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
use App\Http\Controllers\FichePatientController;

// API : Retourner les données JSON pour la modification


Route::get('/fiche-patient/{id}/edit', [FichePatientController::class, 'edit'])->name('fiche-patient.edit');
Route::put('/fiche-patient/{id}', [FichePatientController::class, 'update'])->name('fiche-patient.update');
Route::get('/fiche-patient', [FichePatientController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/fiche-patient', [FichePatientController::class, 'store']);
    Route::get('/fiche-patient', [FichePatientController::class, 'index']);
});
Route::get('/fiche-patient', [FichePatientController::class, 'index']);
Route::get('/fiche-patient/{id}', [FichePatientController::class, 'show']);

Route::get('/fiche-patient/{id}/pdf', [FichePatientController::class, 'generatePDF']);
Route::get('/patients', [RegisteredUserController::class, 'getPatients']);
Route::apiResource('fiche-patient', FichePatientController::class);
use App\Http\Controllers\PlanningJourController;


Route::get('/plannings', [PlanningJourController::class, 'index']);
Route::post('/plannings', [PlanningJourController::class, 'store']);
use App\Http\Controllers\RendezVousController;
// Route pour récupérer la liste des médecins
Route::get('/medecins', [RegisteredUserController::class, 'getmedecin']);


Route::get('/rendezvous/statistiques/journalier', [RendezVousController::class, 'tauxRendezVousJournalier']);

// Route pour créer un rendez-vous via API
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/reserver', [RendezVousController::class, 'store']);
});
Route::middleware('auth:sanctum')->get('/mes-rendezvous', [RendezVousController::class, 'mesRendezvous']);


Route::get('/plannings', [PlanningController::class, 'index']);
Route::get('planning_jours', [RendezVousController::class, 'getPlanningJours']);

Route::post('/rendezvous/reserver', [RendezVousController::class, 'reserver']);
Route::get('/plannings', [RendezVousController::class, 'getDisponibilites']);
Route::post('/reserver', [RendezVousController::class, 'reserver']);
// Dans routes/api.php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth')->get('/mes-rendezvous', function () {
    return auth()->user()->rendezvous;
});
Route::post('/rendez-vous', [RendezVousController::class, 'store']);

Route::post('/rendez-vous/reserver', [RendezVousController::class, 'reserver']);

Route::delete('/plannings/{id}', [PlanningJourController::class, 'destroy']);



Route::get('/tous-rendezvous', [RendezVousController::class, 'index']);

use App\Models\RendezVous;
Route::get('/tous-rendezvous', function () {
    $rendezvous = \App\Models\RendezVous::with(['planningJour', 'medecin'])->get();
    return response()->json($rendezvous);
});
Route::get('/tous-rendezvous', function () {
    $rendezvous = \App\Models\RendezVous::with(['planningJour', 'medecin', 'patient'])->get();

    return response()->json($rendezvous);
});


Route::get('/prochain-rdv', [RendezVousController::class, 'prochainRdv']);
Route::middleware('auth')->get('/api/capsule-sante', [RendezVousController::class, 'capsuleSante']);










Route::get('/rendezvous/stats-pour-chatbot', [RendezVousController::class, 'statsPourChatbot']);
Route::get('/plannings/suggestions', [PlanningJourController::class, 'suggestionsIntelligentes']);
