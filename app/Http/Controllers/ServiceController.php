<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // 🔥 Afficher tous les services
    public function index()
    {
        $services = Service::all(); // Vérifie que la table 'services' contient des données
        return view('services', ['services' => $services]);
    }
    

    // 🔥 Ajouter un nouveau service
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $service = Service::create($request->all());

        return response()->json($service);
    }

    // 🔥 Supprimer un service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(['message' => 'Service supprimé avec succès']);
    }
}
