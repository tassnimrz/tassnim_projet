<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Database\Seeders\PermissionRoleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{

        public function run()
    {
        // Appeler le seeder pour les rôles et permissions
        $this->call(PermissionRoleSeeder::class);

        // Appeler le seeder pour les utilisateurs
        $this->call(UserSeeder::class);
    }
        }
    

