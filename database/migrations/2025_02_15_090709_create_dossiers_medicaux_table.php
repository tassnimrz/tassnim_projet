<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDossiersMedicauxTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dossiers_medicaux', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fiche_patient_id');
            $table->text('vaccins')->nullable();
            $table->text('notes_medecin')->nullable();
            $table->timestamps();

            // Définir la clé étrangère
            $table->foreign('fiche_patient_id')->references('id')->on('fiche_patients')->onDelete('cascade');
            $table->unique('fiche_patient_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dossiers_medicaux');
    }
}
