<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\UserController;
// routes/web.php

use App\Http\Controllers\Auth\RegisteredUserController;




Route::get('/', [AuthController::class, 'index']);
Route::post('/login', [AuthController::class, 'handleLogin'])->name('login');


Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');


Route::post('register', [RegisteredUserController::class, 'store']);

Route::middleware(['auth'])->group(function () {
    // Dashboard Médecin
    Route::get('/dashboard/medecin', function() {
        return view('dashboard.medecin'); // Vue pour le médecin
    })->name('dashboard.medecin');

    // Dashboard Secrétaire
    Route::get('/dashboard/secretaire', function() {
        return view('dashboard.secretaire'); // Vue pour le secrétaire
    })->name('dashboard.secretaire');

    // Dashboard Patient
    Route::get('/dashboard/patient', function() {
        return view('dashboard.patient'); // Vue pour le patient
    })->name('dashboard.patient');
});



use App\Http\Controllers\Auth\LoginController;


// Afficher le formulaire de connexion
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');

// Traiter la connexion
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');

// Déconnexion
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Dashboard selon le rôle
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard/admin', function () {
        return view('dashboard.admin');
    })->name('admin.dashboard');

    Route::get('/dashboard/medecin', function () {
        return view('dashboard.medecin');
    })->name('medecin.dashboard');

    Route::get('/dashboard/secretaire', function () {
        return view('dashboard.secretaire');
    })->name('secretaire.dashboard');

    Route::get('/dashboard/patient', function () {
        return view('dashboard.patient');
    })->name('patient.dashboard');
});


use App\Http\Controllers\FichePatientController;

// Affichage de la liste des fiches patients
Route::get('/fiche-patient', [FichePatientController::class, 'index'])->name('fiche-patient.index');

// Affichage du formulaire pour créer une nouvelle fiche patient
Route::get('/fiche-patient/create', [FichePatientController::class, 'create'])->name('fiche-patient.create');

// Enregistrement de la nouvelle fiche patient
Route::post('/fiche-patient', [FichePatientController::class, 'store'])->name('fiche-patient.store');

// Affichage des détails d'une fiche patient
Route::get('/fiche-patient/{id}', [FichePatientController::class, 'show'])->name('fiche-patient.show');

// Affichage du formulaire pour éditer une fiche patient
Route::get('/fiche-patient/{id}/edit', [FichePatientController::class, 'edit'])->name('fiche-patient.edit');

// Mise à jour d'une fiche patient
Route::put('/fiche-patient/{id}', [FichePatientController::class, 'update'])->name('fiche-patient.update');

// Suppression d'une fiche patient
Route::delete('/fiche-patient/{id}', [FichePatientController::class, 'destroy'])->name('fiche-patient.destroy');


use App\Http\Controllers\DossierMedicalController;

// Affichage de la liste des dossiers médicaux
Route::get('/dossier-medical', [DossierMedicalController::class, 'index'])->name('dossier-medical.index');

// Affichage du formulaire pour créer un nouveau dossier médical
Route::get('/dossier-medical/create', [DossierMedicalController::class, 'create'])->name('dossier-medical.create');

// Enregistrement d'un nouveau dossier médical
Route::post('/dossier-medical', [DossierMedicalController::class, 'store'])->name('dossier-medical.store');

// Affichage des détails d'un dossier médical spécifique
Route::get('/dossier-medical/{id}', [DossierMedicalController::class, 'show'])->name('dossier-medical.show');

// Affichage du formulaire pour éditer un dossier médical
Route::get('/dossier-medical/{id}/edit', [DossierMedicalController::class, 'edit'])->name('dossier-medical.edit');

// Mise à jour d'un dossier médical
Route::put('/dossier-medical/{id}', [DossierMedicalController::class, 'update'])->name('dossier-medical.update');

// Suppression d'un dossier médical
Route::delete('/dossier-medical/{id}', [DossierMedicalController::class, 'destroy'])->name('dossier-medical.destroy');




Route::get('/', function () {
    // return view('auth.register');
   // return view('auth.login');
   return view('fiche-patient.create');
 });
