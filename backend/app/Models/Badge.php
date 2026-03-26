<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'seuil_attribution',
        'image',
        'periode',
        'actif'
    ];

    protected $casts = [
        'actif' => 'boolean',
        'seuil_attribution' => 'integer'
    ];

    /**
     * Relation avec les attributions
     */
    public function attributions()
    {
        return $this->hasMany(AttributionBadge::class);
    }

    /**
     * Relation avec les employés qui ont ce badge
     */
    public function employes()
    {
        return $this->belongsToMany(User::class, 'attribution_badges', 'badge_id', 'employe_id')
                    ->withPivot('date_attribution', 'type_attribution', 'commentaire')
                    ->withTimestamps();
    }

    /**
     * Scope pour les badges actifs
     */
    public function scopeActif($query)
    {
        return $query->where('actif', true);
    }
}
