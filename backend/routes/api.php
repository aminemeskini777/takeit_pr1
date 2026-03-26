<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipeController;
use App\Http\Controllers\BadgeController;


Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users/activate', [UserController::class, 'activate']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);


    Route::middleware('role:manager')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/resend-activation', [UserController::class, 'resendActivation']);

        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::put('/tasks/{id}', [TaskController::class, 'update']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
        Route::post('/tasks/{id}/assign', [TaskController::class, 'assign']);
        Route::post('/tasks/{id}/comments', [TaskController::class, 'addComment']);

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/top-employees', [DashboardController::class, 'topEmployees']);
        Route::get('/dashboard/evolution', [DashboardController::class, 'evolution']);
        Route::get('/dashboard/employees/{id}', [DashboardController::class, 'employeeDetail']);

        Route::get('/equipes', [EquipeController::class, 'index']);
        Route::post('/equipes', [EquipeController::class, 'store']);
        Route::put('/equipes/{id}', [EquipeController::class, 'update']);
        Route::delete('/equipes/{id}', [EquipeController::class, 'destroy']);

        // CRUD Badges
        Route::get('/badges', [BadgeController::class, 'index']);
        Route::post('/badges', [BadgeController::class, 'store']);
        Route::get('/badges/{id}', [BadgeController::class, 'show']);
        Route::put('/badges/{id}', [BadgeController::class, 'update']);
        Route::delete('/badges/{id}', [BadgeController::class, 'destroy']);

        // Attribution manuelle
        Route::post('/badges/attribuer-manuellement', [BadgeController::class, 'attribuerManuellement']);

        // Statistiques badges
        Route::get('/badges-stats', [BadgeController::class, 'stats']);

        // Vérification automatique (peut aussi être appelée par cron)
        Route::post('/badges/verification-automatique', [BadgeController::class, 'verificationAutomatique']);
    });

    // Routes accessibles par tous les utilisateurs authentifiés
    Route::get('/employe/{id}/badges', [BadgeController::class, 'badgesEmploye']);
    
});
