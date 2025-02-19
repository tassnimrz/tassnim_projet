<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certificats', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('dossier_medical_id')->constrained('dossiers_medicaux')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');

            // Champs généraux
            $table->enum('type_certificat', ['aptitude', 'repos', 'dispense']);
            $table->date('date_certificat');
            $table->text('description')->nullable();

            // Champs spécifiques
            $table->boolean('confirmation_medecin')->nullable(); // Pour certificat d'aptitude
            $table->integer('jours_repos')->nullable(); // Pour certificat de repos
            $table->string('periode_dispense')->nullable(); // Pour certificat de dispense

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificats');
    }
};
