<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class scheduleM extends Model
{
    protected $table = 'class_schedule';
    protected $fillable = ['id', 'idTeacher', 'schedule', 'idCourse ', 'created_at', 'updated_at'];
    use HasFactory;
}
