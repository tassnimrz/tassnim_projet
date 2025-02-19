<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lettres_medicales', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('dossier_medical_id')->constrained('dossiers_medicaux')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');

            // Champs généraux
            $table->enum('type_lettre', ['consultation', 'hospitalisation', 'chirurgie']);
            $table->date('date_lettre');
            $table->text('description')->nullable();

            // Champs spécifiques
            $table->boolean('confirmation_medecin')->nullable(); // Pour consultation
            $table->integer('jours_hospitalisation')->nullable(); // Pour hospitalisation
            $table->string('periode_chirurgie')->nullable(); // Pour chirurgie

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lettres_medicales');
    }
};
