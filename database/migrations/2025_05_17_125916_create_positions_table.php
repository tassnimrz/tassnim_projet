<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePositionsTable extends Migration
{
    public function up()
    {
        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->unique();
            $table->double('lat', 10, 7)->nullable();
            $table->double('lng', 10, 7)->nullable();
            $table->timestamps(); // created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('positions');
    }
}