<?php

namespace App\Http\Controllers;

use App\Models\AProposNous;
use Illuminate\Http\Request;

class AProposNousController extends Controller
{

    public function create()
    {
        return view('aProposNous');
    }


    public function index()
    {
        $apropos = AProposNous::all();
        return response()->json($apropos);
    }


    public function show($id)
    {
        $apropos = AProposNous::findOrFail($id);
        return response()->json($apropos);
    }


    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

        ]);


        $apropos = AProposNous::create([
            'title' => $request->title,
            'description' => $request->description,

        ]);


        return response()->json($apropos, 201);
    }


    public function edit($id)
    {
        $apropos = AProposNous::findOrFail($id);
        return view('AProposNous.edit', compact('apropos'));
    }


    public function update(Request $request, $id)
    {
     
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',

        ]);

        // Trouver l'information "À propos de nous" à mettre à jour
        $apropos = AProposNous::findOrFail($id);

        // Mise à jour de l'information "À propos de nous"
        $apropos->update([
            'title' => $request->title,
            'description' => $request->description,

        ]);

        // Retourner la réponse avec l'information mise à jour
        return response()->json($apropos);
    }

    // Supprimer une information "À propos de nous"
    public function destroy($id)
    {
        $apropos = AProposNous::findOrFail($id);

        // Suppression de l'information "À propos de nous"
        $apropos->delete();

        // Retourner une réponse avec un message de succès
        return response()->json(['message' => 'Information deleted successfully']);
    }
}
