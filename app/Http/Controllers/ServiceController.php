<?php
namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function create()
{
    return view('CreateServices'); 
}
    // Afficher la liste des services
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    // Afficher un service spécifique
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }

    // Ajouter un nouveau service
    public function store(Request $request)
    {
        // Validation des champs
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

        ]);




        $service = Service::create([
            'title' => $request->title,
            'description' => $request->description,

        ]);


        return response()->json($service, 201);
    }

    // Afficher le formulaire de modification
    public function edit($id)
    {
        $service = Service::findOrFail($id);
        return view('services.edit', compact('service'));
    }

    // Mettre à jour un service existant
    public function update(Request $request, $id)
    {
        // Validation des champs
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

        ]);

        // Trouver le service à mettre à jour
        $service = Service::findOrFail($id);



        // Mise à jour du service
        $service->update([
            'title' => $request->title,
            'description' => $request->description,

        ]);

        // Retourner la réponse avec le service mis à jour
        return response()->json($service);
    }

    // Supprimer un service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);


        $service->delete();

        // Retourner une réponse avec un message de succès
        return response()->json(['message' => 'Service deleted successfully']);
    }
}