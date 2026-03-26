<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Models\User;
use App\Models\AttributionBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BadgeController extends Controller
{
    // Vérification helper
    private function isManager($user)
    {
        return $user && $user->role === 'manager';
    }

    /**
     * Liste des badges
     */
    public function index(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $badges = Badge::withCount('attributions')->get();
        $employes = User::where('role', 'employee')->get();

        return response()->json([
            'success' => true,
            'badges' => $badges,
            'employes' => $employes
        ]);
    }

    /**
     * Créer un badge
     */
    public function store(Request $request)
    {
        if (!$request->user() || !$this->isManager($request->user())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'nom' => 'required|string|max:100|unique:badges',
            'description' => 'nullable|string',
            'seuil_attribution' => 'required|integer|min:1',
            'image' => 'nullable|string|max:255',
            'periode' => 'required|in:mensuelle,trimestrielle,annuelle',
            'actif' => 'sometimes|boolean'
        ]);

        $badge = Badge::create([
            'nom' => $request->nom,
            'description' => $request->description,
            'seuil_attribution' => $request->seuil_attribution,
            'image' => $request->image,
            'periode' => $request->periode,
            'actif' => $request->actif ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Badge créé avec succès',
            'badge' => $badge
        ], 201);
    }

    /**
     * Afficher un badge spécifique
     */
    public function show(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $badge = Badge::with(['attributions.employe'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'badge' => $badge
        ]);
    }

    /**
     * Modifier un badge
     */
    public function update(Request $request, $id)
    {
        if (!$request->user() || !$this->isManager($request->user())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $badge = Badge::findOrFail($id);

        $request->validate([
            'nom' => 'required|string|max:100|unique:badges,nom,' . $id,
            'description' => 'nullable|string',
            'seuil_attribution' => 'required|integer|min:1',
            'image' => 'nullable|string|max:255',
            'periode' => 'required|in:mensuelle,trimestrielle,annuelle',
            'actif' => 'sometimes|boolean'
        ]);

        $badge->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Badge modifié avec succès',
            'badge' => $badge
        ]);
    }

    /**
     * Supprimer un badge
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user() || !$this->isManager($request->user())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $badge = Badge::findOrFail($id);

        // Vérifier si le badge a déjà été attribué
        if ($badge->attributions()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ce badge a déjà été attribué. Vous ne pouvez pas le supprimer.'
            ], 400);
        }

        $badge->delete();

        return response()->json([
            'success' => true,
            'message' => 'Badge supprimé avec succès'
        ]);
    }

    /**
     * Attribuer un badge manuellement
     */
    public function attribuerManuellement(Request $request)
    {
        if (!$request->user() || !$this->isManager($request->user())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'badge_id' => 'required|exists:badges,id',
            'employe_id' => 'required|exists:users,id',
            'commentaire' => 'nullable|string'
        ]);

        // Vérifier si l'employé a déjà ce badge
        $existant = AttributionBadge::where('badge_id', $request->badge_id)
                                    ->where('employe_id', $request->employe_id)
                                    ->first();

        if ($existant) {
            return response()->json([
                'success' => false,
                'message' => 'Cet employé possède déjà ce badge'
            ], 400);
        }

        $attribution = AttributionBadge::create([
            'badge_id' => $request->badge_id,
            'employe_id' => $request->employe_id,
            'date_attribution' => now(),
            'type_attribution' => 'MANUELLE',
            'commentaire' => $request->commentaire
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Badge attribué manuellement avec succès',
            'attribution' => $attribution->load('badge', 'employe')
        ]);
    }

    /**
     * Liste des badges attribués à un employé
     */
    public function badgesEmploye(Request $request, $employeId)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        $employe = User::findOrFail($employeId);
        $badges = $employe->badges()->withPivot('date_attribution', 'type_attribution')->get();

        return response()->json([
            'success' => true,
            'employe' => $employe,
            'badges' => $badges,
            'total_taches' => $employe->taches_cloturees_count
        ]);
    }

    /**
     * Vérification automatique des badges (à exécuter par cron)
     */
    public function verificationAutomatique()
    {
        $employes = User::where('role', 'employee')->get();
        $badges = Badge::where('actif', true)->get();
        $nouveauxBadges = [];

        foreach ($employes as $employe) {
            $totalTaches = $employe->taches_cloturees_count;

            foreach ($badges as $badge) {
                // Vérifier si l'employé remplit le seuil
                if ($totalTaches >= $badge->seuil_attribution) {
                    // Vérifier s'il n'a pas déjà ce badge
                    $dejaAttribue = AttributionBadge::where('badge_id', $badge->id)
                                                    ->where('employe_id', $employe->id)
                                                    ->exists();

                    if (!$dejaAttribue) {
                        // Attribuer automatiquement le badge
                        AttributionBadge::create([
                            'badge_id' => $badge->id,
                            'employe_id' => $employe->id,
                            'date_attribution' => now(),
                            'type_attribution' => 'AUTOMATIQUE',
                            'commentaire' => 'Attribué automatiquement pour ' . $totalTaches . ' tâches clôturées'
                        ]);

                        $nouveauxBadges[] = [
                            'employe' => $employe,
                            'badge' => $badge
                        ];

                        Log::info("Badge '{$badge->nom}' attribué automatiquement à {$employe->name}");
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => count($nouveauxBadges) . ' nouveaux badges attribués',
            'nouveaux_badges' => $nouveauxBadges
        ]);
    }

    /**
     * Statistiques des badges
     */
    public function stats(Request $request)
    {
        if (!$request->user() || !$this->isManager($request->user())) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $stats = [
            'total_badges' => Badge::count(),
            'badges_actifs' => Badge::where('actif', true)->count(),
            'total_attributions' => AttributionBadge::count(),
            'attributions_manuelles' => AttributionBadge::where('type_attribution', 'MANUELLE')->count(),
            'attributions_automatiques' => AttributionBadge::where('type_attribution', 'AUTOMATIQUE')->count(),
            'badges_par_employe' => User::where('role', 'employee')
                ->withCount('badges')
                ->get()
                ->map(fn($e) => ['nom' => $e->name, 'total_badges' => $e->badges_count])
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }
}
