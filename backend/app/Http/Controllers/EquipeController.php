<?php

namespace App\Http\Controllers;

use App\Models\Equipe;
use Illuminate\Http\Request;

class EquipeController extends Controller
{
    public function index()
    {
        $equipes = Equipe::orderBy('nom')->get();

        return response()->json([
            'success' => true,
            'equipes' => $equipes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:equipes,nom',
        ]);

        $equipe = Equipe::create([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'success' => true,
            'equipe' => $equipe,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:equipes,nom,' . $id,
        ]);

        $equipe = Equipe::findOrFail($id);
        $equipe->update([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'success' => true,
            'equipe' => $equipe,
        ]);
    }

    public function destroy($id)
    {
        $equipe = Equipe::findOrFail($id);
        $equipe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Equipe supprimee',
        ]);
    }
}
