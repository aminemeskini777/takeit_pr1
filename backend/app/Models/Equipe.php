<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
    ];

    /**
     * Relation avec les utilisateurs (many-to-many)
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'equipe_user')
                    ->withTimestamps();
    }
}
