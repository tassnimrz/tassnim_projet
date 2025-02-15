<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Traits\HasRoles;







class LoginController extends Controller
{
    // Afficher le formulaire de connexion
    public function showLoginForm()
    {
        return view('auth.login');  // Vue de votre formulaire de connexion
    }

    // Authentifier l'utilisateur
    public function login(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        // Authentifier l'utilisateur
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // Rediriger l'utilisateur en fonction de son rôle après la connexion
            $user = Auth::user();
            if ($user->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            } elseif ($user->hasRole('medecin')) {
                return redirect()->route('medecin.dashboard');
            } elseif ($user->hasRole('secretaire')) {
                return redirect()->route('secretaire.dashboard');
            } elseif ($user->hasRole('patient')) {
                return redirect()->route('patient.dashboard');
            }

        // Si l'authentification échoue, rediriger à nouveau vers la page de connexion avec un message d'erreur
        return redirect()->route('login')->withErrors(['email' => 'Identifiants invalides.']);
    }
    }
    // Déconnecter l'utilisateur
    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }

    // Cette méthode est appelée après la connexion
    protected function authenticated(Request $request, $user)
    {
        // Redirection selon le rôle, comme décrit précédemment
        if ($user->role->nom === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($user->role->nom === 'medecin') {
            return redirect()->route('medecin.dashboard');
        } elseif ($user->role->nom === 'secretaire') {
            return redirect()->route('secretaire.dashboard');
        } elseif ($user->role->nom === 'patient') {
            return redirect()->route('patient.dashboard');
        }

        return redirect()->route('home');
    }
    public function redirectTo()
{
    $user = Auth::user();

    if ($user->hasRole('admin')) {
        return RouteServiceProvider::ADMIN;
    } elseif ($user->hasRole('medecin')) {
        return RouteServiceProvider::MEDECIN;
    } elseif ($user->hasRole('secretaire')) {
        return RouteServiceProvider::SECRETAIRE;
    } elseif ($user->hasRole('patient')) {
        return RouteServiceProvider::PATIENT;
    } else {
        return RouteServiceProvider::HOME;
    }
}

}
