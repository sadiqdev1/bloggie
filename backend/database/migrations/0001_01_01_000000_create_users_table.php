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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Basic account information
            $table->string('name');
            $table->string('username')->nullable()->unique();
            $table->string('email')->unique();

            // Google OAuth
            $table->string('google_id')->nullable()->unique();

            // Authentication
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();

            // Account role & status
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->timestamp('banned_at')->nullable();
            $table->text('ban_reason')->nullable();

            // Registration & login information
            $table->string('ip_registered', 45)->nullable();
            $table->timestamp('last_login_at')->nullable();

            $table->rememberToken();
            $table->timestamps();

            // Indexes
            $table->index('ip_registered');
            $table->index('banned_at');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Connection information
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            // Location information
            $table->string('location')->nullable();

            // Device information
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('device_type')->nullable();
            $table->string('device_name')->nullable();

            // Laravel session data
            $table->longText('payload');
            $table->integer('last_activity')->index();

            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};