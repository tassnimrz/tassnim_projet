<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\UserController;
use App\Http\Controllers\RendezVousController;


Route::get('/voir-rendezvous', function () {
    return view('voir');
});

 Route::get('/rendez-vous', function () {
    return view('rendezvous.index');  // Retourne la vue Blade où tu charges le composant React
})->name('rendezvous.index');

// Autres routes Laravel pour la gestion des rendez-vous
Route::get('/rendezvous', [RendezVousController::class, 'index']);

Route::get('/rendezvous/create', [RendezVousController::class, 'create'])->name('rendezvous.create');
Route::post('/rendezvous', [RendezVousController::class, 'store'])->name('rendezvous.store');
     


use App\Http\Controllers\Auth\RegisteredUserController;
Route::get('/api/patients', [RegisteredUserController::class, 'getPatients']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/users/create', [RegisteredUserController::class, 'store']);

Route::get('/users', [RegisteredUserController::class, 'index']); // Récupérer tous les utilisateurs
Route::get('/users/show/{id}', [RegisteredUserController::class, 'show']); // Afficher un utilisateur
Route::put('/users/update/{id}', [RegisteredUserController::class, 'update']); // Modifier un utilisateur
Route::delete('/users/destroy/{id}', [RegisteredUserController::class, 'destroy']); // Supprimer un utilisateur
Route::get('users/edit/{id}', [RegisteredUserController::class, 'edit']);


Route::get('users/edit/{id}', [RegisteredUserController::class, 'edit']);
Route::post('/verification/{user}', [RegisteredUserController::class, 'verifyCode'])->name('verification.verify');
Route::get('/verification-form', [RegisteredUserController::class, 'showVerificationForm'])->name('verification.form');
Route::post('/verify-code', [RegisteredUserController::class, 'verifyCode'])->name('verify.code');





Route::get('/', [AuthController::class, 'index']);
Route::post('/login', [AuthController::class, 'handleLogin'])->name('login');




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


use App\Http\Controllers\PlanningJourController;
Route::get('/planning', function () {
    return view('disponibilite');
});
Route::middleware(['auth'])->group(function () {
    // Route pour supprimer un rendez-vous
    Route::delete('/rendez-vous/{rendezVous}', [RendezVousController::class, 'destroy'])
        ->name('rendez-vous.destroy');
});

use App\Http\Controllers\Auth\LoginController;

// routes/web.php
Route::middleware('web')->get('/api/test-session', function () {
    return response()->json([
        'user' => auth()->user(),
    ]);
});

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
Route::get('/fiche-patient/{id}/edit', [FichePatientController::class, 'edit'])->name('fiche-patient.edit');
Route::put('/fiche-patient/{id}', [FichePatientController::class, 'update'])->name('fiche-patient.update');
// Routes API pour les opérations CRUD
Route::prefix('api')->group(function () {
    Route::get('/fiche-patient', [FichePatientController::class, 'index']);
    Route::post('/fiche-patient', [FichePatientController::class, 'store']);
 
    Route::put('/fiche-patient/{id}', [FichePatientController::class, 'update']);

   // Ajoutez ces routes
Route::get('/fiche-patients', [FichePatientController::class, 'index'])->name('fiche-patients.index');
Route::get('/fiche-patients/{id}', [FichePatientController::class, 'show'])->name('fiche-patients.show'); // Route show avec paramètre
Route::get('/fiche-patient/{id}/pdf', [FichePatientController::class, 'generatePDF']);
});


// Route pour la création
Route::get('/fiche-patient/create', [FichePatientController::class, 'create']);


Route::get('/fiche-patient', [FichePatientController::class, 'index'])->where('any', '.*');

// routes/api.php
Route::prefix('api')->group(function () {
    Route::apiResource('fiche-patients', FichePatientController::class);
    Route::get('/fiche-patient/{id}/pdf', [FichePatientController::class, 'generatePDF']);
});

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

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');



Route::get('/', function () {
    //return view('auth.register');
   // return view('auth.login');
  // return view('fiche-patient.index');
  return view('menu');
 });
 
     use App\Http\Controllers\ConsultationController;


         // Route pour afficher toutes les consultations (index)
         Route::get('consultations', [ConsultationController::class, 'index'])->name('consultations.index');

         // Route pour afficher le formulaire de création d'une consultation
         Route::get('consultations/create', [ConsultationController::class, 'create'])->name('consultations.create');

         // Route pour stocker une nouvelle consultation
         Route::post('consultations', [ConsultationController::class, 'store'])->name('consultations.store');

         // Route pour afficher une consultation spécifique
         Route::get('consultations/{consultation}', [ConsultationController::class, 'show'])->name('consultations.show');

         // Route pour afficher le formulaire d'édition d'une consultation
         Route::get('consultations/{consultation}/edit', [ConsultationController::class, 'edit'])->name('consultations.edit');

         // Route pour mettre à jour une consultation
         Route::put('consultations/{consultation}', [ConsultationController::class, 'update'])->name('consultations.update');

         // Route pour supprimer une consultation
         Route::delete('consultations/{consultation}', [ConsultationController::class, 'destroy'])->name('consultations.destroy');

         use App\Http\Controllers\OrdonnanceController;



             // Afficher la liste des ordonnances du patient
             Route::get('/ordonnances', [OrdonnanceController::class, 'index'])->name('ordonnances.index');

             // Afficher le formulaire de création d'une ordonnance
             Route::get('/ordonnances/create', [OrdonnanceController::class, 'create'])->name('ordonnances.create');

             // Enregistrer une nouvelle ordonnance
             Route::post('/ordonnances', [OrdonnanceController::class, 'store'])->name('ordonnances.store');

             // Afficher une ordonnance spécifique
             Route::get('/ordonnances/{ordonnance}', [OrdonnanceController::class, 'show'])->name('ordonnances.show');

             // Afficher le formulaire d'édition d'une ordonnance
             Route::get('/ordonnances/{ordonnance}/edit', [OrdonnanceController::class, 'edit'])->name('ordonnances.edit');

             // Mettre à jour une ordonnance
             Route::put('/ordonnances/{ordonnance}', [OrdonnanceController::class, 'update'])->name('ordonnances.update');

             // Supprimer une ordonnance
             Route::delete('/ordonnances/{ordonnance}', [OrdonnanceController::class, 'destroy'])->name('ordonnances.destroy');

             use App\Http\Controllers\CertificatController;

             // Afficher la liste des certificats
             Route::get('/certificats', [CertificatController::class, 'index']);

             // Afficher le formulaire de création d'un certificat
             Route::get('/certificats/create', [CertificatController::class, 'create']);

             // Enregistrer un nouveau certificat
             Route::post('/certificats', [CertificatController::class, 'store']);

             // Afficher un certificat spécifique
             Route::get('/certificats/{certificat}', [CertificatController::class, 'show']);

             // Afficher le formulaire de modification d'un certificat
             Route::get('/certificats/{certificat}/edit', [CertificatController::class, 'edit']);

             // Mettre à jour un certificat
             Route::put('/certificats/{certificat}', [CertificatController::class, 'update']);

             // Supprimer un certificat
             Route::delete('/certificats/{certificat}', [CertificatController::class, 'destroy']);
             use App\Http\Controllers\LettreMedicalController;

             // Route pour afficher toutes les lettres médicales (index)
             Route::get('/lettres', [LettreMedicalController::class, 'index'])->name('lettres.index');

             // Route pour afficher le formulaire de création d'une lettre médicale
             Route::get('/lettres/create', [LettreMedicalController::class, 'create'])->name('lettres.create');

             // Route pour enregistrer une nouvelle lettre médicale
             Route::post('/lettres', [LettreMedicalController::class, 'store'])->name('lettres.store');

             // Route pour afficher les détails d'une lettre médicale
             Route::get('/lettres/{lettre}', [LettreMedicalController::class, 'show'])->name('lettres.show');

             // Route pour afficher le formulaire d'édition d'une lettre médicale
             Route::get('/lettres/{lettre}/edit', [LettreMedicalController::class, 'edit'])->name('lettres.edit');

             // Route pour mettre à jour une lettre médicale existante
             Route::put('/lettres/{lettre}', [LettreMedicalController::class, 'update'])->name('lettres.update');

             // Route pour supprimer une lettre médicale
             Route::delete('/lettres/{lettre}', [LettreMedicalController::class, 'destroy'])->name('lettres.destroy');
             Route::post('/certificats', [CertificatController::class, 'store'])->name('certificats.store');
// routes/web.php
Route::get('/certificats', [CertificatController::class, 'index'])->name('certificats.index');
// routes/web.php



Route::resource('certificats', CertificatController::class);

use App\Http\Controllers\LettreMedicaleController;

// Afficher le formulaire de création
Route::get('/lettres-medicales/create', [LettreMedicalController::class, 'create'])->name('lettres_medicales.create');

// Enregistrer une nouvelle lettre médicale
Route::post('/lettres-medicales', [LettreMedicalController::class, 'store'])->name('lettres_medicales.store');

use App\Http\Controllers\ReportController;

Route::get('/reports', [ReportController::class, 'index']);
Route::get('/api/reports', [ReportController::class, 'getReports']);

use App\Http\Controllers\AvisController;

Route::get('/admin/dashboard', [AvisController::class, 'index'])->name('admin.dashboard');


Route::get('/profil', function(){
    return view('profil');

    
});

use App\Http\Controllers\Auth\ForgotPasswordController;
Route::get('/mot-de-passe-oublie', [ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/mot-de-passe-email', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');


use App\Http\Controllers\Auth\ResetPasswordController;
Route::get('/reinitialiser-mot-de-passe', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reinitialiser-mot-de-passe', [ResetPasswordController::class, 'reset'])->name('password.update');

use App\Http\Controllers\NotificationController;

Route::get('/notifications/create', [NotificationController::class, 'create'])->name('notifications.create');
Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
// routes/web.php
Route::get('/user', function () {
    return auth()->user();
});
Route::post('/rendez-vous/reserver', [RendezVousController::class, 'reserver'])->name('rendez_vous.reserver');
