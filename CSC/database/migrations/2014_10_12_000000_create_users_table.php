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
            $table->string('firebase_uid')->unique(); // UID من Firebase
            $table->string('email')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');
            $table->string('password'); // احتياطي - أو احذف إذا لا تستخدم
            $table->string('profile_image')->nullable();
            $table->enum('user_type', ['admin', 'student'])->default('student');
            $table->boolean('is_active')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};