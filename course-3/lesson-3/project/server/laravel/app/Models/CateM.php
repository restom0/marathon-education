<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CateM extends Model
{
    use HasFactory;
    protected $table = 'course_cates';
    protected $fillable = ['id', 'name', 'status', 'idEdu', 'created_at', 'updated_at'];
    protected $hidden = [];
}
