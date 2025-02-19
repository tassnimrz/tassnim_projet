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
    Schema::create('disponibilites', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users'); // Référence à l'utilisateur (médecin)
        $table->enum('jour_disponible', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']);
        $table->time('heure_debut');
        $table->time('heure_fin');
        $table->enum('statut', ['disponible', 'occupé'])->default('disponible');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disponibilites');
    }
};
