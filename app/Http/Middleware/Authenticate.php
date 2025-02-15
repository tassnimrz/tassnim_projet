<?php

namespace App\Http\Middleware;
use App\Models\User;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;
use Spatie\Permission\Traits\HasRoles;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            // Vérifier si l'utilisateur est authentifié
            if (Auth::check()) {
                $user = Auth::user();

                // Rediriger selon le rôle de l'utilisateur
                if ($user->hasRole('medecin')) {
                    return route('dashboard.medecin');
                } elseif ($user->hasRole('secretaire')) {
                    return route('dashboard.secretaire');
                } elseif ($user->hasRole('patient')) {
                    return route('dashboard.patient');
                } elseif ($user->hasRole('admin')) {
                    return route('dashboard.admin');
                }
            }

            // Redirection par défaut pour les utilisateurs non authentifiés
            return route('login');
        }
    }
}
