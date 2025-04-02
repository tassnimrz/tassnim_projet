<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProtocoleSecurite;

class ProtocoleSecuriteController extends Controller
{
    public function showPage()
    {
        return view('protocole'); // le nom du fichier doit être en minuscules
    }

    public function index()
    {
        $protocoles = ProtocoleSecurite::all();
        return response()->json($protocoles);
    }

    public function store(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'type_protocole' => 'required|string|max:255',
            'statut' => 'required|string|in:En cours,Terminée,Non respectée',
            'date_mise_en_place' => 'required|date',
            'description' => 'required|string',
        ]);

        try {
            $protocole = ProtocoleSecurite::create($validatedData);
            return response()->json($protocole, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement du protocole. Veuillez réessayer plus tard.'
            ], 500);
        }
    }
}
