<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id(); // L'ID du rendez-vous
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // L'ID de l'utilisateur (patient) - Utilisation de hasRole pour récupérer le patient
            $table->foreignId('dossier_medical_id')->nullable()->constrained('dossiers_medicaux')->onDelete('set null'); // Référence au dossier médical (peut être nullable)
            $table->date('date_rendez_vous'); // La date du rendez-vous
            $table->enum('statut', ['en_attente', 'confirme', 'annule'])->default('en_attente'); // Statut du rendez-vous
            $table->text('motif')->nullable(); // Motif du rendez-vous
            $table->enum('type', ['consultation', 'urgence', 'suivi'])->default('consultation'); // Type de rendez-vous
            $table->foreignId('disponibilite_id')->constrained('disponibilites')->onDelete('cascade'); // Référence au créneau de disponibilité
            $table->timestamps(); // Date de création et de mise à jour
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
