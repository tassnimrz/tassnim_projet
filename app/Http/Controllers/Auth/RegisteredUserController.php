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

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validation des données, y compris le champ 'role'
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'tel' => 'required|string|max:15', // Validation du téléphone
            'adresse' => 'required|string|max:255', // Validation de l'adresse
            'date_naissance' => 'required|date|before:today', // Validation de la date de naissance
            'status' => 'required|string|in:active,inactive', // Validation du status
            'role' => ['required', 'string', 'in:medecin,secretaire,patient'], // Validation du rôle
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
        ]);

        // Assigner le rôle à l'utilisateur (medecin, secretaire, patient)
        $user->assignRole($request->role);

        // Déclencher l'événement "Registered" pour la notification
        event(new Registered($user));

        // Connecter l'utilisateur immédiatement après l'enregistrement
        Auth::login($user);

        // Rediriger vers la page d'accueil ou vers le tableau de bord approprié
        return redirect(RouteServiceProvider::HOME);
    }
}
