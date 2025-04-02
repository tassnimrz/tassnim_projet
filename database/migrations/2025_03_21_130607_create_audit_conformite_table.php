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
    Schema::create('audit_conformite', function (Blueprint $table) {
        $table->id();
        $table->string('type_verification');
        $table->enum('statut', ['Conforme', 'Non conforme']);
        $table->date('date_verification');
        $table->text('alertes')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_conformite');
    }
};
