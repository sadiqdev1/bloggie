<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * User profiles & onboarding.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Public profile
            $table->text('bio')->nullable();
             $table->string('phone')->nullable();
            $table->string('country', 2)->nullable()->default('NG');
            $table->string('city')->nullable();
            $table->string('timezone')->nullable();

            // Social media handles
             // Example:
            //
            // {
            //     "github": "username",
            //     "twitter": "username",
            //     "linkedin": "username",
            //     "instagram": "username"
            // }
            $table->json('social_handles')->nullable();

            // Profile avatar
            // Cloudinary URL or null
            $table->string('avatar')->nullable();

            $table->timestamps();
        });

        Schema::create('onboardings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Current onboarding progress
            $table->unsignedTinyInteger('current_step')->default(1);

            // Whether the profile setup is complete
            $table->boolean('profile_done')->default(false);

            // Entire onboarding completed
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboardings');
        Schema::dropIfExists('profiles');
    }
};