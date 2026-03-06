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


            $table->string('location')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->text('bio')->nullable();
            $table->text('professional_summary')->nullable();
            $table->string('business_stage')->nullable(); // Idea, MVP, Scaling
            $table->json('skills')->nullable(); // Storing as JSON array
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn(['location', 'linkedin_url', 'bio', 'professional_summary',  'business_stage', 'skills']);
        });
    }
};
