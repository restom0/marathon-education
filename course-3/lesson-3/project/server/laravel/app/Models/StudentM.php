<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentM extends Model
{
    use HasFactory;
    protected $table = 'student_tbl';
    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'status',
        'created_at',
        'updated_at'
    ];
    protected $hidden = [];
}
