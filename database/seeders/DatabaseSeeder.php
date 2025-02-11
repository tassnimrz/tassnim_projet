<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Vérifier si l'admin existe déjà
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Admin Principal',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'), // Changer le mot de passe
                'tel' => '0000000000',
                'adresse' => 'Siège principal',
                'date_naissance' => '1980-01-01',
                'status' => 'actif',
                'role_id' => Role::where('nom', 'admin')->first()->id,
            ]);
        }
    }
}
