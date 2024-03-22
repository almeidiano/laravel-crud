<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pump extends Model
{
    protected $fillable = [
        'image_url', 'name', 'description'
    ];
    use HasFactory;
}
