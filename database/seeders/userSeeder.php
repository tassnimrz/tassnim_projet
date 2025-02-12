<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Créer le rôle 'admin' s'il n'existe pas déjà
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Créer l'administrateur
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
            'tel' => '123456789',
            'adresse' => 'Adresse de l\'administrateur',
            'date_naissance' => '1980-01-01',
            'status' => 'active',
        ]);

        // Assigner le rôle 'admin' à l'utilisateur créé
        $admin->assignRole($adminRole);

        // Définir les permissions spécifiques pour le rôle 'admin'
        $adminPermissions = [
            'gestion_compte_secretaire_medecin',
            'configurer_parametres',
            'afficher_statistiques_et_rapport_activite_cabinet',
        ];

        // Créer et assigner les permissions pour le rôle 'admin'
        foreach ($adminPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $adminRole->givePermissionTo($permission);
        }
    }
}
