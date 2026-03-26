<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->text('description')->nullable();
            $table->integer('seuil_attribution');  // Nombre de tâches requises
            $table->string('image')->nullable();    // URL ou chemin de l'image
            $table->enum('periode', ['mensuelle', 'trimestrielle', 'annuelle'])->default('mensuelle');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
