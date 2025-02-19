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
        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id();
            // Relations
            $table->foreignId('consultation_id')->constrained('consultations')->onDelete('cascade');
            $table->foreignId('dossier_medical_id')->constrained('dossiers_medicaux')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Référence au User (utilisateur)

            // Champs spécifiques
            $table->date('date_ordonnance');
            $table->text('description');
            $table->string('statut')->default('valide'); // valide, expirée, annulée
            $table->integer('duree')->nullable(); // Durée de l'ordonnance en jours (nullable si non spécifié)

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ordonnances');
    }
};
