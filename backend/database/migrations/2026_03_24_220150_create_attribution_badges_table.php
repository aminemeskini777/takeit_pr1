<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attribution_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('badge_id')->constrained()->onDelete('cascade');
            $table->foreignId('employe_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('date_attribution');
            $table->enum('type_attribution', ['AUTOMATIQUE', 'MANUELLE'])->default('AUTOMATIQUE');
            $table->text('commentaire')->nullable();  // Pour les attributions manuelles
            $table->timestamps();

            // Empêcher les doublons (un employé ne peut pas avoir deux fois le même badge)
            $table->unique(['badge_id', 'employe_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attribution_badges');
    }
};
