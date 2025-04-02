<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ProfilController extends Controller
{
    public function getProfil()
    {
        $user = User::find(1);
        if(!$user) { 
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        return response()->json($user); 
    }

    public function updateProfil(Request $request)
    {
        $user = User::find(1);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        // Validation des champs
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'tel' => 'required|string|max:20',
            'adresse' => 'required|string|max:255',
            'date_naissance' => 'required|date',
        ]);

        // Mise à jour des données
        $user->name = $request->nom;
        $user->email = $request->email;
        $user->tel = $request->tel;
        $user->adresse = $request->adresse;
        $user->date_naissance = $request->date_naissance;
        $user->save();

        return response()->json($user);
    }
    
}
