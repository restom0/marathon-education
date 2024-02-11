<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseM extends Model
{
    use HasFactory;
    protected $table = 'course';
    protected $fillable = [
        'id', 'image', 'name', 'status', 'duration',
        'price', 'discount', 'Grade', 'summary', 'detail', 'idCourseCate',
        'created_at', 'updated_at'
    ];
    protected $hidden = [];
}
