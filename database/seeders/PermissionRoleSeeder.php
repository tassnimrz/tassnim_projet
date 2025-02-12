<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Définir les rôles et leurs permissions
        $roles = [
            'medecin' => [
                'gestion_consultation',
                'gestion_ordonnances_et_documents_medicaux',
                'elaboration_rapport',
                'gestion_examens_et_resultats',
                'gestion_dossier_medicaux',
                'gestion_rendez_vous',
                'gestion_fichiers_patients',
            ],
            'secretaire' => [
                'gestion_dossier_medicaux',
                'gestion_rendez_vous',
                'gestion_fichiers_patients',
                'gestion_notifications',
            ],
            'patient' => [
                'sinscrire',
                'acceder_dossier_medical',
                'prendre_rendez_vous',
                'recevoir_notifications',
            ],
        ];

        // Créer les rôles et leurs permissions
        foreach ($roles as $roleName => $permissions) {
            // Créer le rôle s'il n'existe pas
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Créer et assigner les permissions pour ce rôle
            foreach ($permissions as $permissionName) {
                // Créer la permission si elle n'existe pas
                $permission = Permission::firstOrCreate(['name' => $permissionName]);

                // Assigner la permission au rôle
                $role->givePermissionTo($permission);
            }
        }
    }
}
