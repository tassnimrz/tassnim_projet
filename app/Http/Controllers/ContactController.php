<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Afficher la vue de création
    public function create()
    {
        return view('contact');
    }

    // Afficher la liste des informations de contact
    public function index()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }

    // Afficher une information spécifique de contact
    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        return response()->json($contact);
    }

    // Ajouter une nouvelle information de contact
    public function store(Request $request)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|email|max:255', // Validation de l'email
            'tel' => 'required|string|max:15',   // Validation du numéro de téléphone
            'adresse' => 'required|string|max:255',
            'map' => 'nullable|url', // Validation de l'URL (Google Maps, etc.)
        ]);

        // Création de l'information de contact
        $contact = Contact::create([
            'email' => $request->email,
            'tel' => $request->tel,
            'adresse' => $request->adresse,
            'map' => $request->map,
        ]);

        // Retourner la réponse avec le code de statut 201 (création réussie)
        return response()->json($contact, 201);
    }

    // Afficher le formulaire de modification
    public function edit($id)
    {
        $contact = Contact::findOrFail($id);
        return view('contact.edit', compact('contact')); 
    }

    // Mettre à jour une information de contact
    public function update(Request $request, $id)
    {
        // Validation des champs
        $request->validate([
            'email' => 'required|email|max:255', // Validation de l'email
            'tel' => 'required|string|max:15',   // Validation du numéro de téléphone
            'adresse' => 'required|string|max:255',
            'map' => 'nullable|url', // Validation de l'URL (Google Maps, etc.)
        ]);

        // Trouver l'information de contact à mettre à jour
        $contact = Contact::findOrFail($id);

        // Mise à jour de l'information de contact
        $contact->update([
            'email' => $request->email,
            'tel' => $request->tel,
            'adresse' => $request->adresse,
            'map' => $request->map,
        ]);

        // Retourner la réponse avec l'information mise à jour
        return response()->json($contact);
    }

    // Supprimer une information de contact
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);

        // Suppression de l'information de contact
        $contact->delete();

        // Retourner une réponse avec un message de succès
        return response()->json(['message' => 'Information supprimée avec succès']);
    }
}