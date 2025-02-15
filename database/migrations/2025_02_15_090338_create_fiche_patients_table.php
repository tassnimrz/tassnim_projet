<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFichePatientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fiche_patients', function (Blueprint $table) {
            $table->id(); // Identifiant unique du patient
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_naissance');
            $table->enum('sexe', ['Masculin', 'Féminin', 'Autre']);
            $table->enum('etat_civil', ['Célibataire', 'Marié', 'Divorcé', 'Veuf'])->nullable(); // Peut être null
            $table->string('telephone');
            $table->string('email')->unique();
            $table->string('adresse')->nullable(); // Peut être null
            $table->string('ville')->nullable(); // Peut être null
            $table->string('code_postal')->nullable(); // Peut être null
            $table->string('groupe_sanguin')->nullable(); // Peut être null
            $table->text('allergies')->nullable(); // Peut être null
            $table->text('antecedents_medicaux')->nullable(); // Peut être null
            $table->text('traitement_en_cours')->nullable(); // Peut être null
            $table->string('assurance_medicale')->nullable(); // Peut être null
            $table->string('numero_assurance')->nullable(); // Peut être null
            $table->date('date_premiere_visite'); // Date de la première consultation
            $table->timestamps(); // Champs created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fiche_patients');
    }
}
