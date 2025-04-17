<?php

namespace App\Http\Controllers\Auth;
use App\Mail\VerificationEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\VerificationRequest;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;
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

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */

    public function create()
    {
        return view('auth.register');
    }


public function showVerificationForm()
{
    return view('verification-form');
}



    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        // Validation des données, y compris le champ 'role'
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'tel' => 'required|string|max:15',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:today',
            'status' => 'required|string|in:active,inactive',
            'role' => ['required', 'string', 'in:medecin,secretaire,patient'],
        ]);

        // Créer un utilisateur avec les informations validées
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tel' => $request->tel,
            'adresse' => $request->adresse,
            'date_naissance' => $request->date_naissance,
            'status' => $request->status,
            'is_verified' => false,
        ]);


        $user->assignRole($request->role);


        $verification_code = mt_rand(100000, 999999);


        $user->verification_code = $verification_code;
        $user->save();


        Mail::to($user->email)->send(new VerificationEmail($user));

        return response()->json([
            'message' => 'Consulter votre boite email. Un code de vérification a été envoyé à votre email.',
            'redirect_url' => route('verification.form'),
        ], 201);}


    public function verifyCode(Request $request)
    {

        $request->validate([
            'verification_code' => 'required|numeric',
        ]);


        $user = User::where('verification_code', $request->verification_code)->first();

        if ($user) {

            if ($user->is_verified) {

                return back()->withErrors(['verification_code' => 'Votre compte a déjà été vérifié.']);
            }


            $user->is_verified = true;
            $user->verification_code = null;
            $user->save();


            Auth::login($user);


            if ($user->hasRole('medecin')) {
                return redirect(RouteServiceProvider::MEDECIN);
            } elseif ($user->hasRole('secretaire')) {
                return redirect(RouteServiceProvider::SECRETAIRE);
            } elseif ($user->hasRole('patient')) {
                return redirect(RouteServiceProvider::PATIENT);
            } else {
                return redirect(RouteServiceProvider::HOME);
            }
        } else {

            return back()->withErrors(['verification_code' => 'Code de vérification invalide.']);
        }
    }

    public function index(Request $request)
    {

            // Charger les utilisateurs vérifiés avec leurs rôles
            $users = User::where('is_verified', true)
            ->get()
            ->map(function($user) {
                $user->roles = $user->getRoleNames(); // Convertir les rôles en tableau
                return $user;
            });


        // Si la requête est AJAX ou demande JSON, retourner JSON
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json($users);
        }

        // Sinon, retourner la vue Blade avec les données
        return view('users.index', compact('users'));
    }

    /**
     * Afficher un utilisateur par ID
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function edit($id)
    {
        // Récupère l'utilisateur par son ID
        $user = User::findOrFail($id);

        // Retourne la vue avec les données de l'utilisateur
        return response()->json($user);
    }

    // Met à jour l'utilisateur dans la base de données
    public function update(Request $request, $id)
    {
        // Valide les données du formulaire
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'tel' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'status' => 'required|string',

        ]);

        // Récupère l'utilisateur par son ID
        $user = User::findOrFail($id);

        // Mets à jour les informations de l'utilisateur
        $user->name = $request->name;
        $user->email = $request->email;
        $user->tel = $request->tel;
        $user->adresse = $request->adresse;
        $user->date_naissance = $request->date_naissance;
        $user->status = $request->status;
     
        $user->save();

        // Retourne une réponse ou redirige
        return response()->json(['message' => 'Utilisateur mis à jour avec succès !']);
    }


    /**
     * Supprimer un utilisateur
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
    // app/Http/Controllers/Auth/RegisteredUserController.php
public function getPatients(Request $request)
{
    $patients = User::where('is_verified', true)
        ->whereHas('roles', function($query) {
            $query->where('name', 'patient');
        })
        ->select('id', 'name', 'email', 'tel', 'adresse', 'date_naissance', 'created_at')
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($patients);
}


public function getmedecin(Request $request)
{
    $medecins = User::where('is_verified', true)
        ->whereHas('roles', function($query) {
            $query->where('name', 'medecin');
        })
        ->select('id', 'name', 'email', 'tel', 'adresse', 'date_naissance', 'created_at')
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($medecins);
}

}