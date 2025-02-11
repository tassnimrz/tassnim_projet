<?php



namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            if ($user->role->nom === 'admin') {
                return redirect()->route('admin.dashboard');
            } elseif ($user->role->nom === 'medecin') {
                return redirect()->route('medecin.dashboard');
            } elseif ($user->role->nom === 'secretaire') {
                return redirect()->route('secretaire.dashboard');
            } elseif ($user->role->nom === 'patient') {
                return redirect()->route('patient.dashboard');
            }
        }

        // Si l'authentification échoue, rediriger à nouveau vers la page de connexion avec un message d'erreur
        return redirect()->route('login')->withErrors(['email' => 'Identifiants invalides.']);
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
}
