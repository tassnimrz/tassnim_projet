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
    Schema::create('protocoles_securite', function (Blueprint $table) {
        $table->id();
        $table->string('type_protocole');
        $table->enum('statut', ['En cours', 'Terminé', 'Non respecté']);
        $table->date('date_mise_en_place');
        $table->text('description');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('protocoles_securite');
    }
};
