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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // The content of the post
            $table->text('content')->nullable();

            // Post Type: 'text', 'media', or 'share'
            $table->string('type')->default('text');

            // For "Shares/Reposts": Points to the original post ID
            $table->foreignId('original_post_id')
                ->nullable()
                ->constrained('posts')
                ->onDelete('set null');

            // Visibility: 'public', 'connections', 'private'
            $table->string('visibility')->default('public');

            // Soft deletes allow for "Undo" or content recovery
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
