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
    public function create()
    {
        return view('auth.register');
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
            'role' => $request->role, // Ajout du rôle
        ]);

        // Assigner le rôle à l'utilisateur
        $user->assignRole($request->role);

        // Déclencher l'événement "Registered"
        event(new Registered($user));

        // Connecter l'utilisateur après enregistrement
        Auth::login($user);

        // Redirection vers le bon tableau de bord selon le rôle
        if ($user->hasRole('medecin')) {
            return redirect(RouteServiceProvider::MEDECIN);
        } elseif ($user->hasRole('secretaire')) {
            return redirect(RouteServiceProvider::SECRETAIRE);
        } elseif ($user->hasRole('patient')) {
            return redirect(RouteServiceProvider::PATIENT);
        } else {
            return redirect(RouteServiceProvider::HOME);
        }
    }

}