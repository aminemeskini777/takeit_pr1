<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributionBadge extends Model
{
    use HasFactory;

    protected $table = 'attribution_badges';

    protected $fillable = [
        'badge_id',
        'employe_id',
        'date_attribution',
        'type_attribution',
        'commentaire'
    ];

    protected $casts = [
        'date_attribution' => 'datetime'
    ];

    /**
     * Relation avec le badge
     */
    public function badge()
    {
        return $this->belongsTo(Badge::class);
    }

    /**
     * Relation avec l'employé
     */
    public function employe()
    {
        return $this->belongsTo(User::class, 'employe_id');
    }
}
