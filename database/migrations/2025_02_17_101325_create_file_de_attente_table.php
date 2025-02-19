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
        Schema::create('file_de_attente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Référence à l'utilisateur (médecin ou patient)
            $table->foreignId('disponibilite_id')->constrained('disponibilites'); // Référence à la disponibilité
            $table->string('motif'); // Motif de la demande
            $table->enum('statut', ['en attente', 'confirmé', 'annulé'])->default('en attente'); // Statut de la demande
            $table->timestamp('date_demande')->useCurrent(); // Date de la demande
            $table->timestamp('date_heure_rdv'); // Date et heure du rendez-vous
            $table->text('commentaires')->nullable(); // Commentaires optionnels
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_de_attente');
    }
};
