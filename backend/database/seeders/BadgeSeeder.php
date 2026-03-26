<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            [
                'nom' => '⚡ Productif',
                'description' => 'A clôturé 15 tâches',
                'seuil_attribution' => 15,
                'image' => '/badges/10.avif',
                'periode' => 'mensuelle'
            ],
            [
                'nom' => '🏆 Expert',
                'description' => 'A clôturé 30 tâches',
                'seuil_attribution' => 30,
                'image' => '/badges/20.jpg',
                'periode' => 'trimestrielle'
            ],
            [
                'nom' => '💪 Ultra Performant',
                'description' => 'A clôturé 50 tâches',
                'seuil_attribution' => 50,
                'image' => '/badges/30.avif',
                'periode' => 'annuelle'
            ],

        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
