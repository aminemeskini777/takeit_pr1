<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Badge;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'password_tmp',     // Mot de passe temporaire pour activation
        'role',              // manager / employee
        'status',            // active / inactive
        'equipe_id',         // Clé étrangère vers équipe principale
    ];


      protected $hidden = [
        'password',
        'password_tmp',
        'remember_token',
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];



    public function isManager()
    {
        return $this->role === 'manager';
    }

    public function isEmployee()
    {
        return $this->role === 'employee';
    }

   /**
     * Relation avec l'équipe principale (belongs to)
     */
    public function equipe()
    {
        return $this->belongsTo(Equipe::class);
    }

    /**
     * Relation avec les équipes (many-to-many)
     * Un utilisateur peut appartenir à plusieurs équipes
     */
    public function equipes()
    {
        return $this->belongsToMany(Equipe::class, 'equipe_user')
                    ->withTimestamps();
    }
}
