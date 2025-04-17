<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Afficher la liste des utilisateurs.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        // Récupérer tous les utilisateurs avec leur rôle
        $users = User::with('role')->get();
        return view('admin.index-user', compact('users'));
    }

    /**
     * Afficher le formulaire de création d'utilisateur.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        // Récupérer les rôles disponibles (medecin, patient, secretaire)
        $roles = Role::whereIn('nom', ['medecin', 'patient', 'secretaire'])->get();
        return view('admin.create-user', compact('roles'));
    }

    /**
     * Enregistrer un nouvel utilisateur.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'tel' => 'required|string|max:15',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'status' => 'required|string',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Création de l'utilisateur avec les données validées
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tel' => $request->tel,
            'adresse' => $request->adresse,
            'date_naissance' => $request->date_naissance,
            'status' => $request->status,
            'role_id' => $request->role_id,
        ]);

        return redirect()->route('users.create')->with('success', 'Utilisateur ajouté avec succès !');
    }

    /**
     * Afficher le formulaire d'édition pour un utilisateur existant.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\View\View
     */
    public function edit(User $user)
    {
        // Récupérer les rôles disponibles
        $roles = Role::whereIn('nom', ['medecin', 'patient', 'secretaire'])->get();
        return view('admin.edit-user', compact('user', 'roles'));
    }

    /**
     * Mettre à jour un utilisateur existant.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\User $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
            'tel' => 'required|string|max:15',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'status' => 'required|string',
            'role_id' => 'required|exists:roles,id',
        ]);

        // Mise à jour des informations de l'utilisateur
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'tel' => $request->tel,
            'adresse' => $request->adresse,
            'date_naissance' => $request->date_naissance,
            'status' => $request->status,
            'role_id' => $request->role_id,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour avec succès !');
    }

    /**
     * Supprimer un utilisateur existant.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        // Suppression de l'utilisateur
        $user->delete();

        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès !');
    }
}