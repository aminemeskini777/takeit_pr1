<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter le champ equipe_id (clé étrangère)
            $table->foreignId('equipe_id')
                  ->nullable()
                  ->after('status')
                  ->constrained('equipes')
                  ->onDelete('set null');

            // Ajouter le champ password_tmp (pour stocker le mot de passe temporaire)
            $table->string('password_tmp')
                  ->nullable()
                  ->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Supprimer la clé étrangère d'abord
            $table->dropForeign(['equipe_id']);
            // Puis supprimer les colonnes
            $table->dropColumn(['equipe_id', 'password_tmp']);
        });
    }
};
