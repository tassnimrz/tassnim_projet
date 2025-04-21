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
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('medecin_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('planning_jour_id')->constrained('planning_jours')->onDelete('cascade');
            $table->string('statut');
            $table->integer('position');
            $table->integer('priorite');
            $table->timestamps();
            $table->dateTime('heure_rendez_vous')->nullable();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
          $table->dropColumn('heure_rendez_vous');
    }
};
