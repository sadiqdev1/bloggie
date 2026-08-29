<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Onboarding extends Model
{
    protected $fillable = [
        "user_id",
        "current_step",
        "profile_done",
    ];
}
