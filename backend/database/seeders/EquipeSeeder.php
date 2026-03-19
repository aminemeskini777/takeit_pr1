<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Equipe;

class EquipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipes = [
            ['nom' => 'R&D - Framework Sopra HR 4YOU'],
            ['nom' => 'Développement - Module Paie France'],
            ['nom' => 'Consulting - Implémentation SIRH'],
            ['nom' => 'Support Technique & Maintenance'],
            ['nom' => 'QA & Automatisation de Tests'],
            ['nom' => 'Expertise Data & Analytics'],
            ['nom' => 'Ressources Humaines (Interne)'],
        ];

        foreach ($equipes as $equipe) {
            Equipe::firstOrCreate($equipe);
        }
    }
}
