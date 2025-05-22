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
        Schema::create('urgencies', function (Blueprint $table) {
            $table->id();
            $table->string('nom_patient');
            $table->string('telephone');
            $table->string('cin')->nullable(); // Numéro CIN tunisien
            $table->string('adresse');
            $table->string('ville')->nullable(); // Ville tunisienne
            $table->enum('gouvernorat', [
                'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
                'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
                'Kef', 'Mahdia', 'Manouba', 'Médenine', 'Monastir',
                'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
                'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
            ])->nullable();
            $table->integer('age')->nullable();
            $table->enum('genre', ['homme', 'femme', 'autre'])->nullable();
            $table->text('symptomes');
            $table->enum('niveau_urgence', ['critique', 'urgent', 'moyen', 'faible'])->default('urgent');
            $table->enum('type_urgence', ['ambulance', 'samu', 'pompiers', 'autre']);
            $table->string('hopital_cible')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->enum('etat', [
                'en_attente', 
                'appel_en_cours', 
                'ambulance_en_route', 
                'arrive_hopital',
                'termine',
                'echec'
            ])->default('en_attente');
            $table->text('notes_appel')->nullable();
            $table->string('numero_ambulance')->nullable();
            $table->timestamp('heure_prise_en_charge')->nullable();
            $table->timestamp('heure_arrivee_hopital')->nullable();
            $table->timestamps();
            
            // Index pour les recherches
            $table->index('nom_patient');
            $table->index('telephone');
            $table->index('etat');
            $table->index('gouvernorat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('urgencies');
    }
};