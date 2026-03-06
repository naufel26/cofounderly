<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->string('tagline')->nullable()->after('email');
            $table->string('role')->nullable()->after('tagline');
            $table->json('looking_for')->nullable()->after('role');
            $table->string('stage')->nullable()->after('looking_for');
            $table->json('interests')->nullable()->after('stage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn(['tagline', 'role', 'looking_for', 'stage', 'interests']);
        });
    }
};
