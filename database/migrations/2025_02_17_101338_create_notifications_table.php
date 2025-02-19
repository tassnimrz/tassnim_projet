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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Référence à l'utilisateur qui reçoit la notification
            $table->string('type'); // Type de notification (ex: 'rendez-vous confirmé', 'rendez-vous annulé', etc.)
            $table->text('message'); // Le message de la notification
            $table->timestamp('date_notification')->useCurrent(); // Date et heure de la notification
            $table->enum('statut', ['non lu', 'lu'])->default('non lu'); // Statut de la notification (si l'utilisateur a vu ou non)
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
