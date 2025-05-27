<?php

namespace App\Http\Controllers;

use App\Models\ReseauSocial;
use Illuminate\Http\Request;

class ReseauSocialController extends Controller
{
    // Afficher la liste des réseaux sociaux
    public function index()
    {
        $reseaux = ReseauSocial::all();
        return response()->json($reseaux);
    }

    // Afficher un réseau social spécifique
    public function show($id)
    {
        $reseau = ReseauSocial::findOrFail($id);
        return response()->json($reseau);
    }

    // Ajouter un nouveau réseau social
    public function store(Request $request)
    {
        $request->validate([
            'plateforme' => 'required|string|max:255',
            'lien' => 'required|url',
        ]);

        $reseau = ReseauSocial::create([
            'plateforme' => $request->plateforme,
            'lien' => $request->lien,
        ]);

        return response()->json($reseau, 201);
    }

    // Modifier un réseau social
    public function update(Request $request, $id)
    {
        $request->validate([
            'plateforme' => 'required|string|max:255',
            'lien' => 'required|url',
        ]);

        $reseau = ReseauSocial::findOrFail($id);
        $reseau->update([
            'plateforme' => $request->plateforme,
            'lien' => $request->lien,
        ]);

        return response()->json($reseau);
    }

    // Supprimer un réseau social
    public function destroy($id)
    {
        $reseau = ReseauSocial::findOrFail($id);
        $reseau->delete();

        return response()->json(['message' => 'Réseau social supprimé avec succès']);
    }
}