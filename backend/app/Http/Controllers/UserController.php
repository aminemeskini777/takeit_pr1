<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Equipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // Vérification helper
    private function isManager($user)
    {
        return $user && $user->role === 'manager';
    }

    // FONCTION D'ENVOI D'EMAIL
    private function sendActivationEmail($user, $passwordTemp)
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $activationLink = $frontendUrl . '/activation?email=' . urlencode($user->email) . '&token=' . $passwordTemp;

        $data = [
            'nom' => $user->name,
            'email' => $user->email,
            'password_temp' => $passwordTemp,
            'lien' => $activationLink
        ];

        try {
            Mail::send('emails.activation', $data, function($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('🔐 Activation de votre compte TakeIt');
            });

            Log::info('✅ Email envoyé à ' . $user->email);
            return true;

        } catch (\Exception $e) {
            Log::error('❌ Erreur email: ' . $e->getMessage());
            return false;
        }
    }

    // Liste des utilisateurs
    public function index(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $users = User::with('equipe')->get();
        $equipes = Equipe::all();

        return response()->json([
            'success' => true,
            'users' => $users,
            'equipes' => $equipes
        ]);
    }

    // Créer un utilisateur
    public function store(Request $request)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $request->merge([
            'equipe_id' => $request->equipe_id ?: null,
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:manager,employee',
            'equipe_id' => 'nullable|exists:equipes,id'
        ]);

        // Générer un mot de passe temporaire
        $passwordTemp = Str::random(8);

        // Créer l'utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($passwordTemp),
            'password_tmp' => $passwordTemp,
            'role' => $request->role,
            'equipe_id' => $request->equipe_id ?: null,
            'status' => 'inactive',
        ]);

        // Envoyer l'email
        $emailSent = $this->sendActivationEmail($user, $passwordTemp);

        return response()->json([
            'success' => true,
            'message' => $emailSent ?
                '✅ Utilisateur créé. Un email a été envoyé.' :
                '⚠️ Utilisateur créé mais erreur d\'envoi email.',
            'user' => $user->load('equipe')
        ], 201);
    }

    // Afficher un utilisateur spécifique
    public function show(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user = User::with('equipe')->findOrFail($id);

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    // Modifier un utilisateur
    public function update(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user = User::findOrFail($id);

        $request->merge([
            'equipe_id' => $request->equipe_id ?: null,
        ]);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:manager,employee',
            'equipe_id' => 'nullable|exists:equipes,id',
            'status' => 'sometimes|in:active,inactive'
        ]);

        $data = $request->only(['name', 'email', 'role', 'equipe_id', 'status']);
        $data['equipe_id'] = $request->equipe_id ?: null;
        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => '✅ Utilisateur modifié avec succès',
            'user' => $user->load('equipe')
        ]);
    }

    // Supprimer un utilisateur
    public function destroy(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user = User::findOrFail($id);

        // Empêcher la suppression de son propre compte
        if ($user->id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas supprimer votre propre compte'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => '✅ Utilisateur supprimé avec succès'
        ]);
    }

    // Activer le compte
    public function activate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password_temp' => 'required',
            'new_password' => 'required|min:6|confirmed'
        ]);

        Log::info('Tentative activation:', [
            'email' => $request->email,
            'password_temp' => $request->password_temp
        ]);

        $user = User::where('email', $request->email)
                    ->where('password_tmp', $request->password_temp)
                    ->where('status', 'inactive')
                    ->first();

        if (!$user) {
            Log::warning('Échec activation - utilisateur non trouvé');
            return response()->json([
                'success' => false,
                'message' => 'Lien invalide ou expiré'
            ], 400);
        }

        // Activer le compte
        $user->update([
            'password' => Hash::make($request->new_password),
            'password_tmp' => null,
            'status' => 'active',
            'email_verified_at' => now()
        ]);

        Log::info('✅ Compte activé avec succès: ' . $user->email);

        return response()->json([
            'success' => true,
            'message' => '✅ Compte activé. Vous pouvez maintenant vous connecter.'
        ]);
    }

    // Réenvoyer l'email d'activation
    public function resendActivation(Request $request, $id)
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        if (!$this->isManager($request->user())) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->status === 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Ce compte est déjà activé'
            ], 400);
        }

        if (!$user->password_tmp) {
            // Générer un nouveau mot de passe temporaire si nécessaire
            $user->password_tmp = Str::random(8);
            $user->save();
        }

        $emailSent = $this->sendActivationEmail($user, $user->password_tmp);

        return response()->json([
            'success' => true,
            'message' => $emailSent ?
                '✅ Email d\'activation réenvoyé avec succès' :
                '❌ Erreur lors de l\'envoi de l\'email'
        ]);
    }

   
}
