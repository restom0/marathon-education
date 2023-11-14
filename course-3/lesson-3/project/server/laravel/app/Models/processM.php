<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class processM extends Model
{
    protected $table = 'process_tbl';
    protected $fillable = ['id', 'name', 'idTeacher', 'schedule', 'idCourse ', 'pass', 'duration', 'created_at', 'updated_at'];
    use HasFactory;
}
