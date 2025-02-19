<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id(); // Clé primaire

            // Clé étrangère vers le dossier médical
            $table->foreignId('dossier_medical_id')->constrained('dossiers_medicaux')->onDelete('cascade');

            $table->dateTime('date_consultation'); // Date et heure de la consultation
            $table->string('motif'); // Motif de la consultation
            $table->text('diagnostic'); // Diagnostic du médecin
            $table->text('traitement'); // Prescription ou traitement
            $table->text('observations')->nullable(); // Observations supplémentaires

            // Statut de la consultation
            $table->enum('statut', ['terminée', 'en attente', 'annulée'])->default('en attente');

            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down() {
        Schema::dropIfExists('consultations');
    }
};
